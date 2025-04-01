
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ItemCategory, ItemStatus, Department } from "@/types";
import { categories, departments, locations } from "@/data/mockData";
import { Search, Filter, Building, MapPin, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ItemFiltersProps {
  onFilterChange: (filters: {
    search?: string;
    category?: ItemCategory;
    status?: ItemStatus;
    department?: Department;
    location?: string;
    dateFrom?: string;
    dateTo?: string;
  }) => void;
}

export function ItemFilters({ onFilterChange }: ItemFiltersProps) {
  const [filters, setFilters] = useState({
    search: "",
    category: undefined as ItemCategory | undefined,
    status: undefined as ItemStatus | undefined,
    department: undefined as Department | undefined,
    location: undefined as string | undefined,
    dateFrom: "",
    dateTo: "",
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  const handleInputChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    updateActiveFiltersCount(newFilters);
    onFilterChange(newFilters);
  };

  const handleSelectChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value === "all" ? undefined : value };
    setFilters(newFilters);
    updateActiveFiltersCount(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      search: "",
      category: undefined,
      status: undefined,
      department: undefined,
      location: undefined,
      dateFrom: "",
      dateTo: "",
    };
    setFilters(resetFilters);
    setActiveFiltersCount(0);
    onFilterChange(resetFilters);
  };

  const updateActiveFiltersCount = (newFilters: typeof filters) => {
    let count = 0;
    if (newFilters.category) count++;
    if (newFilters.status) count++;
    if (newFilters.department) count++;
    if (newFilters.location) count++;
    if (newFilters.dateFrom) count++;
    if (newFilters.dateTo) count++;
    setActiveFiltersCount(count);
  };

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search items..."
              className="pl-8"
              value={filters.search}
              onChange={(e) => handleInputChange("search", e.target.value)}
            />
          </div>
          
          <Popover open={showFilters} onOpenChange={setShowFilters}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="gap-2 whitespace-nowrap">
                <Filter className="h-4 w-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <Badge className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96">
              <div className="space-y-4 p-1">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Filter Options</h3>
                  <Button variant="ghost" size="sm" onClick={handleReset} className="h-8 px-2 text-xs">
                    <X className="h-3.5 w-3.5 mr-1" />
                    Reset
                  </Button>
                </div>
                
                <Accordion type="single" collapsible className="w-full space-y-2">
                  <AccordionItem value="category" className="border rounded-md px-1">
                    <AccordionTrigger className="py-2 px-3 hover:no-underline">
                      Category
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 pt-1">
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
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="status" className="border rounded-md px-1">
                    <AccordionTrigger className="py-2 px-3 hover:no-underline">
                      Status
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 pt-1">
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
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="department" className="border rounded-md px-1">
                    <AccordionTrigger className="py-2 px-3 hover:no-underline">
                      <div className="flex items-center">
                        <Building className="h-4 w-4 mr-2" />
                        Department
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 pt-1">
                      <Select
                        value={filters.department || "all"}
                        onValueChange={(value) => handleSelectChange("department", value)}
                      >
                        <SelectTrigger id="department">
                          <SelectValue placeholder="All Departments" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Departments</SelectItem>
                          {departments.map((dept) => (
                            <SelectItem key={dept.value} value={dept.value}>
                              {dept.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="location" className="border rounded-md px-1">
                    <AccordionTrigger className="py-2 px-3 hover:no-underline">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        Location
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 pt-1">
                      <Select
                        value={filters.location || "all"}
                        onValueChange={(value) => handleSelectChange("location", value)}
                      >
                        <SelectTrigger id="location">
                          <SelectValue placeholder="All Locations" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Locations</SelectItem>
                          {locations.map((loc) => (
                            <SelectItem key={loc} value={loc}>
                              {loc}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="date" className="border rounded-md px-1">
                    <AccordionTrigger className="py-2 px-3 hover:no-underline">
                      Date Range
                    </AccordionTrigger>
                    <AccordionContent className="px-3 pb-3 pt-1 space-y-3">
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
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                
                <div className="flex justify-end pt-2">
                  <Button onClick={() => setShowFilters(false)}>Apply Filters</Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {filters.category && (
              <Badge variant="outline" className="flex items-center gap-1">
                Category: {categories.find(c => c.value === filters.category)?.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleSelectChange("category", "all")}
                />
              </Badge>
            )}
            {filters.status && (
              <Badge variant="outline" className="flex items-center gap-1">
                Status: {filters.status.charAt(0).toUpperCase() + filters.status.slice(1)}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleSelectChange("status", "all")}
                />
              </Badge>
            )}
            {filters.department && (
              <Badge variant="outline" className="flex items-center gap-1">
                Department: {departments.find(d => d.value === filters.department)?.label}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleSelectChange("department", "all")}
                />
              </Badge>
            )}
            {filters.location && (
              <Badge variant="outline" className="flex items-center gap-1">
                Location: {filters.location}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleSelectChange("location", "all")}
                />
              </Badge>
            )}
            {filters.dateFrom && (
              <Badge variant="outline" className="flex items-center gap-1">
                From: {new Date(filters.dateFrom).toLocaleDateString()}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleInputChange("dateFrom", "")}
                />
              </Badge>
            )}
            {filters.dateTo && (
              <Badge variant="outline" className="flex items-center gap-1">
                To: {new Date(filters.dateTo).toLocaleDateString()}
                <X 
                  className="h-3 w-3 ml-1 cursor-pointer" 
                  onClick={() => handleInputChange("dateTo", "")}
                />
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
