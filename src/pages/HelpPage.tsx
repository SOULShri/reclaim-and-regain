
import React from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const HelpPage = () => {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-bold mb-2 text-center">Help Center</h1>
        <p className="text-center text-muted-foreground mb-8">
          Find answers to common questions and learn how to use our platform
        </p>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-xl mx-auto">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for help topics..."
            className="pl-10"
          />
        </div>

        {/* Help Tabs */}
        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="faq">Frequently Asked Questions</TabsTrigger>
            <TabsTrigger value="guide">User Guide</TabsTrigger>
            <TabsTrigger value="contact">Contact Support</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>
                  Quick answers to the most common questions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>How do I report a lost item?</AccordionTrigger>
                    <AccordionContent>
                      To report a lost item, log in to your account and click on the "Report Item" button in the navigation menu. Fill out the form with as much detail as possible about the lost item, including when and where you last saw it, a detailed description, and any photos if available.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>How can I search for found items?</AccordionTrigger>
                    <AccordionContent>
                      You can search for found items by visiting the "Found Items" page. Use the search filters to narrow down results by category, location, date, and keywords. Browse through the listings to see if your item has been found and turned in.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>What information should I include when reporting an item?</AccordionTrigger>
                    <AccordionContent>
                      When reporting an item, be as specific as possible. Include the item's category, physical description (color, size, brand), any identifying marks or features, the location where it was lost or found, the date and time, and clear photos if available. The more detailed your description, the higher the chance of a successful match.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>How long are items kept in the lost and found?</AccordionTrigger>
                    <AccordionContent>
                      Items are typically kept in our lost and found for 30 days. After this period, unclaimed items may be donated to charity, disposed of, or handled according to local regulations. High-value items may be kept for a longer period at our discretion.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>Is there a fee for using this service?</AccordionTrigger>
                    <AccordionContent>
                      Basic services on our platform are completely free. This includes reporting lost items, searching for found items, and claiming your own items. Premium features, such as extended listing periods or priority notifications, may require a subscription or one-time fee.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Guide Tab */}
          <TabsContent value="guide" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Guide</CardTitle>
                <CardDescription>
                  Learn how to make the most of our platform
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Getting Started</h3>
                  <p className="text-muted-foreground">
                    Create an account to access all features of our lost and found platform. Once registered, you can report lost items, browse found items, and get notified when potential matches are found.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Reporting Items</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Log in to your account</li>
                    <li>Click on "Report Item" in the main navigation</li>
                    <li>Select whether the item is lost or found</li>
                    <li>Fill out the form with detailed information</li>
                    <li>Upload clear photos if available</li>
                    <li>Submit your report</li>
                  </ol>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Searching for Items</h3>
                  <p className="text-muted-foreground">
                    Use the search filters to find specific items. You can filter by category, location, date, and keywords. Browse through the listings and click on any item to view more details.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-medium mb-2">Claiming an Item</h3>
                  <p className="text-muted-foreground">
                    When you find your item in the listings, click on the "Claim" button. You'll need to provide verification details to prove ownership. Our team will review your claim and contact you with next steps for retrieval.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Contact Support Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>
                  Need more help? Our support team is ready to assist you
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">
                  If you couldn't find the information you need in our FAQs or User Guide, please don't hesitate to contact our support team. We're here to help you with any questions or issues you may have.
                </p>
                <a href="/contact" className="block w-full">
                  <Button className="w-full">Go to Contact Page</Button>
                </a>
                <div className="mt-6 pt-6 border-t">
                  <h3 className="text-lg font-medium mb-4">Support Hours</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monday - Friday</span>
                      <span>9:00 AM - 6:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saturday</span>
                      <span>10:00 AM - 4:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Sunday</span>
                      <span>Closed</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default HelpPage;
