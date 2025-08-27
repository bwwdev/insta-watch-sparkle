import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Heart, MessageCircle, Eye, Share2, Calendar } from "lucide-react";
import { UniquePost } from "@/types/watchdog";
import { format } from "date-fns";

interface PostCardProps {
  post: UniquePost;
  onClick: () => void;
}

export function PostCard({ post, onClick }: PostCardProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const engagementRate = ((post.totalLikes + post.totalComments) / post.followers) * 100;

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-hover bg-gradient-card border-0 backdrop-blur-sm"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative aspect-square overflow-hidden rounded-t-lg">
          {post.thumbnail ? (
            <img 
              src={post.thumbnail} 
              alt="Post thumbnail" 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
              <div className="text-muted-foreground text-lg">No Image</div>
            </div>
          )}
          
          {post.is_video && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <Play className="h-6 w-6 text-white fill-white" />
              </div>
            </div>
          )}
          
          <div className="absolute top-3 right-3">
            <Badge 
              variant="secondary" 
              className="bg-black/50 text-white border-0 backdrop-blur-sm"
            >
              {post.is_video ? 'Video' : 'Photo'}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-instagram rounded-full flex items-center justify-center text-white font-semibold text-sm">
              {post.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-sm">@{post.username}</p>
              <p className="text-xs text-muted-foreground">{formatNumber(post.followers)} followers</p>
            </div>
          </div>
          
          {post.caption && (
            <p className="text-sm text-foreground line-clamp-2 leading-relaxed">
              {post.caption}
            </p>
          )}
          
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-1 text-xs">
              <Heart className="h-3 w-3 text-chart-likes" />
              <span className="font-medium">{formatNumber(post.totalLikes)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <MessageCircle className="h-3 w-3 text-chart-comments" />
              <span className="font-medium">{formatNumber(post.totalComments)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Eye className="h-3 w-3 text-chart-views" />
              <span className="font-medium">{formatNumber(post.totalViews)}</span>
            </div>
            <div className="flex items-center gap-1 text-xs">
              <Share2 className="h-3 w-3 text-chart-shares" />
              <span className="font-medium">{formatNumber(post.totalShares)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{format(new Date(post.firstPostDate), 'MMM d')} - {format(new Date(post.lastPostDate), 'MMM d')}</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {engagementRate.toFixed(1)}% ER
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}