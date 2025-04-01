
import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { ItemGrid } from "@/components/items/ItemGrid";
import { ItemFilters } from "@/components/items/ItemFilters";
import { mockItems } from "@/data/mockData";
import { Item, ItemCategory, ItemStatus, Department } from "@/types";

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
    }, 500);
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

  return (
    <MainLayout>
      <section className="py-10 px-4 md:px-6">
        <div className="container mx-auto">
          <h1 className="text-3xl font-bold mb-8">{pageTitle}</h1>
          <div className="mb-8">
            <ItemFilters onFilterChange={handleFilterChange} />
          </div>
          <ItemGrid items={filteredItems} isLoading={isLoading} />
        </div>
      </section>
    </MainLayout>
  );
}
