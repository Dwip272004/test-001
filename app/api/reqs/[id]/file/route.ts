import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { ACCESS, getReq } from "@/lib/store";

// Streams the JD through the app so it works for private stores and stays behind the login.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const req = await getReq(id);
  if (!req) return NextResponse.json({ error: "Req not found." }, { status: 404 });

  const blob = await get(req.file.pathname, { access: ACCESS, useCache: false });
  if (!blob || blob.statusCode !== 200) {
    return NextResponse.json({ error: "File not found." }, { status: 404 });
  }
  const filename = encodeURIComponent(req.file.name);
  return new NextResponse(blob.stream, {
    headers: {
      "content-type": req.file.type || blob.blob.contentType,
      "content-disposition": `inline; filename*=UTF-8''${filename}`,
      "cache-control": "private, no-store",
    },
  });
}
