
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Clock, MapPin, Search, AlertTriangle, CheckCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

type ActivityItem = {
  id: string;
  title: string;
  action: 'lost' | 'found' | 'claimed' | 'resolved';
  location: string;
  userName: string;
  userAvatar?: string;
  timestamp: string;
};

export function ActivityFeed() {
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch recent activities
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*, reported_by:users(name, avatar_url)')
          .order('created_at', { ascending: false })
          .limit(10);
          
        if (error) throw error;
        
        const formattedActivities = data.map(item => ({
          id: item.id,
          title: item.title,
          action: item.status,
          location: item.location,
          userName: item.reported_by?.name || 'Anonymous',
          userAvatar: item.reported_by?.avatar_url,
          timestamp: item.created_at
        }));
        
        setActivities(formattedActivities);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
    
    // Subscribe to new items
    const subscription = supabase
      .channel('public:items')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'items',
      }, async (payload) => {
        if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
          // Fetch user data
          const { data: userData } = await supabase
            .from('users')
            .select('name, avatar_url')
            .eq('id', payload.new.reported_by)
            .single();
          
          const newActivity: ActivityItem = {
            id: payload.new.id,
            title: payload.new.title,
            action: payload.new.status,
            location: payload.new.location,
            userName: userData?.name || 'Anonymous',
            userAvatar: userData?.avatar_url,
            timestamp: payload.new.created_at
          };
          
          // Add to beginning of list and maintain max 10 items
          setActivities(prev => [newActivity, ...prev].slice(0, 10));
        }
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'lost':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'found':
        return <Search className="h-5 w-5 text-blue-500" />;
      case 'claimed':
      case 'resolved':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Feed</CardTitle>
        <CardDescription>Recent lost and found activities</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : activities.length > 0 ? (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.userAvatar || ""} />
                  <AvatarFallback className="bg-primary/10">
                    {activity.userName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{activity.userName}</span>
                    <Badge variant="outline" className="capitalize">
                      {activity.action}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(activity.timestamp)}
                    </span>
                  </div>
                  
                  <Link to={`/items/${activity.id}`} className="font-medium hover:underline">
                    {activity.title}
                  </Link>
                  
                  <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    <span>{activity.location}</span>
                  </div>
                </div>
                
                <div className="flex-shrink-0">
                  {getActionIcon(activity.action)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
