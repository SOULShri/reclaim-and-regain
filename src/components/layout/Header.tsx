
import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Contact, LogOut, Search, Settings, User } from "lucide-react";
import ContactNavItem from "./ContactNavItem";
import { HelpNavItem } from "./HelpNavItem";

export const Header = () => {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-xl font-bold">
            Lost & Found
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/lost-items">
              <Button variant="ghost" size="sm">
                Lost Items
              </Button>
            </Link>
            <Link to="/found-items">
              <Button variant="ghost" size="sm">
                Found Items
              </Button>
            </Link>
            {user && (
              <Link to="/report">
                <Button variant="ghost" size="sm">
                  Report Item
                </Button>
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <ContactNavItem />
          <HelpNavItem />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.avatar || ""} alt={user.name || ""} />
                    <AvatarFallback>
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut} className="flex items-center gap-2 cursor-pointer">
                  <LogOut className="h-4 w-4" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link to="/auth/login">
              <Button size="sm">Log In</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
