
import React from "react";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

export const HelpNavItem = () => {
  const location = useLocation();
  const isActive = location.pathname === "/help";

  return (
    <Link to="/help">
      <Button
        variant={isActive ? "default" : "ghost"}
        size="sm"
        className="gap-2"
      >
        <HelpCircle className="h-4 w-4" />
        <span className="hidden md:inline">Help</span>
      </Button>
    </Link>
  );
};
