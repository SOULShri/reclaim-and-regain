
import React, { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsItem, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ItemGrid } from "@/components/items/ItemGrid";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useRealtime } from "@/hooks/useRealtime";
import { Loader2, Search, Bell, AlertTriangle, CheckCircle, Clock, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const { user } = useAuth();
  const { isSubscribed } = useRealtime();
  const [activeTab, setActiveTab] = useState("overview");

  // Fetch user's reported items
  const { data: userItems = [], isLoading: isLoadingItems } = useQuery({
    queryKey: ['userItems', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('items')
        .select('*, reported_by:users(*)')
        .eq('reported_by', user.id);
      return data || [];
    },
    enabled: !!user,
  });

  // Fetch latest items from the system
  const { data: latestItems = [], isLoading: isLoadingLatest } = useQuery({
    queryKey: ['latestItems'],
    queryFn: async () => {
      const { data } = await supabase
        .from('items')
        .select('*, reported_by:users(*)')
        .order('created_at', { ascending: false })
        .limit(5);
      return data || [];
    },
  });

  // Calculate statistics
  const lostItems = userItems.filter(item => item.status === 'lost').length;
  const foundItems = userItems.filter(item => item.status === 'found').length;
  const resolvedItems = userItems.filter(item => ['claimed', 'resolved'].includes(item.status)).length;
  const totalItems = userItems.length;
  const resolvedPercentage = totalItems > 0 ? (resolvedItems / totalItems) * 100 : 0;

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4 md:px-6">
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <AlertTriangle className="w-16 h-16 text-yellow-500 mb-4" />
            <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
            <p className="text-center text-muted-foreground mb-6">
              You need to be logged in to access your dashboard.
            </p>
            <Button asChild>
              <Link to="/auth/login">Log In</Link>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Track and manage your lost and found items
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="my-items">My Items</TabsTrigger>
            <TabsTrigger value="latest">Latest Items</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Lost Items</CardTitle>
                  <CardDescription>Items you reported as lost</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{lostItems}</span>
                    <AlertTriangle className="h-8 w-8 text-yellow-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Found Items</CardTitle>
                  <CardDescription>Items you reported as found</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{foundItems}</span>
                    <Search className="h-8 w-8 text-blue-500" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-medium">Resolved</CardTitle>
                  <CardDescription>Items claimed or resolved</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold">{resolvedItems}</span>
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle>Resolution Progress</CardTitle>
                <CardDescription>
                  Percentage of your items that have been resolved
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm font-medium">{resolvedPercentage.toFixed(0)}%</span>
                  </div>
                  <Progress value={resolvedPercentage} />
                </div>
              </CardContent>
            </Card>

            {/* Real-time Status */}
            <Card>
              <CardHeader>
                <CardTitle>Real-time Updates</CardTitle>
                <CardDescription>
                  Status of real-time notifications for your items
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <div className={`h-3 w-3 rounded-full ${isSubscribed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span>
                    {isSubscribed ? 'Connected and receiving updates' : 'Not connected to real-time updates'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Recent Activity</span>
                  <Button variant="outline" size="sm" asChild>
                    <Link to="/profile" className="text-xs">
                      View All <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingItems ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : userItems.length > 0 ? (
                  <div className="space-y-4">
                    {userItems.slice(0, 3).map((item) => (
                      <div key={item.id} className="flex items-center gap-3 py-2 border-b last:border-0">
                        <div className="flex-shrink-0">
                          {item.status === "lost" ? (
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                          ) : item.status === "found" ? (
                            <Search className="h-5 w-5 text-blue-500" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <Link to={`/items/${item.id}`} className="font-medium hover:underline">
                            {item.title}
                          </Link>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <Badge className="capitalize">{item.status}</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted-foreground">No activity yet</p>
                    <Button variant="outline" size="sm" className="mt-2" asChild>
                      <Link to="/report">Report an Item</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="my-items">
            <Card>
              <CardHeader>
                <CardTitle>My Reported Items</CardTitle>
                <CardDescription>
                  All items you've reported as lost or found
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingItems ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : userItems.length > 0 ? (
                  <ItemGrid items={userItems} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You haven't reported any items yet.</p>
                    <Button asChild>
                      <Link to="/report">Report an Item</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="latest">
            <Card>
              <CardHeader>
                <CardTitle>Latest Items in the System</CardTitle>
                <CardDescription>
                  Recently reported lost and found items
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingLatest ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : latestItems.length > 0 ? (
                  <ItemGrid items={latestItems} />
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No items have been reported yet.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
