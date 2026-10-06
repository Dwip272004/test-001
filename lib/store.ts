import { get, list, put } from "@vercel/blob";

export type Req = {
  id: string;
  title: string;
  client: string;
  location: string;
  recruiter: string;
  createdAt: string;
  file: { url: string; pathname: string; name: string; size: number; type: string };
};

export type Note = {
  id: string;
  reqId: string;
  author: string;
  body: string;
  createdAt: string;
};

// Must match the store type: a private store rejects "public" and vice versa.
// Vercel creates private stores by default now; set BLOB_ACCESS=public for a public one.
export const ACCESS: "public" | "private" =
  process.env.BLOB_ACCESS === "public" ? "public" : "private";

// Layout in the Blob store:
//   jds/<reqId>/<original filename>   the uploaded JD (public URL, random suffix)
//   reqs/<reqId>.json                 the req record
//   notes/<reqId>/<noteId>.json       one blob per note, so concurrent notes never overwrite each other

export const newId = () =>
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

async function listAll(prefix: string) {
  const out = [];
  let cursor: string | undefined;
  do {
    const page = await list({ prefix, cursor });
    out.push(...page.blobs);
    cursor = page.hasMore ? page.cursor : undefined;
  } while (cursor);
  return out;
}

async function readJson<T>(url: string): Promise<T | null> {
  const res = await get(url, { access: ACCESS, useCache: false });
  if (!res || res.statusCode !== 200) return null;
  return JSON.parse(await new Response(res.stream).text()) as T;
}

export async function createReq(
  input: Omit<Req, "id" | "createdAt" | "file">,
  file: File,
): Promise<Req> {
  const id = newId();
  const jd = await put(`jds/${id}/${file.name}`, file, {
    access: ACCESS,
    addRandomSuffix: true,
    contentType: file.type || undefined,
  });
  const req: Req = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
    file: { url: jd.url, pathname: jd.pathname, name: file.name, size: file.size, type: file.type },
  };
  await put(`reqs/${id}.json`, JSON.stringify(req), {
    access: ACCESS,
    addRandomSuffix: false,
    contentType: "application/json",
  });
  return req;
}

export async function listReqs(): Promise<Req[]> {
  const blobs = await listAll("reqs/");
  const reqs = await Promise.all(blobs.map((b) => readJson<Req>(b.url)));
  return reqs
    .filter((r): r is Req => r !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function getReq(id: string): Promise<Req | null> {
  const { blobs } = await list({ prefix: `reqs/${id}.json`, limit: 1 });
  return blobs[0] ? readJson<Req>(blobs[0].url) : null;
}

export async function addNote(reqId: string, author: string, body: string): Promise<Note> {
  const note: Note = {
    id: newId(),
    reqId,
    author,
    body,
    createdAt: new Date().toISOString(),
  };
  await put(`notes/${reqId}/${note.id}.json`, JSON.stringify(note), {
    access: ACCESS,
    addRandomSuffix: false,
    contentType: "application/json",
  });
  return note;
}

export async function listNotes(reqId: string): Promise<Note[]> {
  const blobs = await listAll(`notes/${reqId}/`);
  const notes = await Promise.all(blobs.map((b) => readJson<Note>(b.url)));
  return notes
    .filter((n): n is Note => n !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
