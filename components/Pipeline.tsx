import type { HTMLAttributes, ReactNode } from "react";

type PipelineProps = {
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLDivElement>, "children" | "className">;

function PipelineRoot({ children, className, ...rest }: PipelineProps) {
  return (
    <div className={className ? `pipeline ${className}` : "pipeline"} {...rest}>
      {children}
    </div>
  );
}

type StepProps = {
  accent?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children" | "className">;

function Step({ accent = false, children, className, ...rest }: StepProps) {
  const classes = accent ? "step step-accent" : "step";
  return (
    <span className={className ? `${classes} ${className}` : classes} {...rest}>
      {children}
    </span>
  );
}

type ArrowProps = {
  children?: ReactNode;
  className?: string;
} & Omit<HTMLAttributes<HTMLSpanElement>, "children" | "className">;

function Arrow({ children = "→", className, ...rest }: ArrowProps) {
  return (
    <span
      className={className ? `pipeline-arrow ${className}` : "pipeline-arrow"}
      {...rest}
    >
      {children}
    </span>
  );
}

export const Pipeline = Object.assign(PipelineRoot, { Step, Arrow });
