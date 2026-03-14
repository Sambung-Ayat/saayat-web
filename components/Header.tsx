"use client";

import { authClient, User } from "@/lib/better-auth/client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ModeToggle } from "./mode-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { Trophy, User as UserIcon } from "lucide-react";
import UserSettings from "./UserSettings";

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsub = authClient.useSession.subscribe(({ data }) => {
      setUser(data?.user ?? null);
      router.refresh();
    });

    return () => unsub();
  }, [router]);

  const handleLogin = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: window.location.href,
    });
  };

  const handleLogout = async () => {
    await authClient.signOut();
    router.refresh();
  };

  const isAnonymous = user?.isAnonymous === true;
  const isLoggedIn = !!user && !isAnonymous;
  const displayName = user?.name || "Hamba Allah";

  return (
    <header className="absolute top-0 w-full flex justify-between items-center p-4 sm:p-6 z-50 pointer-events-none">
      <div className="pointer-events-auto">
        <Link
          href="/"
          className="text-lg sm:text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity font-arabic"
        >
          Sa<span className="text-primary font-serif">Ayat</span>
        </Link>
      </div>

      <div className="pointer-events-auto flex items-center gap-2 sm:gap-4">
        <LanguageSwitcher />
        <ModeToggle />

        {/* leaderboard icon — visible for both guest and logged in */}
        {user && (
          <Link
            href="/leaderboard"
            className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
            title="Leaderboard"
          >
            <Trophy className="w-5 h-5" />
          </Link>
        )}

        {isLoggedIn ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
              title="Profil"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <div className="flex gap-2 sm:gap-4 items-center bg-background/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border shadow-sm">
              <span className="text-sm font-medium hidden sm:inline-block">
                {user.email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-muted-foreground hover:text-red-500 transition-colors uppercase tracking-wider font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        ) : isAnonymous ? (
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-full hover:bg-muted/50 text-muted-foreground hover:text-primary transition-colors"
              title="Profil"
            >
              <UserIcon className="w-5 h-5" />
            </button>
            <div className="bg-background/80 backdrop-blur-sm px-3 py-1.5 sm:px-4 sm:py-2 rounded-full border border-border shadow-sm">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline-block">
                {displayName}
              </span>
            </div>
            <button
              onClick={handleLogin}
              className="px-4 py-1.5 sm:px-5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
            >
              Login
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="px-4 py-1.5 sm:px-5 sm:py-2 bg-primary text-primary-foreground text-xs sm:text-sm font-medium rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
          >
            Login
          </button>
        )}
      </div>

      {showSettings && (isLoggedIn || isAnonymous) && (
        <UserSettings user={user} onClose={() => setShowSettings(false)} />
      )}
    </header>
  );
}
