
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ItemGrid } from "@/components/items/ItemGrid";
import { useAuth } from "@/context/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { itemsService, authService, supabase } from "@/lib/supabase";
import { FileUpload } from "@/components/ui/file-upload";
import { User, Mail, Phone, Save, Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    contactNumber: user?.contactNumber || "",
    avatar: user?.avatar || "",
  });

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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      await updateProfile({
        name: profileForm.name,
        contactNumber: profileForm.contactNumber,
        avatar: profileForm.avatar,
      });
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileForm({ ...profileForm, [field]: value });
  };

  const handleAvatarChange = (url: string) => {
    setProfileForm({ ...profileForm, avatar: url });
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  if (!user) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4 md:px-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Not Signed In</h1>
            <p className="mb-4">You need to be signed in to view your profile.</p>
            <Button asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

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
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">{getInitials(user.name)}</AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                  {user.contactNumber && (
                    <div className="flex items-center text-sm">
                      <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{user.contactNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <User className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Role: {user.role}</span>
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
                {isLoadingItems ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  </div>
                ) : userItems.length > 0 ? (
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
                        <Label htmlFor="avatar">Profile Picture</Label>
                        <FileUpload
                          value={profileForm.avatar}
                          onFileChange={() => {}}
                          onFileUpload={authService.uploadAvatar}
                          onChange={handleAvatarChange}
                          preview={true}
                          label="Upload Avatar"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={profileForm.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileForm.email}
                          disabled={true}
                          className="bg-muted"
                        />
                        <p className="text-xs text-muted-foreground">Email cannot be changed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="contactNumber">Contact Number</Label>
                        <Input
                          id="contactNumber"
                          value={profileForm.contactNumber}
                          onChange={(e) => handleInputChange("contactNumber", e.target.value)}
                          disabled={isUpdating}
                        />
                      </div>
                      <Button type="submit" disabled={isUpdating} className="flex items-center">
                        {isUpdating ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
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
