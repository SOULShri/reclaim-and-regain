
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
          <Link to="/help" className="hover-lift">
            <Button
              variant={isActive ? "default" : "ghost"}
              size="sm"
              className={`gap-2 transition-all duration-300 ${isActive ? 'shadow-md' : 'hover:bg-primary/10'}`}
            >
              <HelpCircle className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'text-primary-foreground animate-pulse-gentle' : 'group-hover:scale-110'}`} />
              <span className="hidden md:inline">Help</span>
            </Button>
          </Link>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help? Click here!</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
