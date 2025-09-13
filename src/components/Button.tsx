"use client";

import { cn } from "@/lib/utils";

interface ButtonProps {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "operator" | "scientific" | "clear" | "equals";
  className?: string;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

export function Button({ 
  children, 
  onClick, 
  variant = "primary", 
  className,
  disabled = false,
  size = "md"
}: ButtonProps) {
  const baseClasses = "font-medium transition-all duration-200 transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variantClasses = {
    primary: "bg-gray-100 hover:bg-gray-200 text-gray-800 shadow-md hover:shadow-lg focus:ring-gray-300",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-700 shadow-md hover:shadow-lg focus:ring-gray-300",
    operator: "bg-orange-500 hover:bg-orange-600 text-white shadow-md hover:shadow-lg focus:ring-orange-300",
    scientific: "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg focus:ring-blue-300",
    clear: "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-lg focus:ring-red-300",
    equals: "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg focus:ring-green-300"
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm rounded-lg",
    md: "px-4 py-3 text-base rounded-xl",
    lg: "px-6 py-4 text-lg rounded-xl"
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {children}
    </button>
  );
}