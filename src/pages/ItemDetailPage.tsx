
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, MapPin, Tag, Info, 
  User, ArrowLeft, AlertTriangle, 
  Check, MessageSquare, X 
} from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { itemsService } from "@/lib/supabase";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ItemChat } from "@/components/items/ItemChat";
import { useAuth } from "@/context/AuthContext";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("details");
  const { user } = useAuth();
  
  const { data: item, isLoading } = useQuery({
    queryKey: ['item', id],
    queryFn: () => itemsService.getItemById(id!),
    enabled: !!id,
  });

  // Status badge style
  const statusStyles = {
    lost: "bg-yellow-100 text-yellow-800 border-yellow-200",
    found: "bg-green-100 text-green-800 border-green-200",
    claimed: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-gray-100 text-gray-800 border-gray-200",
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-48 bg-muted rounded"></div>
              <div className="h-96 bg-muted rounded"></div>
              <div className="h-24 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!item) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <AlertTriangle className="h-16 w-16 mx-auto text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Item Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Button asChild>
              <Link to="/lost-items">Browse Items</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Back button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="mb-4" 
            asChild
          >
            <Link to="/lost-items">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Items
            </Link>
          </Button>

          {/* Title and status */}
          <div className="flex flex-wrap justify-between items-start mb-6 gap-3">
            <h1 className="text-3xl font-bold">{item.title}</h1>
            <Badge className={statusStyles[item.status]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Badge>
          </div>

          <Tabs 
            defaultValue="details" 
            value={activeTab} 
            onValueChange={setActiveTab}
            className="space-y-4"
          >
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="chat">
                Messages
                {user && <span className="ml-1">(Live)</span>}
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-6">
              {/* Image */}
              <div className="relative rounded-lg overflow-hidden bg-muted">
                {item.images && item.images.length > 0 ? (
                  <img
                    src={item.images[0]}
                    alt={item.title}
                    className="w-full h-96 object-cover"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center bg-muted">
                    <Info className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}
              </div>

              {/* Item details */}
              <Card>
                <CardContent className="grid gap-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                        <p>{item.description}</p>
                      </div>
                      
                      <div className="flex items-center">
                        <Tag className="h-4 w-4 mr-2" />
                        <span>
                          <span className="text-sm font-medium text-muted-foreground mr-2">Category:</span>
                          {item.category}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>
                          <span className="text-sm font-medium text-muted-foreground mr-2">Location:</span>
                          {item.location}
                        </span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>
                          <span className="text-sm font-medium text-muted-foreground mr-2">Date:</span>
                          {new Date(item.date).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    {/* Right column */}
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Reported By</h3>
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center mr-2">
                            {item.reportedBy?.avatar ? (
                              <img src={item.reportedBy.avatar} alt={item.reportedBy.name} className="w-full h-full rounded-full" />
                            ) : (
                              <User className="h-4 w-4" />
                            )}
                          </div>
                          <span>{item.reportedBy?.name}</span>
                        </div>
                      </div>
                      
                      {item.department && (
                        <div>
                          <h3 className="text-sm font-medium text-muted-foreground mb-1">Department</h3>
                          <p>{item.department.replace('_', ' ')}</p>
                        </div>
                      )}
                      
                      <div>
                        <h3 className="text-sm font-medium text-muted-foreground mb-1">Report Date</h3>
                        <p>{new Date(item.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-wrap gap-3 pt-2">
                    {item.status === "lost" && user?.id !== item.reportedBy?.id && (
                      <Button>
                        <Check className="h-4 w-4 mr-2" />
                        I Found This Item
                      </Button>
                    )}
                    
                    {item.status === "found" && user?.id !== item.reportedBy?.id && (
                      <Button>
                        <Check className="h-4 w-4 mr-2" />
                        This Is My Item
                      </Button>
                    )}

                    <Button 
                      variant="outline" 
                      onClick={() => setActiveTab("chat")}
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Contact About Item
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="chat">
              {item.id && <ItemChat itemId={item.id} />}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
