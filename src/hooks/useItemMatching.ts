
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Item } from '@/types';

export function useItemMatching() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [possibleMatches, setPossibleMatches] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) return;

    // Find potential matches for user's lost items
    const findMatches = async () => {
      setIsLoading(true);
      try {
        // First get user's lost items
        const { data: lostItems, error: lostError } = await supabase
          .from('items')
          .select('*')
          .eq('reported_by', user.id)
          .eq('status', 'lost');
          
        if (lostError) throw lostError;
        
        if (!lostItems || lostItems.length === 0) {
          setIsLoading(false);
          return;
        }
        
        // For each lost item, find potential matches in found items
        const allMatches: Item[] = [];
        
        for (const lostItem of lostItems) {
          const { data: matches, error: matchError } = await supabase
            .from('items')
            .select('*, reported_by:users(*)')
            .eq('status', 'found')
            .neq('reported_by', user.id)
            .or(`category.eq.${lostItem.category},location.ilike.%${lostItem.location}%`)
            .order('created_at', { ascending: false });
            
          if (matchError) throw matchError;
          
          if (matches && matches.length > 0) {
            // Convert to our Item type
            const itemMatches = matches.map(match => ({
              id: match.id,
              title: match.title,
              description: match.description,
              category: match.category,
              status: match.status,
              images: match.images || [],
              location: match.location,
              department: match.department,
              date: match.date,
              reportedBy: match.reported_by,
              createdAt: match.created_at,
              updatedAt: match.updated_at
            }));
            
            allMatches.push(...itemMatches);
          }
        }
        
        // Remove duplicates
        const uniqueMatches = allMatches.filter((match, index, self) =>
          index === self.findIndex((m) => m.id === match.id)
        );
        
        setPossibleMatches(uniqueMatches.slice(0, 5)); // Limit to 5 matches
        
      } catch (error) {
        console.error('Error finding matches:', error);
      } finally {
        setIsLoading(false);
      }
    };

    findMatches();
    
    // Set up subscription for new found items that might match
    const subscription = supabase
      .channel('items-potential-matches')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'items',
        filter: `status=eq.found`,
      }, (payload) => {
        // Show notification for new found items
        if (payload.new.reported_by !== user.id) {
          toast({
            title: "New Potential Match",
            description: `A ${payload.new.category} was found at ${payload.new.location}`,
          });
          
          // Refresh matches
          findMatches();
        }
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user, toast]);

  return { possibleMatches, isLoading };
}
