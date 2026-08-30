export function getWeekStart(date: Date = new Date()): Date {
  const d = new Date(date);
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export function getWeekEnd(weekStart: Date): Date {
  const d = new Date(weekStart);
  d.setUTCDate(d.getUTCDate() + 6);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

export function formatWeekRange(weekStart: Date, locale: "id" | "en" = "id"): string {
  const weekEnd = getWeekEnd(weekStart);
  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "short",
  };
  const startStr = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    options,
  ).format(weekStart);
  const endStr = new Intl.DateTimeFormat(
    locale === "id" ? "id-ID" : "en-US",
    { ...options, year: "numeric" },
  ).format(weekEnd);
  return `${startStr} – ${endStr}`;
}
