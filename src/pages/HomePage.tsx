
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ItemGrid } from "@/components/items/ItemGrid";
import { MainLayout } from "@/components/layout/MainLayout";
import { mockItems } from "@/data/mockData";
import { Item } from "@/types";
import { Search, Clock } from "lucide-react";

export default function HomePage() {
  const [recentItems, setRecentItems] = useState<Item[]>([]);
  
  useEffect(() => {
    // Sort items by createdAt in descending order
    const sortedItems = [...mockItems].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    // Get the 4 most recent items
    setRecentItems(sortedItems.slice(0, 4));
  }, []);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-6 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="container mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              <span className="block">Find What You've Lost</span>
              <span className="block text-primary">Help Others Find Theirs</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              VJTI's dedicated platform for lost and found items. Report what you've lost,
              discover what's been found, and help reconnect people with their belongings.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button size="lg" className="w-full sm:w-auto">
                  Report an Item
                </Button>
              </Link>
              <Link to="/lost-items">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Lost Items
                </Button>
              </Link>
              <Link to="/found-items">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Browse Found Items
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <p className="text-muted-foreground">
                Submit details about an item you've lost or found on campus.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wait</h3>
              <p className="text-muted-foreground">
                We'll notify you when a match is found or someone claims your item.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-primary">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                  <path d="m9 12 2 2 4-4"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Recover</h3>
              <p className="text-muted-foreground">
                Connect with the finder or owner to recover the item safely.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Recently Reported</h2>
            <div className="flex gap-4">
              <Link to="/lost-items">
                <Button variant="outline">View All Lost Items</Button>
              </Link>
              <Link to="/found-items">
                <Button variant="outline">View All Found Items</Button>
              </Link>
            </div>
          </div>
          <ItemGrid items={recentItems} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 md:px-6 bg-primary text-primary-foreground">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Lost Something?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Report your lost item now and increase your chances of getting it back.
            Our platform connects you with the VJTI community to help find your belongings.
          </p>
          <Link to="/report">
            <Button size="lg" variant="secondary">
              Report Lost Item
            </Button>
          </Link>
        </div>
      </section>
    </MainLayout>
  );
}
