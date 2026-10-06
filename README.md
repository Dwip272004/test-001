# Req Desk

Recruiters submit reqs by uploading a job description, then add notes to each req.
Hosted on Vercel; JD files and records are stored in Vercel Blob.

## Deploy
1. Push this repo and import it in Vercel.
2. In the project, open **Storage → Create → Blob** and connect it (this adds `BLOB_STORE_ID`, or `BLOB_READ_WRITE_TOKEN` on older stores). Stores are private by default; if you made a public store, also set `BLOB_ACCESS=public`.
3. Add environment variables `APP_PASSWORD` (shared team password) and `SESSION_SECRET` (`openssl rand -hex 32`).
4. Deploy.

## Local
```
cp .env.example .env.local   # fill in the three values (use `vercel env pull` for the Blob token)
npm install && npm run dev
```

## Storage layout (Vercel Blob)
- `jds/<reqId>/<file>` uploaded JD
- `reqs/<reqId>.json` req record
- `notes/<reqId>/<noteId>.json` one blob per note

JDs are streamed through `/api/reqs/<id>/file`, so they stay behind the login on private stores. Max JD size is 4 MB (Vercel function body limit).
For many thousands of reqs, move the records to Postgres and keep Blob for the files.
