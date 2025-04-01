
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
    lost: "bg-red-100 text-red-800 border-red-200",
    found: "bg-green-100 text-green-800 border-green-200",
    claimed: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-gray-100 text-gray-800 border-gray-200",
  };

  return (
    <Card className="overflow-hidden item-card">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={item.images[0] || "/placeholder.svg"}
          alt={item.title}
          className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-2 right-2">
          <Badge className={statusColors[item.status]}>
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="text-lg font-semibold line-clamp-1">{item.title}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{item.description}</p>
        <div className="mt-3 flex flex-col gap-2">
          <div className="flex items-center text-sm text-muted-foreground">
            <MapPin className="mr-1 h-4 w-4" />
            <span className="line-clamp-1">{item.location}</span>
          </div>
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{new Date(item.date).toLocaleDateString()}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link to={`/items/${item.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            View Details <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
