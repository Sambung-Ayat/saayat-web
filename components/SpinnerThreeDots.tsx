import "./spinner-three-dots.css";

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

interface SpinnerThreeDotsProps {
  size?: number;
  dotSize?: number;
  gap?: number;
  color?: string;
  className?: string;
}

export function SpinnerThreeDots({
  size = 80,
  dotSize = 14,
  gap = 6,
  color = "currentColor",
  className,
}: SpinnerThreeDotsProps) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className={cn("sd-spinner", className)}
      style={
        {
          width: size,
          height: size,
          "--sd-dot-size": `${dotSize}px`,
          "--sd-gap": `${gap}px`,
          "--sd-color": color,
        } as React.CSSProperties
      }
    >
      <span className="sd-dot sd-dot-1" />
      <span className="sd-dot sd-dot-2" />
      <span className="sd-dot sd-dot-3" />
    </div>
  );
}
