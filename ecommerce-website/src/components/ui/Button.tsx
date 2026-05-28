import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "danger" | "gold" | "glass" | "outlineHoverSolid";
  isLoading?: boolean;
}

export default function Button({
  children,
  variant = "primary",
  isLoading = false,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 cursor-pointer";

  const variants = {
    primary: "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/20 active:scale-95",
    outline: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 active:scale-95 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-950/20",
    danger: "bg-red-500 text-white hover:bg-red-600 active:scale-95 hover:shadow-lg hover:shadow-red-500/20",
    gold: "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 font-bold active:scale-95 shadow-md shadow-amber-500/10 hover:shadow-lg hover:shadow-amber-500/20",
    glass: "glassmorphism text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 active:scale-95",
    outlineHoverSolid: "border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white active:scale-95 dark:text-indigo-400 dark:border-indigo-400 dark:hover:bg-indigo-500 dark:hover:text-white",
  };

  return (
    <button
      className={base + " " + variants[variant] + " " + className}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
