
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Search, Menu, Bell, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";

export function Header() {
  const isMobile = useIsMobile();

  return (
    <header className="sticky top-0 z-10 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-6 mt-6">
                  <Link to="/" className="text-lg font-bold">
                    Home
                  </Link>
                  <Link to="/lost-items" className="text-lg">
                    Lost Items
                  </Link>
                  <Link to="/found-items" className="text-lg">
                    Found Items
                  </Link>
                  <Link to="/report" className="text-lg">
                    Report Item
                  </Link>
                  <Link to="/profile" className="text-lg">
                    My Profile
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary md:text-2xl">VJTI Lost & Found</span>
          </Link>
        </div>
        {!isMobile && (
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Home
            </Link>
            <Link to="/lost-items" className="text-sm font-medium transition-colors hover:text-primary">
              Lost Items
            </Link>
            <Link to="/found-items" className="text-sm font-medium transition-colors hover:text-primary">
              Found Items
            </Link>
            <Link to="/report" className="text-sm font-medium transition-colors hover:text-primary">
              Report Item
            </Link>
          </nav>
        )}
        <div className="flex items-center gap-2">
          <form className="hidden md:flex relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-44 rounded-full bg-background pl-8 sm:w-64 md:w-80"
            />
          </form>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent" />
            <span className="sr-only">Notifications</span>
          </Button>
          <Link to="/profile">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
              <span className="sr-only">Profile</span>
            </Button>
          </Link>
          <Link to="/auth/login">
            <Button variant="default" size="sm">
              Login
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
