import { type InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({
  label,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground/80"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`h-10 rounded-lg border border-foreground/20 bg-background px-3 text-sm transition-colors placeholder:text-foreground/40 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/10 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-red-500 focus:border-red-500 focus:ring-red-500/20" : ""
        } ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
