import { cn } from "@/lib/utils/cn";
import type { InputHTMLAttributes, ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  wrapperClassName?: string;
}

export function Input({ leftIcon, rightIcon, wrapperClassName, className, ...props }: InputProps) {
  if (!leftIcon && !rightIcon) {
    return (
      <input
        className={cn(
          "h-9 w-full rounded-lg border border-zinc-700 bg-zinc-800/60 px-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors",
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className={cn("relative flex items-center", wrapperClassName)}>
      {leftIcon && <span className="absolute left-3 text-zinc-500">{leftIcon}</span>}
      <input
        className={cn(
          "h-9 w-full rounded-lg border border-zinc-700 bg-zinc-800/60 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors",
          leftIcon ? "pl-9 pr-3" : "px-3",
          rightIcon ? "pr-9" : "",
          className
        )}
        {...props}
      />
      {rightIcon && <span className="absolute right-3 text-zinc-500">{rightIcon}</span>}
    </div>
  );
}
