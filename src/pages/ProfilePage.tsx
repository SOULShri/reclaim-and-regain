
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ItemGrid } from "@/components/items/ItemGrid";
import { mockItems, mockUsers } from "@/data/mockData";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, Mail, Phone, Save } from "lucide-react";

export default function ProfilePage() {
  // In a real app, this would come from authentication
  const currentUser = mockUsers[0];
  
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: currentUser.name,
    email: currentUser.email,
    contactNumber: currentUser.contactNumber || "",
  });

  // Get user's reported items
  const userItems = mockItems.filter(item => item.reportedBy.id === currentUser.id);

  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileForm({ ...profileForm, [field]: value });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile Sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="text-lg">{getInitials(currentUser.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{currentUser.name}</CardTitle>
                <CardDescription>{currentUser.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{currentUser.email}</span>
                  </div>
                  {currentUser.contactNumber && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{currentUser.contactNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Role: {currentUser.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="items">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="items">My Items</TabsTrigger>
                <TabsTrigger value="settings">Profile Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="items" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">My Reported Items</h2>
                {userItems.length > 0 ? (
                  <ItemGrid items={userItems} />
                ) : (
                  <Card>
                    <CardContent className="py-10 text-center">
                      <p className="text-muted-foreground mb-4">You haven't reported any items yet.</p>
                      <Button asChild>
                        <a href="/report">Report an Item</a>
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
              
              <TabsContent value="settings" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Settings</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleProfileUpdate} className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={profileForm.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                        />
                      </div>
                      <Button type="submit" disabled={loading} className="flex items-center">
                        {loading ? "Updating..." : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Update Profile
                          </>
                        )}
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
