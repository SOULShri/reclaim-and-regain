
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { mockItems } from "@/data/mockData";
import { Item } from "@/types";
import { MapPin, Calendar, User, ArrowLeft, Clock, Phone, Mail } from "lucide-react";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Item | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setIsLoading(true);
    setTimeout(() => {
      const foundItem = mockItems.find(item => item.id === id) || null;
      setItem(foundItem);
      setIsLoading(false);
    }, 500);
  }, [id]);

  const statusColors = {
    lost: "bg-red-100 text-red-800 border-red-200",
    found: "bg-green-100 text-green-800 border-green-200",
    claimed: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-gray-100 text-gray-800 border-gray-200",
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4 md:px-6">
          <div className="animate-pulse">
            <div className="h-8 w-1/3 bg-muted rounded mb-4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-96 bg-muted rounded"></div>
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-muted rounded"></div>
                <div className="h-4 w-1/4 bg-muted rounded"></div>
                <div className="h-24 w-full bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
                <div className="h-4 w-1/2 bg-muted rounded"></div>
                <div className="h-10 w-1/3 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <div className="container mx-auto py-20 px-4 md:px-6 text-center">
          <h1 className="text-3xl font-bold mb-4">Item Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The item you are looking for does not exist or has been removed.
          </p>
          <Link to="/">
            <Button>Back to Home</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <Link to={item.status === "lost" ? "/lost-items" : "/found-items"} className="flex items-center mb-6 text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          <span>Back to {item.status === "lost" ? "Lost" : "Found"} Items</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="rounded-lg overflow-hidden border">
              <img 
                src={item.images[0] || "/placeholder.svg"} 
                alt={item.title} 
                className="w-full h-auto object-cover" 
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className={statusColors[item.status]}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <div className="mt-4 flex items-center text-sm text-muted-foreground">
              <Clock className="mr-2 h-4 w-4" />
              <span>Reported {new Date(item.createdAt).toLocaleDateString()} at {new Date(item.createdAt).toLocaleTimeString()}</span>
            </div>

            <div className="mt-6">
              <Tabs defaultValue="details">
                <TabsList>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="contact">Contact</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                      <p className="text-foreground">{item.description}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Location</h3>
                      <div className="flex items-center">
                        <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{item.location}</span>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Date</h3>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{new Date(item.date).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="contact" className="mt-4">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Reported By</h3>
                      <div className="flex items-center">
                        <User className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{item.reportedBy.name}</span>
                      </div>
                    </div>
                    {item.reportedBy.contactNumber && (
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Contact Number</h3>
                        <div className="flex items-center">
                          <Phone className="mr-1 h-4 w-4 text-muted-foreground" />
                          <span>{item.reportedBy.contactNumber}</span>
                        </div>
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">Email</h3>
                      <div className="flex items-center">
                        <Mail className="mr-1 h-4 w-4 text-muted-foreground" />
                        <span>{item.reportedBy.email}</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-8">
              {item.status === "lost" ? (
                <Button className="w-full sm:w-auto">I Found This Item</Button>
              ) : (
                <Button className="w-full sm:w-auto">This is My Item</Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
