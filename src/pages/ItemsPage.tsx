
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ItemFilters } from "@/components/items/ItemFilters";
import { mockItems } from "@/data/mockData";
import { Item, ItemCategory, ItemStatus, Department } from "@/types";
import { AnimatedBackground } from "@/components/ui/animated-background";
import { AnimatedStat } from "@/components/ui/animated-stat";
import { Search, Map, Tag, Calendar } from "lucide-react";

export default function ItemsPage() {
  const { type } = useParams<{ type: string }>();
  const location = useLocation();
  const [items, setItems] = useState<Item[]>([]);
  const [filteredItems, setFilteredItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Determine if we're showing lost or found items based on the route
  const itemStatus: ItemStatus = location.pathname.includes("lost") ? "lost" : "found";
  
  // Set page title based on item status
  const pageTitle = itemStatus === "lost" ? "Lost Items" : "Found Items";

  useEffect(() => {
    // Simulate loading
    setIsLoading(true);
    
    setTimeout(() => {
      // Filter items based on status (lost or found)
      const itemsToShow = mockItems.filter(item => item.status === itemStatus);
      setItems(itemsToShow);
      setFilteredItems(itemsToShow);
      setIsLoading(false);
    }, 800);
  }, [itemStatus]);

  const handleFilterChange = (filters: {
    search?: string;
    category?: ItemCategory;
    status?: ItemStatus;
    department?: Department;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => {
    let filtered = [...items];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        item =>
          item.title.toLowerCase().includes(searchTerm) ||
          item.description.toLowerCase().includes(searchTerm) ||
          item.location.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.category) {
      filtered = filtered.filter(item => item.category === filters.category);
    }

    if (filters.department) {
      filtered = filtered.filter(item => item.department === filters.department);
    }

    if (filters.location) {
      filtered = filtered.filter(item => item.location.includes(filters.location));
    }

    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered.filter(item => new Date(item.date) >= fromDate);
    }

    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59);
      filtered = filtered.filter(item => new Date(item.date) <= toDate);
    }

    setFilteredItems(filtered);
  };
  
  // Calculate some statistics
  const locationCount = [...new Set(items.map(item => item.location))].length;
  const categoryCount = [...new Set(items.map(item => item.category))].length;
  const newestItemDate = items.length > 0 
    ? new Date(Math.max(...items.map(item => new Date(item.date).getTime())))
    : new Date();
  const daysAgo = Math.floor((new Date().getTime() - newestItemDate.getTime()) / (1000 * 3600 * 24));

  return (
    <MainLayout>
      <AnimatedBackground variant="grid" className="py-10 px-4 md:px-6">
        <div className="container mx-auto animate-fade-in">
          <h1 className="text-3xl font-bold mb-4 gradient-text inline-block">{pageTitle}</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 fade-in">
            <AnimatedStat 
              value={items.length} 
              label="Total Items" 
              icon={<Search className="h-6 w-6" />} 
              className="bg-white/50 rounded-xl shadow-sm hover-scale"
            />
            <AnimatedStat 
              value={locationCount} 
              label="Locations" 
              icon={<Map className="h-6 w-6" />}
              className="bg-white/50 rounded-xl shadow-sm hover-scale"
            />
            <AnimatedStat 
              value={categoryCount} 
              label="Categories" 
              icon={<Tag className="h-6 w-6" />}
              className="bg-white/50 rounded-xl shadow-sm hover-scale"
            />
            <AnimatedStat 
              value={daysAgo} 
              label="Days Since Latest" 
              suffix=" days"
              icon={<Calendar className="h-6 w-6" />}
              className="bg-white/50 rounded-xl shadow-sm hover-scale"
            />
          </div>
          
          <div className="mb-8 glass p-6 rounded-xl slide-in">
            <h2 className="text-lg font-medium mb-4">Filter Items</h2>
            <ItemFilters onFilterChange={handleFilterChange} />
          </div>
          
          <div className="fade-in">
            <ItemGrid items={filteredItems} isLoading={isLoading} />
          </div>
        </div>
      </AnimatedBackground>
    </MainLayout>
  );
}
