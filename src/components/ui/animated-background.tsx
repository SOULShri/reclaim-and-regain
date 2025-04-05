import React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedBackgroundProps {
  children?: React.ReactNode;
  variant?: 'dots' | 'grid' | 'waves' | 'gradient';
  className?: string;
  intensity?: 'light' | 'medium' | 'heavy';
  animated?: boolean;
}

export function AnimatedBackground({
  children,
  variant = 'dots',
  className,
  intensity = 'medium',
  animated = true
}: AnimatedBackgroundProps) {
  // Intensity mapping
  const intensityMap = {
    light: 'opacity-[0.1]',
    medium: 'opacity-[0.2]',
    heavy: 'opacity-[0.3]',
  };
  
  // Pattern & animation based on variant
  const getBackgroundPattern = () => {
    switch(variant) {
      case 'dots':
        return `bg-[radial-gradient(circle,_#6366f1_1px,_transparent_1px)] bg-[length:20px_20px] ${animated ? 'animate-pulse-gentle' : ''}`;
      case 'grid':
        return `bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:20px_20px] ${animated ? 'animate-float' : ''}`;
      case 'waves':
        return `bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%236366f1' fill-opacity='0.1' d='M0,64L40,64C80,64,160,64,240,85.3C320,107,400,149,480,149.3C560,149,640,107,720,112C800,117,880,171,960,197.3C1040,224,1120,224,1200,197.3C1280,171,1360,117,1400,90.7L1440,64L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z'%3E%3C/path%3E%3C/svg%3E")] bg-bottom bg-no-repeat ${animated ? 'animate-float' : ''}`;
      case 'gradient':
        return `bg-gradient-to-br from-purple-500/20 to-indigo-500/20 ${animated ? 'animate-pulse-gentle' : ''}`;
      default:
        return '';
    }
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      <div className={cn(
        'absolute inset-0 -z-10',
        getBackgroundPattern(),
        intensityMap[intensity]
      )} />
      {children}
    </div>
  );
}
