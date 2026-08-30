import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const upstream = `${process.env.NEXT_PUBLIC_API_URL}/quiz/validate`;
  let bodyText: string;
  try {
    bodyText = await req.text();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  try {
    const res = await fetch(upstream, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      body: bodyText,
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[quiz/validate proxy] invalid JSON:", {
        status: res.status,
        preview: text.slice(0, 300),
      });
      return NextResponse.json(
        { error: "Upstream returned non-JSON response", status: res.status },
        { status: 502 },
      );
    }

    const setCookieHeader = res.headers.get("set-cookie");
    const responseHeaders: Record<string, string> = {};
    if (setCookieHeader) responseHeaders["set-cookie"] = setCookieHeader;

    return NextResponse.json(data, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    console.error("[quiz/validate proxy] fetch error:", err);
    return NextResponse.json(
      { error: "Failed to validate answer" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
