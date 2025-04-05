
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";
import { AnimatedBackground } from "@/components/ui/animated-background";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col animate-fade-in">
      <Header />
      <main className="flex-1 animate-slide-in relative">
        {/* Enhanced gradient overlay with animation */}
        <AnimatedBackground
          variant="gradient"
          intensity="medium"
          className="absolute top-0 left-0 w-full h-64 -z-10"
          animated={true}
        >
          {/* Empty div to satisfy the children prop requirement */}
          <div></div>
        </AnimatedBackground>
        <div className="container mx-auto px-4 py-8 animate-scale">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
