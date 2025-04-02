
import { useState, useRef, useEffect } from 'react';
import { useChat, ChatMessage } from '@/hooks/useChat';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ItemChatProps {
  itemId: string;
}

export function ItemChat({ itemId }: ItemChatProps) {
  const { user } = useAuth();
  const { messages, isLoading, sendMessage } = useChat(itemId);
  const [newMessage, setNewMessage] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollArea = scrollAreaRef.current;
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    await sendMessage(newMessage);
    setNewMessage('');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="p-4 bg-muted/40 rounded-lg text-center">
        Please sign in to participate in the conversation
      </div>
    );
  }

  return (
    <div className="bg-card border rounded-lg shadow-sm flex flex-col h-[400px]">
      <div className="px-4 py-3 border-b">
        <h3 className="font-medium">Item Conversation</h3>
      </div>
      
      <ScrollArea ref={scrollAreaRef} className="flex-1 p-4 space-y-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No messages yet. Be the first to start the conversation!
          </div>
        ) : (
          messages.map((message: ChatMessage) => (
            <div 
              key={message.id} 
              className={`flex items-start gap-2 ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
            >
              {message.senderId !== user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {message.senderName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${message.senderId === user.id ? 'bg-primary text-primary-foreground' : 'bg-muted'} px-3 py-2 rounded-lg`}>
                {message.senderId !== user.id && (
                  <div className="font-medium text-xs mb-1">{message.senderName}</div>
                )}
                <div className="text-sm break-words">{message.message}</div>
                <div className="text-xs opacity-70 mt-1 text-right">
                  {formatTime(message.createdAt)}
                </div>
              </div>
              
              {message.senderId === user.id && (
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user.avatar || ""} />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))
        )}
      </ScrollArea>
      
      <form onSubmit={handleSendMessage} className="border-t p-3 flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1"
        />
        <Button type="submit" size="icon" disabled={!newMessage.trim()}>
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
