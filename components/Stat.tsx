import type { HTMLAttributes, ReactNode } from "react";

export type StatProps = {
  value: ReactNode;
  caption: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

export function Stat({ value, caption, className, ...rest }: StatProps) {
  return (
    <div className={className} {...rest}>
      <div className="stat-number">{value}</div>
      <div className="stat-caption">{caption}</div>
    </div>
  );
}
