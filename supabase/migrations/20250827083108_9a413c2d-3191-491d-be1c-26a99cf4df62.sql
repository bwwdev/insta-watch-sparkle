-- Create RLS policies for public read access to analytics data
-- Since this is an analytics dashboard for Instagram data, we'll allow public read access

-- Policy for watch_dog table
CREATE POLICY "Allow public read access to watch_dog" 
ON public.watch_dog 
FOR SELECT 
USING (true);

-- Policy for post_child_comments table
CREATE POLICY "Allow public read access to post_child_comments" 
ON public.post_child_comments 
FOR SELECT 
USING (true);

-- Policy for post_comment_lead_identification table  
CREATE POLICY "Allow public read access to post_comment_lead_identification" 
ON public.post_comment_lead_identification 
FOR SELECT 
USING (true);

-- Policy for watch_dog_post_comments table
CREATE POLICY "Allow public read access to watch_dog_post_comments" 
ON public.watch_dog_post_comments 
FOR SELECT 
USING (true);