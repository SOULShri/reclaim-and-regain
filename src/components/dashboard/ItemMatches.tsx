
import { Link } from 'react-router-dom';
import { useItemMatching } from '@/hooks/useItemMatching';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ItemCard } from '@/components/items/ItemCard';
import { Loader2, Sparkles, Search, MessageCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ItemMatches() {
  const { possibleMatches, isLoading } = useItemMatching();

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 80
      }
    }
  };

  return (
    <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="relative pb-2">
        {/* Animated background elements */}
        <motion.div 
          className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200/30 to-pink-200/30 dark:from-purple-800/20 dark:to-pink-800/20 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-200/30 to-teal-200/30 dark:from-blue-800/20 dark:to-teal-800/20 rounded-full blur-3xl -z-10"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
            delay: 1
          }}
        />
        
        <CardTitle className="flex items-center gap-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-500 dark:from-purple-400 dark:to-pink-300 hover:scale-[1.01] transition-transform">
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Sparkles className="h-5 w-5 text-amber-500" />
          </motion.div>
          Potential Matches
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-primary ml-2" />}
        </CardTitle>
        
        <CardDescription className="font-medium text-muted-foreground">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
          >
            We've found items that might match what you're looking for
          </motion.span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground animate-pulse">Searching for matches...</p>
          </motion.div>
        ) : possibleMatches.length > 0 ? (
          <div className="space-y-6">
            <motion.div 
              className="flex items-center justify-between"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Badge variant="outline" className="px-3 py-1 bg-purple-50 text-purple-600 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800/50 hover:bg-purple-100 dark:hover:bg-purple-800/50 transition-colors">
                {possibleMatches.length} potential {possibleMatches.length === 1 ? 'match' : 'matches'} found
              </Badge>
            </motion.div>
            
            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {possibleMatches.map((item, index) => (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="group"
                  whileHover={{ 
                    scale: 1.02,
                    transition: { duration: 0.2 } 
                  }}
                >
                  <div className="relative">
                    <ItemCard item={item} />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Link 
                            to={`/items/${item.id}?tab=chat`}
                            className="absolute bottom-0 right-0 m-2 p-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 rounded-full text-white shadow-lg transform translate-y-0 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
                          >
                            <MessageCircle size={18} />
                          </Link>
                        </TooltipTrigger>
                        <TooltipContent side="left">
                          <p>Chat about this item</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        ) : (
          <motion.div 
            className="flex flex-col items-center justify-center py-16 px-4 bg-gradient-to-br from-blue-50/50 to-purple-50/50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-xl border border-indigo-100/50 dark:border-indigo-800/20"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
              animate={{
                boxShadow: ["0 0 0 rgba(147, 51, 234, 0.3)", "0 0 20px rgba(147, 51, 234, 0.6)", "0 0 0 rgba(147, 51, 234, 0.3)"]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "loop"
              }}
            >
              <Search className="w-8 h-8 text-primary" />
            </motion.div>
            
            <motion.h3 
              className="text-lg font-medium text-center mb-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              No potential matches found yet
            </motion.h3>
            
            <motion.p 
              className="text-muted-foreground text-center mb-6 max-w-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              We're continuously scanning for new items that might match what you're looking for.
            </motion.p>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Button 
                asChild 
                className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-500 dark:hover:to-purple-500 shadow-md hover:shadow-lg transition-all relative overflow-hidden group"
              >
                <Link to="/lost-items" className="flex items-center gap-2 relative z-10">
                  <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></span>
                  <span className="relative z-10">Browse Lost Items</span>
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
