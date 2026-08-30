"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/better-auth/client";
import { getWeekStart, formatWeekRange } from "@/lib/week-utils";

interface LeaderboardUser {
  id: string;
  displayName: string | null;
  longestStreak: number;
  longestCorrectStreak: number;
  totalCorrect: number;
  totalPoints: number;
}

interface CurrentUserRank extends LeaderboardUser {
  rank: number;
}

type Period = "alltime" | "weekly";
type SortBy = "daily" | "correct" | "points";

export default function LeaderboardPage() {
  const [users, setUsers] = useState<LeaderboardUser[]>([]);
  const [currentUser, setCurrentUser] = useState<CurrentUserRank | null>(null);
  const [sortBy, setSortBy] = useState<SortBy>("points");
  const [period, setPeriod] = useState<Period>("alltime");
  const [loadedSortBy, setLoadedSortBy] = useState<SortBy | null>(null);
  const [loadedPeriod, setLoadedPeriod] = useState<Period | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [retryTick, setRetryTick] = useState(0);
  const [locale] = useState<"id" | "en">(() => {
    if (typeof window === "undefined") return "id";
    const stored = localStorage.getItem("app-language")?.toLowerCase();
    return stored === "en" || stored === "id" ? stored : "id";
  });

  const loading = loadedSortBy !== sortBy || loadedPeriod !== period;

  useEffect(() => {
    authClient.getSession().then(({ data }) => {
      setIsLoggedIn(!!data?.user);
      setCheckingSession(false);
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set("sortBy", sortBy);
    params.set("period", period);

    fetch(`/api/leaderboard?${params.toString()}`, {
      credentials: "include",
      headers: { Accept: "application/json" },
    })
      .then(async (res) => {
        const text = await res.text();
        let json: unknown;
        try {
          json = JSON.parse(text);
        } catch {
          throw new Error(
            `Invalid response (status ${res.status}): ${text.slice(0, 120)}`,
          );
        }
        if (!res.ok) {
          const err = (json as { error?: string })?.error || res.statusText;
          throw new Error(`Server error ${res.status}: ${err}`);
        }
        const payload = json as {
          data?: {
            topUsers?: LeaderboardUser[];
            currentUser?: CurrentUserRank | null;
          };
        };
        const data = payload.data || (json as { topUsers?: LeaderboardUser[]; currentUser?: CurrentUserRank | null });
        setErrorMsg(null);
        if (Array.isArray(data?.topUsers)) setUsers(data.topUsers);
        else setUsers([]);
        if (data?.currentUser) setCurrentUser(data.currentUser);
        else setCurrentUser(null);
        setLoadedSortBy(sortBy);
        setLoadedPeriod(period);
      })
      .catch((err) => {
        console.error("Failed to load leaderboard", err);
        setErrorMsg(err instanceof Error ? err.message : "Unknown error");
        setUsers([]);
        setCurrentUser(null);
        setLoadedSortBy(sortBy);
        setLoadedPeriod(period);
      });
  }, [sortBy, period, retryTick]);

  const weekStart = getWeekStart();
  const weekRangeText = formatWeekRange(weekStart, locale);

  const t =
    locale === "en"
      ? {
          title: "Consistency Board",
          subtitle: "Consistency in learning the Qur'an",
          guestWarning:
            "You are not logged in. Your practice results will not be saved to the leaderboard.",
          points: "Points",
          daily: "Day Streak",
          correct: "Correct Answers",
          alltime: "All-Time",
          weekly: "Weekly",
          resetInfo: "Resets every Monday 00:00",
          weekLabel: "This week",
          loading: "Loading data...",
          noData: "No data yet. Be the first!",
          rankLabel: "Your Rank",
          totalCorrect: "Total Correct",
          streakLabel: "Streak",
          you: "You",
          back: "← Back to Main Menu",
          totalPoints: "Total Points",
          days: "Days",
          correctCount: "Correct",
        }
      : {
          title: "Papan Konsistensi",
          subtitle: "Istiqomah dalam mempelajari Al-Qur'an",
          guestWarning:
            "Antum belum login. Hasil latihan antum tidak akan tersimpan di leaderboard.",
          points: "Poin",
          daily: "Streak Hari",
          correct: "Jawaban Benar",
          alltime: "Sepanjang Waktu",
          weekly: "Mingguan",
          resetInfo: "Reset tiap Senin 00.00",
          weekLabel: "Minggu ini",
          loading: "Memuat data...",
          noData: "Belum ada data. Jadilah yang pertama!",
          rankLabel: "Peringkat Antum",
          totalCorrect: "Total Benar",
          streakLabel: "Streak",
          you: "You",
          back: "← Kembali ke Menu Utama",
          totalPoints: "Total Poin",
          days: "Hari",
          correctCount: "Benar",
        };

  return (
    <div className="min-h-screen bg-background text-foreground pt-24 pb-6 px-6 flex flex-col items-center">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
            {t.title}
          </h1>
          <p className="text-muted-foreground">{t.subtitle}</p>

          {!checkingSession && !isLoggedIn && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-center text-sm text-amber-600 dark:text-amber-400 animate-in fade-in slide-in-from-top-2">
              ⚠️ {t.guestWarning}
            </div>
          )}

          {/* Period Tabs */}
          <div className="flex justify-center mt-6">
            <div className="inline-flex rounded-full bg-muted p-1 flex-col sm:flex-row gap-1">
              <button
                onClick={() => setPeriod("alltime")}
                className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                  ${
                    period === "alltime"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                🏆 {t.alltime}
              </button>
              <div className="relative">
                <button
                  onClick={() => setPeriod("weekly")}
                  className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200 w-full
                    ${
                      period === "weekly"
                        ? "bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-amber-500/20 text-foreground shadow-sm ring-1 ring-foreground/10"
                        : "text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  ⚡ {t.weekly}
                </button>
              </div>
            </div>
          </div>

          {period === "weekly" && (
            <div className="flex flex-col items-center gap-1 mt-3 animate-in fade-in slide-in-from-top-2">
              <div className="text-sm font-medium text-foreground/80 flex items-center gap-2">
                <span className="text-lg">📅</span>
                <span>{weekRangeText}</span>
              </div>
              <div className="text-[11px] text-muted-foreground uppercase tracking-wider">
                🔄 {t.resetInfo}
              </div>
            </div>
          )}

          {/* Sort Tabs */}
          <div className="flex justify-center mt-4">
            <div className="inline-flex rounded-full bg-muted p-1">
              <button
                onClick={() => setSortBy("points")}
                className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                  ${
                    sortBy === "points"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                🌟 {t.points}
              </button>
              <button
                onClick={() => setSortBy("daily")}
                className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                  ${
                    sortBy === "daily"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                🔥 {t.daily}
              </button>
              <button
                onClick={() => setSortBy("correct")}
                className={`px-4 md:px-6 py-2 rounded-full text-xs md:text-sm font-medium transition-all duration-200
                  ${
                    sortBy === "correct"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }
                `}
              >
                ✅ {t.correct}
              </button>
            </div>
          </div>
        </div>

        {/* List */}
        <div className="bg-card border border-border rounded-3xl shadow-sm overflow-hidden">
          {errorMsg && !loading && (
            <div className="p-4 sm:p-6 text-center border-b border-border bg-red-500/5">
              <div className="flex flex-col items-center gap-3">
              <div className="text-sm font-medium text-red-600 dark:text-red-400 flex items-center gap-2">
                <span>❌</span>
                <span>
                  {locale === "en" ? "Failed to load data" : "Gagal memuat data"}
                </span>
              </div>
              <div className="text-xs text-muted-foreground max-w-md break-all font-mono bg-muted/50 px-3 py-2 rounded-lg">
                {errorMsg}
              </div>
              <button
                onClick={() => {
                  setLoadedSortBy(null);
                  setLoadedPeriod(null);
                  setRetryTick((t) => t + 1);
                }}
                className="text-xs px-4 py-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
              >
                🔄 {locale === "en" ? "Retry" : "Coba Lagi"}
              </button>
            </div>
            </div>
          )}
          {loading ? (
            <div className="p-12 text-center text-muted-foreground animate-pulse">
              {t.loading}
            </div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              {t.noData}
            </div>
          ) : (
            <div className="divide-y divide-border">
              {/* Table Header */}
              <div className="grid grid-cols-10 sm:grid-cols-12 gap-2 sm:gap-4 p-4 bg-muted/30 text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground font-medium">
                <div className="col-span-2 sm:col-span-2 text-center">#</div>
                <div className="col-span-6 sm:col-span-6">Nama</div>
                <div className="col-span-2 sm:col-span-2 text-center">
                  {sortBy === "points" ? t.points : t.streakLabel}
                </div>
                <div className="hidden sm:block sm:col-span-2 text-center">
                  {t.totalCorrect}
                </div>
              </div>

              {users.map((user, index) => {
                const rank = index + 1;
                const isTop1 = rank === 1;
                const isTop3 = rank <= 3;

                return (
                  <div
                    key={user.id}
                    className={`grid grid-cols-10 sm:grid-cols-12 gap-2 sm:gap-4 p-4 items-center transition-colors hover:bg-muted/20
                      ${isTop1 ? "bg-amber-500/5 dark:bg-amber-500/10" : ""}
                    `}
                  >
                    {/* Rank */}
                    <div className="col-span-2 sm:col-span-2 flex justify-center">
                      <div
                        className={`
                        w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full font-bold text-xs sm:text-sm
                        ${
                          isTop1
                            ? "bg-gradient-to-br from-amber-200 to-amber-400 text-amber-900 dark:from-amber-700/60 dark:to-amber-500/40 dark:text-amber-200 ring-2 ring-amber-500/30 shadow-lg shadow-amber-500/10"
                            : isTop3
                              ? "bg-muted text-foreground"
                              : "text-muted-foreground"
                        }
                      `}
                      >
                        {rank}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="col-span-6 sm:col-span-6 font-medium truncate flex items-center gap-2 text-sm sm:text-base">
                      {user.displayName || "Hamba Allah"}
                      {isTop1 && (
                        <span className="text-amber-500 text-xs sm:text-sm animate-bounce">
                          👑
                        </span>
                      )}
                    </div>

                    {/* Streak / Points */}
                    <div className="col-span-2 sm:col-span-2 text-center font-mono text-xs sm:text-sm">
                      <span
                        className={`font-bold ${sortBy === "points" ? "text-emerald-500" : "text-orange-500"}`}
                      >
                        {sortBy === "points"
                          ? `🌟 ${user.totalPoints || 0}`
                          : sortBy === "daily"
                            ? `🔥 ${user.longestStreak}`
                            : `🔥 ${user.longestCorrectStreak}`}
                      </span>
                      <div className="text-[9px] sm:text-[10px] text-muted-foreground uppercase tracking-wider mt-1 hidden sm:block">
                        {sortBy === "points"
                          ? t.totalPoints
                          : sortBy === "daily"
                            ? t.days
                            : t.correctCount}
                      </div>
                    </div>

                    {/* Total */}
                    <div className="hidden sm:block sm:col-span-2 text-center font-mono text-sm text-muted-foreground">
                      {user.totalCorrect}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Current User Rank (Sticky or Separate) */}
        {!loading && currentUser && (
          <div className="bg-card border border-primary/20 rounded-2xl shadow-sm p-4 animate-in fade-in slide-in-from-bottom-4">
            <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold mb-2 text-center">
              {t.rankLabel}
            </div>
            <div className="grid grid-cols-10 sm:grid-cols-12 gap-2 sm:gap-4 items-center">
              {/* Rank */}
              <div className="col-span-2 sm:col-span-2 flex justify-center">
                <div className="w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm bg-primary/10 text-primary ring-2 ring-primary/20">
                  {currentUser.rank}
                </div>
              </div>

              {/* Name */}
              <div className="col-span-6 sm:col-span-6 font-medium truncate flex items-center gap-2 text-base">
                {currentUser.displayName || "Hamba Allah"}
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {t.you}
                </span>
              </div>

              {/* Streak / Points */}
              <div className="col-span-2 sm:col-span-2 text-center font-mono text-sm">
                <span
                  className={`font-bold ${sortBy === "points" ? "text-emerald-500" : "text-orange-500"}`}
                >
                  {sortBy === "points"
                    ? `🌟 ${currentUser.totalPoints || 0}`
                    : sortBy === "daily"
                      ? `🔥 ${currentUser.longestStreak}`
                      : `🔥 ${currentUser.longestCorrectStreak}`}
                </span>
              </div>

              {/* Total */}
              <div className="hidden sm:block sm:col-span-2 text-center font-mono text-sm text-muted-foreground">
                {currentUser.totalCorrect}
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <Link href="/" className="text-primary hover:underline text-sm">
            {t.back}
          </Link>
        </div>
      </div>
    </div>
  );
}
