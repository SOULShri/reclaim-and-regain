
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Loader2, AlertCircle, Github, Mail } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn, signInWithGoogle, signInWithGithub, isLoading } = useAuth();
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
        if (!formData.rollno) {
          setError("Please enter your roll number");
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
      // Error handling is done in the useAuth hook
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // Redirect happens automatically after OAuth flow
    } catch (error) {
      console.error("Google sign in error:", error);
      // Error handling is done in the useAuth hook
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await signInWithGithub();
      // Redirect happens automatically after OAuth flow
    } catch (error) {
      console.error("Github sign in error:", error);
      // Error handling is done in the useAuth hook
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
          
          <div className="px-6 mb-4">
            <div className="flex flex-col space-y-3">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleGoogleSignIn}
              >
                <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  <path d="M1 1h22v22H1z" fill="none"/>
                </svg>
                Sign in with Google
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center justify-center gap-2"
                disabled={isLoading}
                onClick={handleGithubSignIn}
              >
                <Github className="h-5 w-5" />
                Sign in with GitHub
              </Button>
            </div>
            
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t"></span>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
          </div>
          
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
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Sign in with Email
                    </>
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
