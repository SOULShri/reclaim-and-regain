
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/ui/file-upload";
import { categories, departments, locations } from "@/data/mockData";
import { ItemCategory, ItemStatus, Department } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { itemsService } from "@/lib/supabase";
import { Upload, ImagePlus, Building, MapPin, Calendar, Info, Loader2 } from "lucide-react";

export default function ReportItemPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<ItemStatus>("lost");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    category: ItemCategory;
    status: ItemStatus;
    department?: Department;
    location: string;
    date: string;
    images: string[];
  }>({
    title: "",
    description: "",
    category: "other",
    status: "lost",
    department: "other",
    location: "",
    date: new Date().toISOString().split("T")[0],
    images: [],
  });

  const handleTabChange = (value: string) => {
    setActiveTab(value as ItemStatus);
    setFormData({ ...formData, status: value as ItemStatus });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await itemsService.uploadImage(file);
      setUploadedImageUrl(imageUrl);
      setFormData({ ...formData, images: [imageUrl] });
      return imageUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.date) {
      toast({
        title: "Missing Information",
        description: "Please fill out all required fields",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to report an item",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the item in the database
      await itemsService.createItem({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        status: formData.status,
        department: formData.department,
        location: formData.location,
        date: formData.date,
        images: formData.images,
      }, user.id);
      
      toast({
        title: "Item Reported Successfully",
        description: `Your ${activeTab} item has been reported.`,
      });
      
      navigate(`/${activeTab}-items`);
    } catch (error) {
      console.error("Error reporting item:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to report item. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Report an Item</h1>
          <p className="text-muted-foreground mb-8">
            Fill out the form below to report a lost or found item.
          </p>

          <Card>
            <CardHeader>
              <Tabs defaultValue="lost" value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="lost">Lost Item</TabsTrigger>
                  <TabsTrigger value="found">Found Item</TabsTrigger>
                </TabsList>
                <TabsContent value="lost" className="mt-4">
                  <CardDescription>
                    Report an item you've lost on campus. Be detailed to increase chances of recovery.
                  </CardDescription>
                </TabsContent>
                <TabsContent value="found" className="mt-4">
                  <CardDescription>
                    Report an item you've found on campus. Your help is crucial in returning it to its owner.
                  </CardDescription>
                </TabsContent>
              </Tabs>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Item Name *
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g. Blue Backpack, Student ID Card"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value as ItemCategory)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      Department *
                    </Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => handleInputChange("department", value as Department)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.value} value={dept.value}>
                            {dept.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of the item"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location *
                    </Label>
                    <Select
                      value={formData.location}
                      onValueChange={(value) => handleInputChange("location", value)}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger id="location">
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc} value={loc}>
                            {loc}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date" className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Date *
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Upload Image</Label>
                  <FileUpload
                    onFileChange={() => {}}
                    onFileUpload={handleImageUpload}
                    value={uploadedImageUrl || undefined}
                    onChange={(url) => setFormData({...formData, images: [url]})}
                    accept="image/*"
                    preview={true}
                    label="Upload Image"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    `Report ${activeTab} Item`
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
