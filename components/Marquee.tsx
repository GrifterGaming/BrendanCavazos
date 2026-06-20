"use client";

/**
 * Infinite horizontal marquee. Renders its content twice and slides -50%
 * for a seamless loop. One job: loop a row of content horizontally.
 */
export default function Marquee({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "rev" | "cards";
  className?: string;
}) {
  const variantClass =
    variant === "rev" ? "bc-marquee--rev" : variant === "cards" ? "bc-marquee--cards" : "";
  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <div className={`bc-marquee ${variantClass}`}>
        {children}
        {children}
      </div>
    </div>
  );
}
