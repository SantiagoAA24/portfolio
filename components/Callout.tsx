import type { HTMLAttributes, ReactNode } from "react";

export type CalloutProps = {
  label?: ReactNode;
  accent?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Callout({
  label,
  accent = false,
  children,
  className,
  ...rest
}: CalloutProps) {
  const classes = className ? `callout ${className}` : "callout";

  return (
    <aside className={classes} {...rest}>
      {label ? (
        <div className={accent ? "callout-label callout-label-accent" : "callout-label"}>
          {label}
        </div>
      ) : null}
      <div className="callout-body">{children}</div>
    </aside>
  );
}
