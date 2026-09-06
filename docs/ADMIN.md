# Admin panel & database

The site now stores its content in MySQL instead of the hard-coded array in
`src/lib/data.js`. `/admin` is where posts are written, and every public page
reads the same database, so a post appears on the site as soon as it is saved.

The stack matches the student-management project: Next.js route handlers,
Prisma, zod for validation, and a signed session cookie (`jose` + `bcryptjs`).

## What lives where

| Path | What it is |
| --- | --- |
| `prisma/schema.prisma` | `User` and `Article` tables |
| `prisma/migrations/0_init` | The SQL that creates them |
| `prisma/seed.mjs` | Creates the admin login and imports the 179 old articles |
| `src/lib/` | `prisma`, `auth`, `response`, `errors`, `api` helpers |
| `src/services/` | Business logic — article CRUD, login, uploads |
| `src/validations/` | zod schemas for the request bodies |
| `src/app/api/` | The HTTP layer |
| `src/app/admin/` | The admin screen |
| `src/lib/content.js` | The read side the public pages use |

## First-time setup

### 1. Create the database

In hPanel → **Databases** → **MySQL Databases**, create a database and a user,
and give that user access to it. Note the host (`srv1001.hstgr.io` for the
existing plan), the database name, the user and the password.

### 2. Fill in `.env`

`.env.example` lists every variable. Copy it and fill in the real values:

```env
DATABASE_URL="mysql://USER:PASSWORD@srv1001.hstgr.io:3306/DATABASE"
JWT_SECRET="a long random string"
ADMIN_EMAIL="you@example.com"
ADMIN_PASSWORD="the password you want to sign in with"
```

Generate the signing key rather than inventing one:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
```

Hostinger only accepts connections from allowed addresses, so add your own IP
under **Remote MySQL** in hPanel before running anything from your machine.

### 3. Create the tables and import the old posts

```bash
npx prisma migrate deploy   # creates User and Article
npm run db:seed             # admin login + the 179 existing articles
```

`migrate deploy` rather than `migrate dev`: shared hosting does not allow the
shadow database that `migrate dev` needs.

Both commands are safe to re-run. The seed upserts the admin user and skips any
article whose slug is already there, so it never overwrites edits made in the
panel.

The old numeric ids become the slugs, so links like `/katurai/1` keep working.

### 4. Run it

```bash
npm run dev
```

Then open <http://localhost:3000/admin> and sign in with `ADMIN_EMAIL` /
`ADMIN_PASSWORD`.

## Adding a post

The form follows the order of the fields:

1. **Section** — one of the seven divisions from `src/lib/divisions.js`.
2. **Heading** — the title, and what the URL slug is derived from.
3. **Thumbnail** — upload a file, paste an image link, or use the ready-made
   image for the section.
4. **Full description** — the article body. Leave a blank line between
   paragraphs; each block becomes its own `<p>` on the article page.

Sub-category, author, date, status and an optional video link follow. Saving as
**Draft** keeps a post inside the panel; **Published** puts it on the site.

The list on the right edits and deletes existing posts, including the imported
ones, and filters by heading or section.

## Uploads

Uploaded thumbnails are written to `uploads/` in the project root — *not*
`public/`, which is build output and would be wiped on redeploy. They are served
by `/api/media/<file>`.

Only JPG, PNG, WebP and GIF up to 5 MB are accepted. SVG is rejected on purpose:
it can carry script, and these files are served from the site's own origin.

Point `UPLOAD_DIR` at a directory outside the deployment folder to keep images
across deploys. Whatever it points at must survive a redeploy and be writable.

## Deploying to Hostinger

Needs a plan with the **Node.js** section in hPanel (Business or Cloud) — the
API cannot run on a static-only plan.

Manbayee gets its **own website entry**, separate from any other app on the
account. Sharing one is what nearly put these tables inside the office app's
database: the `u230921990_` prefix is account-wide, so the database list looks
shared even though the sites are not.

0. hPanel → **Websites** → **Add website**, and choose a **temporary domain**
   (a free `*.hostingersite.com` address). Everything below — Databases,
   Environment variables, Deployments, Node.js — is then configured on *that*
   site, not on any existing one. Point it at the real domain later; nothing in
   this project hard-codes the address.

1. Set the environment variables **before** the first deploy, in hPanel →
   **Environment variables**. Without `DATABASE_URL` the app boots and then
   fails every request, which looks like a broken build rather than missing
   config.

   | Key | Value |
   | --- | --- |
   | `DATABASE_URL` | the MySQL connection string |
   | `JWT_SECRET` | a long random string, **not** the development one |
   | `NODE_ENV` | `production` |
   | `ADMIN_EMAIL`, `ADMIN_PASSWORD` | only needed when seeding |
   | `UPLOAD_DIR` | a writable path kept outside the deploy folder |

   `.env.production` in the project root holds these ready to fill in — use
   **Import .env** on that page and they all land at once. It is gitignored, so
   it lives only on your machine and in that upload box.

   `NODE_ENV=production` is what puts the `Secure` flag on the session cookie.
   Without it the session travels in the clear.

2. Deploy from hPanel → **Deployments**. Next.js is auto-detected; the output
   directory is `.next`. `npm run build` runs `prisma generate` first, so the
   client is always built against the current schema.

3. Apply migrations from a machine that can reach the database:

   ```bash
   npx prisma migrate deploy
   ```

### After deploying

```bash
curl -I  https://your-site/                 # 200, HTML
curl -sI https://your-site/api/auth/me      # 401, JSON
```

A JSON 401 from `/api/auth/me` means the API is live. Then sign in through the
browser — that is what proves the cookie round-trip works, which curl does not.

If the screens load but every request 401s, the cookie is being dropped: check
the site is on HTTPS and that `NODE_ENV=production` is set.

## API

All responses use the same envelope: `{ success, message, data, errors }`.

| Method | Route | Auth | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | — | Sign in, sets the session cookie |
| `POST` | `/api/auth/logout` | — | Clear the cookie |
| `GET` | `/api/auth/me` | ✔ | The signed-in user |
| `GET` | `/api/articles` | — | Published posts; signed in, drafts too |
| `POST` | `/api/articles` | ✔ | Create |
| `GET/PUT/DELETE` | `/api/articles/:id` | ✔ | Read, update, delete |
| `POST` | `/api/upload` | ✔ | Store a thumbnail |
| `GET` | `/api/media/:name` | — | Serve a stored thumbnail |

`:id` is the numeric database id, which the admin list carries as `dbId`. The
public pages use the slug instead.
