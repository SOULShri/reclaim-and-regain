
export type Tables = {
  items: {
    Row: {
      id: string;
      title: string;
      description: string;
      category: string;
      status: string;
      images: string[];
      location: string;
      department: string | null;
      date: string;
      reported_by: string;
      created_at: string;
      updated_at: string;
    };
    Insert: {
      title: string;
      description: string;
      category: string;
      status: string;
      images?: string[];
      location: string;
      department?: string | null;
      date: string;
      reported_by: string;
      created_at?: string;
      updated_at?: string;
    };
    Update: {
      title?: string;
      description?: string;
      category?: string;
      status?: string;
      images?: string[];
      location?: string;
      department?: string | null;
      date?: string;
      reported_by?: string;
      updated_at?: string;
    };
  };
  users: {
    Row: {
      id: string;
      name: string;
      avatar_url: string | null;
      contact_number: string | null;
      role: string;
    };
    Insert: {
      id: string;
      name: string;
      avatar_url?: string | null;
      contact_number?: string | null;
      role?: string;
    };
    Update: {
      name?: string;
      avatar_url?: string | null;
      contact_number?: string | null;
      role?: string;
    };
  };
  item_messages: {
    Row: {
      id: string;
      item_id: string;
      sender_id: string;
      message: string;
      created_at: string;
    };
    Insert: {
      item_id: string;
      sender_id: string;
      message: string;
      created_at?: string;
    };
    Update: {
      item_id?: string;
      sender_id?: string;
      message?: string;
      created_at?: string;
    };
  };
};
