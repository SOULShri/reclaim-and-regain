import { createClient } from '@supabase/supabase-js';
import { User, Item, ItemCategory, ItemStatus, Department } from '@/types';
import { Tables } from '@/types/supabase';

// Create a single supabase client for interacting with your database
export const supabase = createClient<{
  Tables: Tables;
}>(
  'https://idptwncxekmrbdjrfswn.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlkcHR3bmN4ZWttcmJkanJmc3duIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MjQ5OTgsImV4cCI6MjA1OTQwMDk5OH0.9owhNpJy4HYBVdUoFv0gePBio-d5IAJ-F14YBLTE1QE',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      storage: localStorage
    }
  }
);

// Items API
export const itemsService = {
  async getItems() {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, reported_by:users(*)');
      
      if (error) throw error;
      if (!data) return [];
      
      // Transform to match our Item type
      return data.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        category: item.category,
        status: item.status,
        images: item.images || [],
        location: item.location,
        department: item.department,
        date: item.date,
        reportedBy: item.reported_by,
        createdAt: item.created_at,
        updatedAt: item.updated_at
      })) as Item[];
    } catch (error) {
      console.error('Error fetching items:', error);
      return [];
    }
  },
  
  async getItemById(id: string) {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*, reported_by:users(*)')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      if (!data) throw new Error('Item not found');
      
      return {
        id: data.id,
        title: data.title,
        description: data.description,
        category: data.category,
        status: data.status,
        images: data.images || [],
        location: data.location,
        department: data.department,
        date: data.date,
        reportedBy: data.reported_by,
        createdAt: data.created_at,
        updatedAt: data.updated_at
      } as Item;
    } catch (error) {
      console.error('Error fetching item by ID:', error);
      throw error;
    }
  },
  
  async createItem(item: Omit<Item, 'id' | 'reportedBy' | 'createdAt' | 'updatedAt'>, userId: string) {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert({
          title: item.title,
          description: item.description,
          category: item.category,
          status: item.status,
          images: item.images,
          location: item.location,
          department: item.department,
          date: item.date,
          reported_by: userId
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating item:', error);
      throw error;
    }
  },
  
  async uploadImage(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `item-images/${fileName}`;
      
      const { error: storageError } = await supabase.storage
        .from('items')
        .upload(filePath, file);
      
      if (storageError) {
        // If the bucket doesn't exist, create it and try again
        if (storageError.message.includes('does not exist')) {
          await supabase.storage.createBucket('items', {
            public: true,
            fileSizeLimit: 10485760 // 10MB
          });
          
          const { error } = await supabase.storage
            .from('items')
            .upload(filePath, file);
          
          if (error) throw error;
        } else {
          throw storageError;
        }
      }
      
      const { data } = supabase.storage
        .from('items')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  }
};

// Auth API
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: userData.name,
            contact_number: userData.contactNumber,
            role: 'user'
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Sign up error:', error);
      throw error;
    }
  },
  
  async signIn(email: string, password: string) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        // Check for specific error messages
        if (error.message.includes('Email not confirmed')) {
          throw new Error('Please check your email and confirm your account before logging in.');
        }
        if (error.message.includes('Invalid login credentials')) {
          throw new Error('Invalid email or password. Please check your credentials and try again.');
        }
        throw error;
      }
      return data;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },
  
  async signInWithGoogle() {
    try {
      // First check if Google provider is enabled
      const { data: authSettings, error: settingsError } = await supabase
        .from('providers')
        .select('*')
        .eq('name', 'google')
        .single();
        
      // If we can't access this table or there's no Google provider, we'll get an error
      // But this is internal, so we'll try anyway and catch the specific error later
        
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      });
      
      if (error) {
        // Check for specific error about the provider not being enabled
        if (error.message && error.message.includes('provider is not enabled')) {
          throw new Error('Google login is not enabled in the Supabase project settings. Please enable it in the Supabase Authentication settings.');
        }
        throw error;
      }
      
      return data;
    } catch (error) {
      console.error('Google sign in error:', error);
      throw error;
    }
  },
  
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },
  
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;
      
      // Get additional user data from profiles table
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
        
      if (error && error.code !== 'PGRST116') throw error;
      
      return {
        id: user.id,
        email: user.email!,
        name: data?.name || user.user_metadata.name || user.email?.split('@')[0], // Fallback to username from email
        avatar: data?.avatar_url,
        contactNumber: data?.contact_number || user.user_metadata.contact_number,
        role: data?.role || user.user_metadata.role || 'user'
      } as User;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },
  
  async updateProfile(userId: string, userData: Partial<User>) {
    try {
      // First check if the user exists in the users table
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (checkError && checkError.code === 'PGRST116') {
        // User doesn't exist in users table, create it
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: userId,
            name: userData.name || '',
            role: 'user'
          });
          
        if (insertError) throw insertError;
      }
      
      // Now update the profile
      const { data, error } = await supabase
        .from('users')
        .update({
          name: userData.name,
          contact_number: userData.contactNumber,
          avatar_url: userData.avatar
        })
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },
  
  async uploadAvatar(file: File) {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: storageError } = await supabase.storage
        .from('users')
        .upload(filePath, file);
      
      if (storageError) {
        // If the bucket doesn't exist, create it and try again
        if (storageError.message.includes('does not exist')) {
          await supabase.storage.createBucket('users', {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
          
          const { error } = await supabase.storage
            .from('users')
            .upload(filePath, file);
          
          if (error) throw error;
        } else {
          throw storageError;
        }
      }
      
      const { data } = supabase.storage
        .from('users')
        .getPublicUrl(filePath);
      
      return data.publicUrl;
    } catch (error) {
      console.error('Avatar upload error:', error);
      throw error;
    }
  }
};

// Export authService so it can be imported directly from this file
export { authService } from '@/services/authService';
