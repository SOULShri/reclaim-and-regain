
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemCategory, ItemStatus } from "@/types";
import { categories } from "@/data/mockData";
import { Search } from "lucide-react";

interface ItemFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    category?: ItemCategory;
    status?: ItemStatus;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export function ItemFilters({ onFilterChange }: ItemFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: undefined as ItemCategory | undefined,
    status: undefined as ItemStatus | undefined,
    dateFrom: "",
    dateTo: "",
  });

  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? undefined : value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: undefined,
      status: undefined,
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search items..."
            className="pl-8"
            value={filters.search}
            onChange={(e) => handleInputChange("search", e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select
              value={filters.category || "all"}
              onValueChange={(value) => handleSelectChange("category", value)}
            >
              <SelectTrigger id="category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={filters.status || "all"}
              onValueChange={(value) => handleSelectChange("status", value)}
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="found">Found</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateFrom">From Date</Label>
            <Input
              id="dateFrom"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleInputChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateTo">To Date</Label>
            <Input
              id="dateTo"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleInputChange("dateTo", e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={handleReset}>
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
