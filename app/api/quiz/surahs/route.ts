import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams.toString();
  const url = `${process.env.NEXT_PUBLIC_API_URL}/quiz/surahs${
    params ? `?${params}` : ""
  }`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        cookie: req.headers.get("cookie") || "",
      },
      cache: "no-store",
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      console.error("[quiz/surahs proxy] invalid JSON:", {
        status: res.status,
        preview: text.slice(0, 300),
      });
      return NextResponse.json(
        { error: "Upstream returned non-JSON response", status: res.status },
        { status: 502 },
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("[quiz/surahs proxy] fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch surahs" },
      { status: 500 },
    );
  }
}

export const dynamic = "force-dynamic";
