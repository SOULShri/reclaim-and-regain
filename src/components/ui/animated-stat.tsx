
import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedStatProps {
  value: number;
  label: string;
  icon?: React.ReactNode;
  prefix?: string;
  suffix?: string;
  className?: string;
  valueClassName?: string;
  labelClassName?: string;
  animationDuration?: number;
}

export function AnimatedStat({
  value,
  label,
  icon,
  prefix = '',
  suffix = '',
  className,
  valueClassName,
  labelClassName,
  animationDuration = 1000,
}: AnimatedStatProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  
  useEffect(() => {
    // Create an intersection observer to start animation when in view
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && !hasAnimated) {
        setHasAnimated(true);
        
        // Animate the counting
        const step = Math.ceil(value / (animationDuration / 16));
        let current = 0;
        
        const timer = setInterval(() => {
          current += step;
          if (current >= value) {
            clearInterval(timer);
            setDisplayValue(value);
          } else {
            setDisplayValue(current);
          }
        }, 16);
        
        return () => clearInterval(timer);
      }
    });
    
    // Get the element to observe
    const element = document.getElementById(`animated-stat-${label.replace(/\s+/g, '-')}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [value, animationDuration, hasAnimated, label]);
  
  return (
    <div 
      id={`animated-stat-${label.replace(/\s+/g, '-')}`}
      className={cn(
        'flex flex-col items-center p-4 rounded-lg transition-all hover:shadow-md',
        className
      )}
    >
      {icon && (
        <div className="text-primary mb-2 animate-float">
          {icon}
        </div>
      )}
      
      <div 
        className={cn(
          'text-3xl font-bold mb-1',
          valueClassName
        )}
      >
        {prefix}{hasAnimated ? displayValue : 0}{suffix}
      </div>
      
      <div 
        className={cn(
          'text-sm text-muted-foreground',
          labelClassName
        )}
      >
        {label}
      </div>
    </div>
  );
}
