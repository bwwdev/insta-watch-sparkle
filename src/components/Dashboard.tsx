import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, Users, Video, Image, BarChart3 } from "lucide-react";
import { PostCard } from "./PostCard";
import { PostDetailView } from "./PostDetailView";
import { UniquePost, WatchDogPost } from "@/types/watchdog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export function Dashboard() {
  const [posts, setPosts] = useState<UniquePost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<UniquePost[]>([]);
  const [selectedPost, setSelectedPost] = useState<UniquePost | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const filtered = posts.filter(post => 
      post.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.caption && post.caption.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredPosts(filtered);
  }, [posts, searchTerm]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('watch_dog')
        .select('*')
        .order('post_date', { ascending: true });

      if (error) {
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      const groupedPosts = groupPostsByCode(data as WatchDogPost[]);
      setPosts(groupedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      toast({
        title: "Error",
        description: "Failed to fetch posts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const groupPostsByCode = (watchDogPosts: WatchDogPost[]): UniquePost[] => {
    const groupedMap = new Map<string, WatchDogPost[]>();
    
    watchDogPosts.forEach(post => {
      if (!groupedMap.has(post.post_code)) {
        groupedMap.set(post.post_code, []);
      }
      groupedMap.get(post.post_code)!.push(post);
    });

    return Array.from(groupedMap.entries()).map(([postCode, posts]) => {
      const sortedPosts = posts.sort((a, b) => new Date(a.post_date).getTime() - new Date(b.post_date).getTime());
      const firstPost = sortedPosts[0];
      const lastPost = sortedPosts[sortedPosts.length - 1];

      const totalLikes = Math.max(...sortedPosts.map(p => p.likes || 0));
      const totalComments = Math.max(...sortedPosts.map(p => p.comments || 0));
      const totalViews = Math.max(...sortedPosts.map(p => p.views || 0));
      const totalShares = Math.max(...sortedPosts.map(p => p.shares || 0));

      const engagementData = sortedPosts.map(post => ({
        date: post.post_date,
        likes: post.likes || 0,
        comments: post.comments || 0,
        views: post.views || 0,
        shares: post.shares || 0,
      }));

      return {
        post_code: postCode,
        username: firstPost.username,
        caption: firstPost.caption,
        thumbnail: firstPost.thumbnail,
        is_video: firstPost.is_video,
        video_url: firstPost.video_url,
        post_url: firstPost.post_url,
        profile_key: firstPost.profile_key,
        followers: firstPost.followers || 0,
        totalLikes,
        totalComments,
        totalViews,
        totalShares,
        engagementData,
        firstPostDate: firstPost.post_date,
        lastPostDate: lastPost.post_date,
      };
    });
  };

  const totalPosts = posts.length;
  const totalVideos = posts.filter(p => p.is_video).length;
  const totalPhotos = posts.filter(p => !p.is_video).length;
  const totalLikes = posts.reduce((sum, p) => sum + p.totalLikes, 0);
  const totalEngagement = posts.reduce((sum, p) => sum + p.totalLikes + p.totalComments, 0);
  const avgEngagementRate = posts.length > 0 
    ? posts.reduce((sum, p) => sum + ((p.totalLikes + p.totalComments) / p.followers * 100), 0) / posts.length 
    : 0;

  if (selectedPost) {
    return (
      <PostDetailView 
        post={selectedPost} 
        onBack={() => setSelectedPost(null)} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-gradient-instagram bg-clip-text text-transparent">
            <BarChart3 className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold">Instagram Analytics Dashboard</h1>
          </div>
          <p className="text-muted-foreground text-lg">Track your post performance across 15 days</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-sm font-medium">Total Posts</span>
              </div>
              <p className="text-2xl font-bold">{totalPosts}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Video className="h-5 w-5 text-chart-views" />
                <span className="text-sm font-medium">Videos</span>
              </div>
              <p className="text-2xl font-bold">{totalVideos}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Image className="h-5 w-5 text-chart-shares" />
                <span className="text-sm font-medium">Photos</span>
              </div>
              <p className="text-2xl font-bold">{totalPhotos}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-chart-likes" />
                <span className="text-sm font-medium">Total Likes</span>
              </div>
              <p className="text-2xl font-bold">{totalLikes.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Users className="h-5 w-5 text-chart-comments" />
                <span className="text-sm font-medium">Avg ER</span>
              </div>
              <p className="text-2xl font-bold">{avgEngagementRate.toFixed(1)}%</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter Posts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by username or caption..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/50 border-white/20"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">
                  All ({totalPosts})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  Videos ({totalVideos})
                </Badge>
                <Badge variant="outline" className="cursor-pointer hover:bg-accent/20">
                  Photos ({totalPhotos})
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i} className="bg-gradient-card border-0 shadow-card backdrop-blur-sm animate-pulse">
                <CardContent className="p-0">
                  <div className="aspect-square bg-muted rounded-t-lg"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="h-3 bg-muted rounded"></div>
                      <div className="h-3 bg-muted rounded"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPosts.map((post) => (
              <PostCard
                key={post.post_code}
                post={post}
                onClick={() => setSelectedPost(post)}
              />
            ))}
          </div>
        )}

        {!loading && filteredPosts.length === 0 && (
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No posts found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search criteria' : 'No posts available in the database'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}