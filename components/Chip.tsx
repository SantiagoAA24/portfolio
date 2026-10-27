import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

type SharedProps = {
  active?: boolean;
  children: ReactNode;
  className?: string;
};

type ChipAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ChipAsSpan = SharedProps &
  Omit<HTMLAttributes<HTMLSpanElement>, "children" | "className"> & {
    href?: undefined;
  };

export type ChipProps = ChipAsLink | ChipAsSpan;

function chipClassName(active: boolean | undefined, className?: string): string {
  const base = active ? "chip chip-active" : "chip";
  return className ? `${base} ${className}` : base;
}

export function Chip(props: ChipProps) {
  const { active, children, className, ...rest } = props;
  const classes = chipClassName(active, className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<
      ChipAsLink,
      "active" | "children" | "className"
    >;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const spanRest = rest as Omit<ChipAsSpan, "active" | "children" | "className">;
  return (
    <span className={classes} {...spanRest}>
      {children}
    </span>
  );
}
