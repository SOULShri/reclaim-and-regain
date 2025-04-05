
import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const HelpNavItem = () => {
  const location = useLocation();
  const isActive = location.pathname === "/help";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link to="/help" className="hover-lift transition-all duration-300">
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`gap-2 transition-all duration-300 ${
                isActive 
                  ? 'shadow-md shadow-primary/20' 
                  : 'hover:bg-gradient-to-r hover:from-indigo-500/10 hover:to-purple-500/10'
              }`}
            >
              <HelpCircle 
                className={`h-4 w-4 transition-transform duration-300 ${
                  isActive 
                    ? 'text-primary-foreground animate-pulse-gentle' 
                    : 'group-hover:scale-110'
                }`} 
              />
              <span className="hidden md:inline relative">
                Help
                {isActive && (
                  <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse-gentle"></span>
                )}
              </span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent className="bg-gradient-to-r from-indigo-500/20 to-purple-500/20 backdrop-blur-md border border-indigo-500/30">
          <p>Need help? Click here!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
