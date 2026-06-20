"use client";

type Variant = "primary" | "secondary" | "canvas";
type Size = "lg" | "md" | "sm";

const variantClass: Record<Variant, string> = {
  primary: "bc-btn--primary",
  secondary: "bc-btn--secondary",
  canvas: "bc-btn--canvas",
};

const sizeClass: Record<Size, string> = {
  lg: "bc-btn--lg",
  md: "bc-btn--md",
  sm: "bc-btn--sm",
};

export default function Button({
  children,
  variant = "primary",
  size = "md",
  type = "button",
  onClick,
  className = "",
}: {
  children: React.ReactNode;
  variant?: Variant;
  size?: Size;
  type?: "button" | "submit";
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`bc-btn ${variantClass[variant]} ${sizeClass[size]} ${className}`}
    >
      {children}
    </button>
  );
}
