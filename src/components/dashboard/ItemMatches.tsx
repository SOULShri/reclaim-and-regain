
import { Link } from 'react-router-dom';
import { useItemMatching } from '@/hooks/useItemMatching';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import { Loader2, Sparkles, Search } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

export function ItemMatches() {
  const { possibleMatches, isLoading } = useItemMatching();

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40">
      <CardHeader className="relative pb-2">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-teal-200/30 dark:from-blue-800/20 dark:to-teal-800/20 rounded-full blur-3xl -z-10"></div>
        
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300">
          <Sparkles className="h-5 w-5 text-amber-500" />
          Potential Matches
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
        </CardTitle>
        <CardDescription className="font-medium text-muted-foreground">
          We've found items that might match what you're looking for
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Searching for matches...</p>
          </div>
        ) : possibleMatches.length > 0 ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="px-3 py-1 bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50">
                {possibleMatches.length} potential {possibleMatches.length === 1 ? 'match' : 'matches'} found
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {possibleMatches.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ItemCard item={item} />
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/20">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-lg font-medium text-center mb-2">No potential matches found yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              We're continuously scanning for new items that might match what you're looking for.
            </p>
            <Button 
              asChild 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 shadow-md hover:shadow-lg transition-all"
            >
              <Link to="/lost-items" className="flex items-center gap-2">
                Browse Lost Items
              </Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
