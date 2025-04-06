
import React, { createContext, useState, useEffect, useContext } from 'react';
import { User } from '@/types';
import { authService, supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error checking authentication:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Auth state change error:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      if (!supabase || !supabase.auth) {
        toast({
          title: "Authentication Error",
          description: "Authentication service is not available. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      await authService.signIn(email, password);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      toast({
        title: "Login Successful",
        description: `Welcome back, ${currentUser?.name || 'User'}!`,
      });
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast({
        title: "Login Failed",
        description: error.message || "An error occurred during login. Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      if (!supabase || !supabase.auth) {
        toast({
          title: "Authentication Error",
          description: "Google authentication is not available. Please try again later.",
          variant: "destructive",
        });
        return;
      }
      
      try {
        await authService.signInWithGoogle();
      } catch (error: any) {
        // Check specifically for the provider not enabled error
        if (error.message && error.message.includes('provider is not enabled')) {
          toast({
            title: "Google Login Failed",
            description: "Google authentication is not enabled in your Supabase project. Please configure it in the Supabase dashboard.",
            variant: "destructive",
          });
          setIsLoading(false);
          return;
        }
        throw error;
      }
      
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        toast({
          title: "Login Successful",
          description: `Welcome, ${currentUser.name}!`,
        });
      }
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Login Failed",
        description: error.message || "An error occurred during Google login. Please try again later.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      await authService.signUp(email, password, userData);
      toast({
        title: "Registration Successful",
        description: "Your account has been created. Please verify your email.",
      });
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "An error occurred during registration",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await authService.signOut();
      setUser(null);
      toast({
        title: "Signed Out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Sign Out Failed",
        description: error.message || "An error occurred during sign out",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      await authService.updateProfile(user.id, userData);
      
      setUser({ ...user, ...userData });
      
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signIn, signUp, signOut, updateProfile, signInWithGoogle }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
