# User Forums

Sign in, write comments, and return later for more discussion!

## Run the project

Start local dev server:

```Powershell
npx wrangler dev
```

Run against prod:

```Powershell
npx wrangler dev --remote
```

Run SQL file against the db:

```Powershelll
npx wrangler d1 execute user-forums-d1 --local --file=./schema.sql
```
