import * as React from "react";
import { cn } from "@/lib/utils";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-12 w-full rounded-full border border-foreground/10 bg-foreground/[0.04] px-5 text-sm text-foreground placeholder:text-foreground/40 transition-colors",
          "focus-visible:outline-none focus-visible:border-foreground/25 focus-visible:bg-foreground/[0.06]",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
