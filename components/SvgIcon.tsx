type IconName =
  | "calendar-repeat"
  | "calendar"
  | "check-circle"
  | "chevron-right"
  | "crown"
  | "fire"
  | "pause-circle"
  | "pause"
  | "play-circle"
  | "play"
  | "sparkles"
  | "star"
  | "translation";

type ClassValue =
  | ClassValue[]
  | Record<string, boolean>
  | string
  | number
  | null
  | false
  | undefined;

function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const push = (v: ClassValue) => {
    if (!v) return;
    if (typeof v === "string" || typeof v === "number") {
      out.push(String(v));
    } else if (Array.isArray(v)) {
      v.forEach(push);
    } else if (typeof v === "object") {
      for (const key in v) if ((v as Record<string, boolean>)[key]) out.push(key);
    }
  };
  inputs.forEach(push);
  return out.join(" ");
}

interface SvgIconProps {
  name: IconName;
  className?: string;
  size?: number;
  alt?: string;
}

export function SvgIcon({ name, className, size = 20, alt }: SvgIconProps) {
  return (
    <img
      src={`/icons/${name}.svg`}
      alt={alt ?? name}
      width={size}
      height={size}
      className={cn("inline-block flex-shrink-0 select-none", className)}
      draggable={false}
    />
  );
}

export { type IconName };
