import { createClient } from '@supabase/supabase-js';
import { Item, User } from '@/types';

// Replace with your Supabase URL and anon key when you connect to Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a fallback handler if Supabase credentials are missing
let supabase;
try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials are missing. Using mock implementation.');
    // Create a mock Supabase client
    supabase = {
      auth: {
        signInWithPassword: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signInWithOAuth: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signUp: async () => ({ data: null, error: new Error('Supabase not configured') }),
        signOut: async () => ({ error: null }),
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } }, error: null }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase not configured') }),
          }),
          insert: async () => ({ data: null, error: new Error('Supabase not configured') }),
          update: async () => ({ data: null, error: new Error('Supabase not configured') }),
        }),
      }),
      storage: {
        from: () => ({
          upload: async () => ({ data: null, error: new Error('Supabase not configured') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
        }),
      },
      channel: () => ({
        on: () => ({
          on: () => ({
            subscribe: () => ({ unsubscribe: () => {} }),
          }),
        }),
      }),
    };
  } else {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Error initializing Supabase client:', error);
  // Provide fallback to prevent app crashes
  supabase = {
    // ... keep existing code (same mock implementation as above)
  };
}

export { supabase };

// Items API
export const itemsService = {
  async getItems() {
    const { data, error } = await supabase
      .from('items')
      .select('*, reported_by:users(*)');
    
    if (error) throw error;
    
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
  },
  
  async getItemById(id: string) {
    const { data, error } = await supabase
      .from('items')
      .select('*, reported_by:users(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
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
  },
  
  async createItem(item: Omit<Item, 'id' | 'reportedBy' | 'createdAt' | 'updatedAt'>, userId: string) {
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
  },
  
  async uploadImage(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `item-images/${fileName}`;
    
    const { error } = await supabase.storage
      .from('items')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('items')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
};

// Auth API
export const authService = {
  async signUp(email: string, password: string, userData: Partial<User>) {
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
  },
  
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    
    if (error) throw error;
    return data;
  },
  
  async signInWithGoogle() {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    
    if (error) throw error;
    return data;
  },
  
  async signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  
  async getCurrentUser() {
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
      name: data?.name || user.user_metadata.name,
      avatar: data?.avatar_url,
      contactNumber: data?.contact_number || user.user_metadata.contact_number,
      role: data?.role || user.user_metadata.role || 'user'
    } as User;
  },
  
  async updateProfile(userId: string, userData: Partial<User>) {
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
  },
  
  async uploadAvatar(file: File) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `avatars/${fileName}`;
    
    const { error } = await supabase.storage
      .from('users')
      .upload(filePath, file);
    
    if (error) throw error;
    
    const { data } = supabase.storage
      .from('users')
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }
};
