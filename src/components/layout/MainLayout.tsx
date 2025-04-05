
import { ReactNode } from "react";
import { Header } from "./Header";
import { Footer } from "./Footer";

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col animate-fade-in">
      <Header />
      <main className="flex-1 animate-slide-in">
        <div className="gradient-overlay absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-purple-500/10 to-transparent opacity-70 -z-10"></div>
        {children}
      </main>
      <Footer />
    </div>
  );
}
