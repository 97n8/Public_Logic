import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const Button = React.forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'ghost' | 'outline' | 'danger', size?: 'sm' | 'md' | 'lg', isLoading?: boolean }>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: "bg-accent-primary text-bg-dark hover:bg-accent-primary/90 shadow-lg shadow-accent-primary/20",
      ghost: "hover:bg-surface-hover text-text-muted hover:text-text-primary",
      outline: "border border-line hover:border-accent-primary/40 text-text-primary",
      danger: "bg-danger/20 text-danger border border-danger/30 hover:bg-danger/30"
    };
    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-4 text-base"
    };
    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-small font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : null}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export const Card = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'hero' }) => (
  <div className={cn(
    "rounded-large border transition-all duration-300",
    variant === 'default' ? "bg-surface/40 border-line backdrop-blur-sm" : "bg-gradient-to-br from-bg-medium to-bg-dark border-accent-primary/20 p-6",
    className
  )}>
    {children}
  </div>
);

export const Badge = ({ children, className, variant = 'default' }: { children: React.ReactNode, className?: string, variant?: 'default' | 'mint' | 'gold' | 'danger' }) => {
  const variants = {
    default: "bg-surface-hover text-text-muted border-line",
    mint: "bg-accent-primary/10 text-accent-primary border-accent-primary/20",
    gold: "bg-accent-secondary/10 text-accent-secondary border-accent-secondary/20",
    danger: "bg-danger/10 text-danger border-danger/20"
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-pill text-[10px] font-bold uppercase tracking-widest border", variants[variant], className)}>
      {children}
    </span>
  );
};
