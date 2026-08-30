import { NextRequest, NextResponse } from "next/server";
import { getWeekStart } from "@/lib/week-utils";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const sortBy = searchParams.get("sortBy") || "points";
  const period = searchParams.get("period") || "alltime";

  const url = new URL(`${process.env.NEXT_PUBLIC_API_URL}/leaderboard`);
  url.searchParams.set("sortBy", sortBy);
  url.searchParams.set("period", period);

  if (period === "weekly") {
    const weekStart = getWeekStart();
    url.searchParams.set("weekStart", weekStart.toISOString());
  }

  try {
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: {
        cookie: req.headers.get("cookie") || "",
      },
      credentials: "include",
    });

    const data = await res.json();

    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error("Leaderboard proxy error:", err);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 },
    );
  }
}
