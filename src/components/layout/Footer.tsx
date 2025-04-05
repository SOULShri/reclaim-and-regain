
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Linkedin, Youtube } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container px-4 py-8 md:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col gap-2">
            <h3 className="text-lg font-bold gradient-text">VJTI Lost & Found</h3>
            <p className="text-sm text-muted-foreground">
              Connect lost items with their owners across the VJTI campus.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium">Navigation</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Home
                </Link>
                <Link to="/lost-items" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Lost Items
                </Link>
                <Link to="/found-items" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Found Items
                </Link>
                <Link to="/report" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Report Item
                </Link>
              </nav>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-sm font-medium">Support</h4>
              <nav className="flex flex-col gap-2">
                <Link to="/help" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Help Center
                </Link>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
                  Contact Us
                </Link>
                <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition-colors hover:translate-x-1 hover:text-primary duration-200">
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
        <div className="mt-8 flex flex-col md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} VJTI Lost & Found. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors animate-hover-bounce">
              <Instagram className="h-5 w-5" />
              <span className="sr-only">Instagram</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors animate-hover-bounce">
              <Twitter className="h-5 w-5" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors animate-hover-bounce">
              <Facebook className="h-5 w-5" />
              <span className="sr-only">Facebook</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors animate-hover-bounce">
              <Linkedin className="h-5 w-5" />
              <span className="sr-only">LinkedIn</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" 
               className="text-muted-foreground hover:text-primary transition-colors animate-hover-bounce">
              <Youtube className="h-5 w-5" />
              <span className="sr-only">YouTube</span>
            </a>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
