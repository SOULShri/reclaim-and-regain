
import { User } from '@/types';
import { supabase } from '@/lib/supabase';

/**
 * Service for handling authentication related API calls
 */
export const authService = {
  /**
   * Sign in a user with email and password
   */
  async signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    if (error) throw error;
  },

  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string, userData: Partial<User>) {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      }
    });
    
    if (error) throw error;
  },

  /**
   * Sign out the current user
   */
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  /**
   * Get the current authenticated user with profile data
   */
  async getCurrentUser(): Promise<User | null> {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', session.user.id)
      .single();
    
    if (error || !data) return null;
    
    return {
      id: data.id,
      email: session.user.email || '',
      name: data.name || '',
      role: data.role || 'user',
      avatar: data.avatar_url || '',
      contactNumber: data.contact_number || '',
    };
  },

  /**
   * Update user profile data
   */
  async updateProfile(userId: string, userData: Partial<User>) {
    const { error } = await supabase
      .from('users')
      .update({
        name: userData.name,
        avatar_url: userData.avatar,
        contact_number: userData.contactNumber,
      })
      .eq('id', userId);
    
    if (error) throw error;
  },

  /**
   * Upload avatar image to storage
   */
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
