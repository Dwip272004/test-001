import { NextRequest, NextResponse } from "next/server";
import { createReq } from "@/lib/store";

const MAX_BYTES = 4 * 1024 * 1024; // Vercel functions accept request bodies up to 4.5 MB
const ALLOWED = [".pdf", ".doc", ".docx", ".txt", ".md", ".rtf"];

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const text = (k: string) => String(form.get(k) ?? "").trim();
  const file = form.get("file");

  const title = text("title");
  const recruiter = text("recruiter");
  if (!title || !recruiter) {
    return NextResponse.json({ error: "Job title and recruiter name are required." }, { status: 400 });
  }
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Attach the job description file." }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File is larger than 4 MB." }, { status: 413 });
  }
  if (!ALLOWED.some((ext) => file.name.toLowerCase().endsWith(ext))) {
    return NextResponse.json({ error: `Use one of: ${ALLOWED.join(", ")}` }, { status: 415 });
  }

  const created = await createReq(
    { title, recruiter, client: text("client"), location: text("location") },
    file,
  );
  return NextResponse.json(created, { status: 201 });
}
