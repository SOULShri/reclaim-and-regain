
import { Link } from "react-router-dom";
import { Item } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const statusColors = {
    lost: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800/50",
    found: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800/50",
    claimed: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800/50",
    resolved: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800/50 dark:text-gray-300 dark:border-gray-700/50",
  };

  // Handle missing images or empty array
  const fallbackImage = "/placeholder.svg";
  const imageUrl = item.images && item.images.length > 0 ? item.images[0] : fallbackImage;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1 group">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            // Handle image loading error
            const target = e.target as HTMLImageElement;
            target.src = fallbackImage;
            target.onerror = null; // Prevent infinite loop
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${statusColors[item.status]} transition-transform duration-300 group-hover:scale-110`}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
        
        {/* Add gradient overlay at the bottom of image */}
        <div className="absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1 transition-colors duration-300 group-hover:text-primary">{item.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
            <MapPin className="mr-1 h-4 w-4 text-primary/70" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
            <Calendar className="mr-1 h-4 w-4 text-primary/70" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/items/${item.id}`} className="w-full">
          <Button 
            variant="outline" 
            className="w-full transition-all duration-300 hover:bg-primary/10 group-hover:border-primary/30"
          >
            <span className="transition-transform duration-300 group-hover:translate-x-1">View Details</span> 
            <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
