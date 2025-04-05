
import React, { useEffect, useRef } from 'react';

interface SimpleMapProps {
  address: string;
  className?: string;
}

const SimpleMap: React.FC<SimpleMapProps> = ({ address, className = "h-64 w-full rounded-lg" }) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This is a placeholder for a real map integration
    // In a real implementation, you would integrate with a map provider like Google Maps, Mapbox, etc.
    const mapElement = mapRef.current;
    
    if (mapElement) {
      // Create a simple map visualization placeholder with animation
      mapElement.innerHTML = `
        <div class="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg overflow-hidden shadow-lg animate-fade-in">
          <div class="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] opacity-20"></div>
          
          <div class="animate-float">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-primary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1113.314 0z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          
          <div class="text-center px-4 relative z-10">
            <h3 class="font-medium text-lg mb-1 gradient-text">Find Us Here</h3>
            <p class="text-sm text-muted-foreground">${address}</p>
            
            <div class="mt-4">
              <button class="px-3 py-1 text-xs rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors">
                Get Directions
              </button>
            </div>
          </div>
          
          <div class="absolute bottom-2 right-2 text-xs text-muted-foreground/50">Map data placeholder</div>
        </div>
      `;
    }
    
    return () => {
      if (mapElement) {
        mapElement.innerHTML = '';
      }
    };
  }, [address]);

  return <div ref={mapRef} className={`${className} overflow-hidden transition-all duration-300 hover:shadow-xl`}></div>;
};

export default SimpleMap;
