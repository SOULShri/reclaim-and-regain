
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';

export function useRealtime() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [newItemCount, setNewItemCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // Reset new item count when component mounts
    setNewItemCount(0);

    // Subscribe to item changes
    const subscription = supabase
      .channel('items-changes')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'items',
      }, (payload) => {
        // Show notification for new items
        if (payload.new.reported_by !== user.id) {
          const status = payload.new.status;
          const title = payload.new.title;
          
          setNewItemCount(prev => prev + 1);
          
          toast({
            title: `New ${status} Item Reported`,
            description: `Someone reported a ${status} ${title}`,
          });
        }
      })
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'items',
        filter: `reported_by=eq.${user.id}`,
      }, (payload) => {
        // Show notification when user's items are updated
        if (payload.old.status !== payload.new.status) {
          toast({
            title: 'Item Status Updated',
            description: `Your item "${payload.new.title}" status changed to ${payload.new.status}`,
          });
        }
      })
      .subscribe();

    setIsSubscribed(true);

    return () => {
      subscription.unsubscribe();
      setIsSubscribed(false);
    };
  }, [user, toast]);

  return { isSubscribed, newItemCount, resetNewItemCount: () => setNewItemCount(0) };
}
