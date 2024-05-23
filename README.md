## Run locally

1. Clone this repo, and then run `pnpm install` to install dependencies:

```bash
cd ~/src
git clone git@github.com:dhe128/treemap-three.git
cd treemap-three
npm install -g pnpm
pnpm install
```

`pnpm install` will need to be rerun whenever the new dependencies are added or removed.

2. Set up your local PostgreSQL instance

- 2a. Download and install PostgreSQL 16, then start it.

  Windows: https://www.postgresql.org/download/windows/

  OS X: https://postgresapp.com/

- 2b. Change the `DATABASE_URL` environment variable in `.env` so that it points to your postgres installation

```bash
DATABASE_URL="postgresql://dhe@localhost:5432/treemap_three?schema=public"
```

- 2c. Run

```bash
pnpx prisma db push
```

to initialize tables used by treemap. This command will need to be rerun whenever the schema changes in the future.

3. Start the dev server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. _(Optional)_ Grant yourself admin role, and populate the db with test products via the development interface at http://localhost:3000/admin/dev .

## Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
