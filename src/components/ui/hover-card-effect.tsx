
import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface HoverCardEffectProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  borderGradient?: boolean;
}

export function HoverCardEffect({
  children,
  className,
  glowColor = "rgba(123, 97, 255, 0.4)",
  borderGradient = true
}: HoverCardEffectProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isHovering) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element

    setPosition({ x, y });
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300 hover:shadow-lg",
        className,
        borderGradient && "border border-transparent hover:border-white/10",
        isHovering && "scale-[1.01] shadow-xl"
      )}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      style={{
        background: isHovering
          ? `radial-gradient(circle at ${position.x}px ${position.y}px, ${glowColor} 0%, transparent 50%)`
          : "none"
      }}
    >
      {/* Border gradient effect */}
      {borderGradient && (
        <div
          className={cn(
            "absolute inset-0 -z-10 rounded-[inherit] p-[1px]",
            "bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent",
            "opacity-0 transition-opacity duration-500",
            isHovering && "opacity-100"
          )}
        />
      )}

      {/* Content */}
      {children}
    </div>
  );
}
