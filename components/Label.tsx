import type { HTMLAttributes, ReactNode } from "react";

export type LabelProps = {
  accent?: boolean;
  as?: "div" | "span";
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLElement>, "children" | "className">;

export function Label({
  accent = false,
  as: Tag = "div",
  children,
  className,
  ...rest
}: LabelProps) {
  const classes = accent ? "label label-accent" : "label";
  return (
    <Tag className={className ? `${classes} ${className}` : classes} {...rest}>
      {children}
    </Tag>
  );
}
