create or replace function private.create_user_from_auth() returns trigger as
$$
begin
  insert into private."User" (id, name, email, "profileImageUrl", "updatedAt")
  values (new.id, new.email, new.email, new.raw_user_meta_data->>'avatar_url', now());

  return new;
end;
$$
language plpgsql
security definer;
