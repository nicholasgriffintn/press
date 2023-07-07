import { put } from "@vercel/blob";
import { nanoid } from "nanoid";
import { NextResponse } from "next/server";

import { env } from "@/env.mjs";

export const runtime = "edge";

export async function POST(req: Request) {
  const file = req.body || "";
  const contentType = req.headers.get("content-type") || "text/plain";
  const filename = `${nanoid()}.${contentType.split("/")[1]}`;

  if (env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(filename, file, {
      contentType,
      access: "public",
    });

    return NextResponse.json(blob);
  }

  return NextResponse.json({ ok: false });
}
