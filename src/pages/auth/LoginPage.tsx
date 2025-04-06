
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"email" | "rollno">("email");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rollno: "",
  });
  const [error, setError] = useState<string | null>(null);

  // Get the redirect path from location state or default to home
  const from = (location.state as any)?.from?.pathname || "/";

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      if (activeTab === "email") {
        if (!formData.email) {
          setError("Please enter your email address");
          return;
        }
        if (!formData.password) {
          setError("Please enter your password");
          return;
        }
        await signIn(formData.email, formData.password);
      } else {
        // Use roll number authentication
        if (formData.rollno.length !== 9 || !/^\d+$/.test(formData.rollno)) {
          setError("Please enter a valid 9-digit roll number");
          return;
        }
        if (!formData.password) {
          setError("Please enter your password");
          return;
        }
        await signIn(`${formData.rollno}@vjti.ac.in`, formData.password);
      }
      navigate(from, { replace: true });
    } catch (error: any) {
      console.error("Login failed:", error);
      // Show a more user-friendly error message
      if (error.message.includes("Invalid login credentials")) {
        setError("Invalid email or password. Please check your credentials and try again.");
      } else if (error.message.includes("Email not confirmed")) {
        setError("Please verify your email address before logging in. Check your inbox for a confirmation email.");
      } else {
        setError(error?.message || "Login failed. Please check your credentials.");
      }
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold text-primary animate-pulse-gentle">VJTI Lost & Found</h1>
          </Link>
        </div>
        
        <Card className="interactive-card animate-scale">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center gradient-text">Login</CardTitle>
            <CardDescription className="text-center">
              Enter your credentials to sign in
            </CardDescription>
          </CardHeader>
          
          {error && (
            <div className="px-6 mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          
          <Tabs defaultValue="email" className="px-6" onValueChange={(value) => setActiveTab(value as "email" | "rollno")}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="rollno">Roll Number</TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <TabsContent value="email" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@vjti.ac.in"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required={activeTab === "email"}
                      disabled={isLoading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                  </div>
                </TabsContent>
                
                <TabsContent value="rollno" className="space-y-4 mt-0">
                  <div className="space-y-2">
                    <Label htmlFor="rollno">Roll Number</Label>
                    <Input
                      id="rollno"
                      type="text"
                      placeholder="231080010"
                      pattern="[0-9]{9}"
                      title="Please enter a 9-digit roll number"
                      value={formData.rollno}
                      onChange={(e) => handleInputChange("rollno", e.target.value)}
                      required={activeTab === "rollno"}
                      disabled={isLoading}
                      className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                    />
                    <p className="text-xs text-muted-foreground">Format: 9 digits, e.g. 231080010</p>
                  </div>
                </TabsContent>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password">Password</Label>
                    <Link to="/auth/forgot-password" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    required
                    disabled={isLoading}
                    className="transition-all duration-300 focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                
                <Button type="submit" className="w-full hover-glow" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
                
                <div className="text-center text-sm text-muted-foreground">
                  <p>Demo credentials (for testing):</p>
                  <p>Email: demo@vjti.ac.in</p>
                  <p>Password: demo123</p>
                </div>
              </CardContent>
            </form>
          </Tabs>
          
          <CardFooter className="flex flex-col">
            <div className="mt-2 text-center text-sm">
              Don't have an account?{" "}
              <Link to="/auth/register" className="text-primary hover:underline hover:text-primary/80 transition-colors">
                Sign up
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
