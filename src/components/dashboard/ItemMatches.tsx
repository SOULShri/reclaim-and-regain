
import { Link } from 'react-router-dom';
import { useItemMatching } from '@/hooks/useItemMatching';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import { Loader2 } from 'lucide-react';

export function ItemMatches() {
  const { possibleMatches, isLoading } = useItemMatching();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Potential Matches
          {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
        </CardTitle>
        <CardDescription>
          Found items that might match your lost items
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : possibleMatches.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {possibleMatches.map((item) => (
              <ItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No potential matches found yet.</p>
            <Button asChild>
              <Link to="/lost-items">Browse Lost Items</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
