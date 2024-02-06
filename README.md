


## Run locally

1. Clone this repo, and then run `npm install` to install dependencies
```bash
cd ~/src
git clone git@github.com:dhe128/treemap-three.git
cd treemap-three
npm install
```

2. Set up your local PostgreSQL instance
    * 2a. Download and install PostgreSQL 16, then start it. 
Windows: https://www.postgresql.org/download/windows/
OS X: https://postgresapp.com/

    * 2b. Edit this line in `.env` to point to your postgres installation
```bash
DATABASE_URL="postgresql://dhe@localhost:5432/treemap_three?schema=public"
```

    * 2c. Run
```bash
npx prisma db push
```
to initialize tables used by treemap. This command will need to be rerun every time the schema changes in the future.


3. Start the dev server

```bash
npm run dev
```
Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. *(Optional)* Add test data to the database by running 
```bash
npx tsx src/test/populateTestData.js
```

## Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
