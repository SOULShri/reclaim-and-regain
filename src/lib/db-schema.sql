
-- This file is for reference only and represents the database schema we're using

-- Item messages table for real-time chat
CREATE TABLE item_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX item_messages_item_id_idx ON item_messages(item_id);
CREATE INDEX item_messages_sender_id_idx ON item_messages(sender_id);

-- Enable row level security
ALTER TABLE item_messages ENABLE ROW LEVEL SECURITY;

-- Policies for item_messages table
CREATE POLICY "Anyone can read messages" 
  ON item_messages FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert messages" 
  ON item_messages FOR INSERT TO authenticated USING (true);

CREATE POLICY "Users can update their own messages" 
  ON item_messages FOR UPDATE TO authenticated
  USING (sender_id = auth.uid());

CREATE POLICY "Users can delete their own messages" 
  ON item_messages FOR DELETE TO authenticated
  USING (sender_id = auth.uid());

-- Create a function to handle real-time notifications
CREATE OR REPLACE FUNCTION handle_new_item_notification()
RETURNS TRIGGER AS $$
BEGIN
  -- Notify about new items
  PERFORM pg_notify(
    'new_item',
    json_build_object(
      'id', NEW.id,
      'title', NEW.title,
      'status', NEW.status,
      'category', NEW.category,
      'location', NEW.location,
      'reported_by', NEW.reported_by
    )::text
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to fire the notification function
CREATE TRIGGER notify_new_item
AFTER INSERT ON items
FOR EACH ROW
EXECUTE FUNCTION handle_new_item_notification();
