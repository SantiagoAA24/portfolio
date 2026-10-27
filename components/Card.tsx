import type { ReactNode } from "react";

export type CardProps = {
  dashed?: boolean;
  children: ReactNode;
  className?: string;
  as?: "div" | "article" | "form" | "a";
  href?: string;
};

function cardClassName(dashed: boolean | undefined, className?: string): string {
  const base = dashed ? "card card-dashed" : "card";
  return className ? `${base} ${className}` : base;
}

export function Card({
  dashed,
  children,
  className,
  as = "div",
  href,
}: CardProps) {
  const classes = cardClassName(dashed, className);

  if (as === "a" || href !== undefined) {
    return (
      <a href={href ?? "#"} className={classes}>
        {children}
      </a>
    );
  }

  if (as === "article") {
    return <article className={classes}>{children}</article>;
  }

  if (as === "form") {
    return <form className={classes}>{children}</form>;
  }

  return <div className={classes}>{children}</div>;
}
