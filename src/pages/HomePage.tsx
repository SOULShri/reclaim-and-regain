
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ItemGrid } from "@/components/items/ItemGrid";
import { MainLayout } from "@/components/layout/MainLayout";
import { mockItems } from "@/data/mockData";
import { Item } from "@/types";
import { Search, Clock, Building, MapPin, AlertTriangle } from "lucide-react";

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
                  <AlertTriangle className="mr-2 h-5 w-5" />
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
            <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Report</h3>
              <p className="text-muted-foreground">
                Submit details about an item you've lost or found on campus.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Wait</h3>
              <p className="text-muted-foreground">
                We'll notify you when a match is found or someone claims your item.
              </p>
            </div>
            <div className="bg-card rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
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

      {/* Campus Departments */}
      <section className="py-16 px-4 md:px-6 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Campus Departments</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Our lost and found system serves all departments across the VJTI campus.
            Select your department to filter items relevant to your area.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Information Technology</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Computer Science</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Mechanical</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Electrical</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">ENTC</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Electronics</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Civil</span>
            </Link>
            <Link to="/lost-items" className="bg-card p-4 rounded-lg shadow-sm hover:shadow-md transition-all hover:bg-primary/5 text-center">
              <Building className="h-8 w-8 mx-auto mb-2 text-primary" />
              <span className="text-sm font-medium">Production</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Recent Items Section */}
      <section className="py-16 px-4 md:px-6">
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
          <div className="md:flex md:items-center md:justify-center md:space-x-12">
            <div className="md:w-1/2 mb-8 md:mb-0 md:text-left">
              <h2 className="text-3xl font-bold mb-4">Lost Something?</h2>
              <p className="text-lg mb-8 opacity-90">
                Report your lost item now and increase your chances of getting it back.
                Our platform connects you with the VJTI community to help find your belongings.
              </p>
              <Link to="/report?type=lost">
                <Button size="lg" variant="secondary">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Report Lost Item
                </Button>
              </Link>
            </div>
            <div className="md:w-1/2 md:text-left">
              <h2 className="text-3xl font-bold mb-4">Found Something?</h2>
              <p className="text-lg mb-8 opacity-90">
                Help return lost items to their rightful owners. Report items you've found
                on campus and make someone's day better.
              </p>
              <Link to="/report?type=found">
                <Button size="lg" variant="secondary">
                  <Search className="mr-2 h-5 w-5" />
                  Report Found Item
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Campus Map Section */}
      <section className="py-16 px-4 md:px-6">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Campus Hotspots</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              See where items are commonly lost or found around campus. Check these areas first when looking for lost items.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-primary" />
                Common Lost Locations
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Central Library (24% of items)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Canteen Area (18% of items)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Lecture Halls (15% of items)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Computer Labs (12% of items)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <MapPin className="h-4 w-4 text-primary" />
                  </span>
                  <span>Sports Complex (10% of items)</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Peak Times for Lost Items
              </h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span>12:00 PM - 2:00 PM (Lunch hours)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span>4:30 PM - 6:00 PM (After classes)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span>9:00 AM - 10:00 AM (Morning rush)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span>During exam weeks (30% increase)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-primary/10 rounded-full p-1 mr-3">
                    <Clock className="h-4 w-4 text-primary" />
                  </span>
                  <span>Fridays (Most common day)</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
}
