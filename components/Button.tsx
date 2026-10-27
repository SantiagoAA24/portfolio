import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "outline";

type SharedProps = {
  variant: Variant;
  children: ReactNode;
  className?: string;
};

type ButtonAsLink = SharedProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children" | "className"> & {
    href: string;
  };

type ButtonAsButton = SharedProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children" | "className"> & {
    href?: undefined;
  };

export type ButtonProps = ButtonAsLink | ButtonAsButton;

function buttonClassName(variant: Variant, className?: string): string {
  const base = `btn btn-${variant}`;
  return className ? `${base} ${className}` : base;
}

export function Button(props: ButtonProps) {
  const { variant, children, className, ...rest } = props;
  const classes = buttonClassName(variant, className);

  if ("href" in props && props.href !== undefined) {
    const { href, ...anchorRest } = rest as Omit<
      ButtonAsLink,
      "variant" | "children" | "className"
    >;
    return (
      <a href={href} className={classes} {...anchorRest}>
        {children}
      </a>
    );
  }

  const buttonRest = rest as Omit<ButtonAsButton, "variant" | "children" | "className">;
  const { type = "button", ...buttonAttrs } = buttonRest;
  return (
    <button type={type} className={classes} {...buttonAttrs}>
      {children}
    </button>
  );
}
