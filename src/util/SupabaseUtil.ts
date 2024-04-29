import FnUtil from "@util/FnUtil";

export const throwOnError = ({ data, error }) => {
  if (error) {
    throw error;
  }
  return data;
};

export const toRecords = ({ data, error }) => {
  if (error) {
    throw error;
  }
  if (!(data instanceof Array)) {
    throw new Error("Expected array of records from supabase query");
  }
  return data;
};

export const uniqueRecord = ({ data, error }) => {
  if (error) {
    throw error;
  }
  if (data.length > 1) {
    throw Error(
      "Multiple results from supabase query found, expected at most one"
    );
  }
  return data[0];
};

export const makeStorageUrl = (bucketName, path) => {
  if (bucketName) {
    return `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/${bucketName}/${path}`;
  } else {
    return `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/${path}`;
  }
};

export const extractStorageUrl = (url) => {
  const match = url.match(
    /^https?\:\/\/(\w+).supabase.co\/storage\/v1\/object\/public\/(\w+)\/(.*)$/
  );
  if (match) {
    const [_, supabaseId, bucketName, path] = match;
    return { supabaseId, bucketName, path };
  } else {
    return {};
  }
};

export class SupabaseSingleFetcher {
  makeQuery: any;
  aborter: any;
  constructor(makeQuery) {
    this.makeQuery = makeQuery;
  }

  fetch(args) {
    if (this.aborter) {
      this.aborter.abort();
    }
    this.aborter = new AbortController();
    return this.makeQuery(args)
      .abortSignal(this.aborter.signal)
      .then(({ data, error }) => {
        if (error?.code === "20") {
          // DOMException.ABORT_ERR
          return new Promise(FnUtil.void);
        }
        return { data, error };
      })
      .then(toRecords)
      .finally(() => delete this.aborter);
  }

  abort() {
    this.aborter.abort();
  }
}

// https://www.postgresql.org/docs/current/functions-matching.html#FUNCTIONS-LIKE
export const escapeLikePattern = (x) => x.replace(/([\\_%])/g, "\\$1");
