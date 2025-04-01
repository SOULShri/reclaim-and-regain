
import { Item } from "@/types";
import { ItemCard } from "./ItemCard";

interface ItemGridProps {
  items: Item[];
  isLoading?: boolean;
}

export function ItemGrid({ items, isLoading = false }: ItemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, index) => (
          <div
            key={index}
            className="h-[320px] rounded-lg bg-muted animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-medium">No items found</h3>
        <p className="mt-2 text-muted-foreground">
          Try adjusting your search or filter to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
