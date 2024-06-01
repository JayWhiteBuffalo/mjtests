## Run locally

1. Clone this repo, and then run `pnpm install` to install dependencies:

```bash
npm install -g pnpm
git clone git@github.com:dhe128/treemap-three.git
cd treemap-three
pnpm install
```

`pnpm install` will need to be rerun whenever the new dependencies are added or removed.

2. (removed)

3. Start the dev server:

```bash
pnpm run dev
```

Then open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

4. _(Optional)_ Grant yourself admin role, and populate the db with test products via the development interface at http://localhost:3000/admin/dev .

## Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.
