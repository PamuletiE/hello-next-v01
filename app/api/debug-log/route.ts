import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    await fetch(
      "http://127.0.0.1:7785/ingest/dd16c5da-d445-428f-ae97-b57feb790154",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "1670fd",
        },
        body: JSON.stringify(payload),
        // @ts-expect-error Node fetch supports this in Next runtime
        keepalive: true,
      }
    );
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false }, { status: 200 });
  }
}

