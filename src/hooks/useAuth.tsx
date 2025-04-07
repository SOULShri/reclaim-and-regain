
import { useState, useEffect, useCallback } from 'react';
import { User } from '@/types';
import { authService } from '@/services/authService';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Function to refresh user data
  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      return currentUser;
    } catch (error) {
      console.error('Error refreshing user:', error);
      return null;
    }
  }, []);

  useEffect(() => {
    // Initial state check
    setIsLoading(true);
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event);
      
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setIsLoading(false);
        return;
      }
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        // Using setTimeout to avoid blocking the auth state change
        setTimeout(() => {
          refreshUser().finally(() => setIsLoading(false));
        }, 0);
      }
    });

    // Initial user check
    const checkUser = async () => {
      try {
        await refreshUser();
      } finally {
        setIsLoading(false);
      }
    };
    
    checkUser();

    return () => {
      subscription?.unsubscribe();
    };
  }, [refreshUser]);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await authService.signIn(email, password);
      const userData = await refreshUser();
      
      toast({
        title: "Login Successful",
        description: `Welcome back${userData?.name ? ', ' + userData.name : ''}!`,
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

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setIsLoading(true);
      await authService.signUp(email, password, userData);
      toast({
        title: "Registration Successful",
        description: "Your account has been created! You can now log in.",
      });
    } catch (error: any) {
      let errorMessage = error.message || "An error occurred during registration";
      
      if (error.message.includes('User already registered')) {
        errorMessage = "This email is already registered. Please try logging in instead.";
      } else if (error.message.includes('password')) {
        errorMessage = "Password must be at least 6 characters long.";
      }
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
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
      await authService.signInWithGoogle();
      // Toast is shown after redirect back to app
    } catch (error: any) {
      console.error('Google sign in error:', error);
      toast({
        title: "Google Sign In Failed",
        description: error.message || "An error occurred during Google sign in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGithub = async () => {
    try {
      setIsLoading(true);
      await authService.signInWithGithub();
      // Toast is shown after redirect back to app
    } catch (error: any) {
      console.error('Github sign in error:', error);
      toast({
        title: "Github Sign In Failed",
        description: error.message || "An error occurred during Github sign in.",
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

  return {
    user,
    isLoading,
    signIn,
    signUp,
    signInWithGoogle,
    signInWithGithub,
    signOut,
    updateProfile
  };
};
