
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold">VJTI Lost & Found</h3>
            <p className="text-sm text-muted-foreground">
              Connect lost items with their owners across the VJTI campus.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium">Navigation</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
                <Link to="/lost-items" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Lost Items
                </Link>
                <Link to="/found-items" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Found Items
                </Link>
                <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Report Item
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium">Support</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  FAQ
                </Link>
              </nav>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Veermata Jijabai Technological Institute</h4>
            <p className="text-sm text-muted-foreground">
              H R Mahajani Rd, Matunga East,<br />
              Mumbai, Maharashtra 400019
            </p>
          </div>
        </div>
        <div className="mt-8 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VJTI Lost & Found. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
