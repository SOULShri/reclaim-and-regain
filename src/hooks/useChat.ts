
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

export type ChatMessage = {
  id: string;
  itemId: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
};

export function useChat(itemId: string) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load existing messages
  useEffect(() => {
    if (!itemId || !user) return;

    const fetchMessages = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('item_messages')
          .select('*')
          .eq('item_id', itemId)
          .order('created_at', { ascending: true });

        if (error) throw error;
        
        // Transform data to match ChatMessage type
        const formattedMessages = await Promise.all(
          data.map(async (msg) => {
            // Get sender name
            const { data: userData } = await supabase
              .from('users')
              .select('name')
              .eq('id', msg.sender_id)
              .single();
              
            return {
              id: msg.id,
              itemId: msg.item_id,
              senderId: msg.sender_id,
              senderName: userData?.name || 'Unknown User',
              message: msg.message,
              createdAt: msg.created_at
            } as ChatMessage;
          })
        );
        
        setMessages(formattedMessages);
      } catch (err: any) {
        console.error('Error fetching messages:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`item-messages-${itemId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'item_messages',
        filter: `item_id=eq.${itemId}`
      }, async (payload) => {
        // Get sender name
        const { data: userData } = await supabase
          .from('users')
          .select('name')
          .eq('id', payload.new.sender_id)
          .single();

        const newMessage: ChatMessage = {
          id: payload.new.id,
          itemId: payload.new.item_id,
          senderId: payload.new.sender_id,
          senderName: userData?.name || 'Unknown User',
          message: payload.new.message,
          createdAt: payload.new.created_at
        };

        setMessages(prev => [...prev, newMessage]);
        
        // Show notification for new messages if not from current user
        if (payload.new.sender_id !== user.id) {
          toast({
            title: "New Message",
            description: `${newMessage.senderName}: ${newMessage.message.substring(0, 30)}${newMessage.message.length > 30 ? '...' : ''}`,
          });
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [itemId, user, toast]);

  // Function to send a new message
  const sendMessage = async (message: string) => {
    if (!itemId || !user || !message.trim()) return null;

    try {
      const { data, error } = await supabase
        .from('item_messages')
        .insert({
          item_id: itemId,
          sender_id: user.id,
          message: message.trim()
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (err: any) {
      console.error('Error sending message:', err);
      setError(err.message);
      return null;
    }
  };

  return { messages, isLoading, error, sendMessage };
}
