import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Play, Heart, MessageCircle, Eye, Share2, Calendar, TrendingUp, TrendingDown, BarChart3 } from "lucide-react";
import { UniquePost } from "@/types/watchdog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { format } from "date-fns";

interface PostDetailViewProps {
  post: UniquePost;
  onBack: () => void;
}

export function PostDetailView({ post, onBack }: PostDetailViewProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const engagementRate = ((post.totalLikes + post.totalComments) / post.followers) * 100;
  
  const chartData = post.engagementData.map(item => ({
    ...item,
    date: format(new Date(item.date), 'MMM d'),
    engagement: item.likes + item.comments
  }));

  // Calculate daily changes
  const dailyChangeData = post.engagementData.map((current, index) => {
    const previous = index > 0 ? post.engagementData[index - 1] : null;
    return {
      date: format(new Date(current.date), 'MMM d'),
      likesChange: previous ? current.likes - previous.likes : current.likes,
      commentsChange: previous ? current.comments - previous.comments : current.comments,
      viewsChange: previous ? current.views - previous.views : current.views,
      sharesChange: previous ? current.shares - previous.shares : current.shares,
    };
  });

  const latestData = post.engagementData[post.engagementData.length - 1];
  const previousData = post.engagementData[post.engagementData.length - 2];
  
  const growthMetrics = [
    {
      label: "Likes Growth",
      current: latestData?.likes || 0,
      previous: previousData?.likes || 0,
      color: "text-chart-likes"
    },
    {
      label: "Comments Growth", 
      current: latestData?.comments || 0,
      previous: previousData?.comments || 0,
      color: "text-chart-comments"
    },
    {
      label: "Views Growth",
      current: latestData?.views || 0,
      previous: previousData?.views || 0,
      color: "text-chart-views"
    },
    {
      label: "Shares Growth",
      current: latestData?.shares || 0,
      previous: previousData?.shares || 0,
      color: "text-chart-shares"
    }
  ];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="hover:bg-white/50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Post Header */}
        <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3">
                <div className="relative aspect-square rounded-lg overflow-hidden">
                  {post.thumbnail ? (
                    <img 
                      src={post.thumbnail} 
                      alt="Post thumbnail" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-subtle flex items-center justify-center">
                      <div className="text-muted-foreground">No Image</div>
                    </div>
                  )}
                  
                  {post.is_video && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4 backdrop-blur-sm">
                        <Play className="h-8 w-8 text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:w-2/3 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-instagram rounded-full flex items-center justify-center text-white font-bold">
                      {post.username.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h1 className="text-xl font-bold">@{post.username}</h1>
                      <p className="text-muted-foreground">{formatNumber(post.followers)} followers</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Badge variant="secondary">
                      {post.is_video ? 'Video' : 'Photo'}
                    </Badge>
                    <Badge variant="outline">
                      {engagementRate.toFixed(1)}% ER
                    </Badge>
                  </div>
                </div>
                
                {post.caption && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-sm leading-relaxed">{post.caption}</p>
                  </div>
                )}
                
                <div className="grid grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <Heart className="h-5 w-5 text-chart-likes mx-auto mb-1" />
                    <p className="text-lg font-bold">{formatNumber(post.totalLikes)}</p>
                    <p className="text-xs text-muted-foreground">Total Likes</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <MessageCircle className="h-5 w-5 text-chart-comments mx-auto mb-1" />
                    <p className="text-lg font-bold">{formatNumber(post.totalComments)}</p>
                    <p className="text-xs text-muted-foreground">Total Comments</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <Eye className="h-5 w-5 text-chart-views mx-auto mb-1" />
                    <p className="text-lg font-bold">{formatNumber(post.totalViews)}</p>
                    <p className="text-xs text-muted-foreground">Total Views</p>
                  </div>
                  <div className="text-center p-3 bg-white/50 rounded-lg">
                    <Share2 className="h-5 w-5 text-chart-shares mx-auto mb-1" />
                    <p className="text-lg font-bold">{formatNumber(post.totalShares)}</p>
                    <p className="text-xs text-muted-foreground">Total Shares</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button asChild className="bg-gradient-instagram hover:opacity-90">
                    <a href={post.post_url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Post
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Growth Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {growthMetrics.map((metric, index) => {
            const growth = calculateGrowth(metric.current, metric.previous);
            const isPositive = growth > 0;
            
            return (
              <Card key={index} className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
                  <p className={`text-2xl font-bold ${metric.color} mb-1`}>
                    {formatNumber(metric.current)}
                  </p>
                  <div className={`flex items-center justify-center gap-1 text-xs ${
                    isPositive ? 'text-green-600' : growth < 0 ? 'text-red-600' : 'text-muted-foreground'
                  }`}>
                    <TrendingUp className={`h-3 w-3 ${!isPositive && growth < 0 ? 'rotate-180' : ''}`} />
                    <span>{growth.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Engagement Trends */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Engagement Over Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="likes" 
                    stroke="hsl(var(--chart-likes))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="comments" 
                    stroke="hsl(var(--chart-comments))" 
                    strokeWidth={2}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Views & Shares
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Bar dataKey="views" fill="hsl(var(--chart-views))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="shares" fill="hsl(var(--chart-shares))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Daily Engagement Changes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Daily Likes & Comments Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChangeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value >= 0 ? '+' : ''}${value}`,
                      name.replace('Change', ' Change')
                    ]}
                  />
                  <Bar dataKey="likesChange" fill="hsl(var(--chart-likes))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="commentsChange" fill="hsl(var(--chart-comments))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Daily Views & Shares Change
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={dailyChangeData}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis dataKey="date" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--card))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number, name: string) => [
                      `${value >= 0 ? '+' : ''}${value}`,
                      name.replace('Change', ' Change')
                    ]}
                  />
                  <Bar dataKey="viewsChange" fill="hsl(var(--chart-views))" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="sharesChange" fill="hsl(var(--chart-shares))" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Timeline */}
        <Card className="bg-gradient-card border-0 shadow-card backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Daily Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {post.engagementData.map((day, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white/30 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-instagram rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {format(new Date(day.date), 'd')}
                    </div>
                    <div>
                      <p className="font-medium">{format(new Date(day.date), 'EEEE, MMM d')}</p>
                      <p className="text-sm text-muted-foreground">Day {index + 1}</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-sm font-medium text-chart-likes">{formatNumber(day.likes)}</p>
                      <p className="text-xs text-muted-foreground">Likes</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-chart-comments">{formatNumber(day.comments)}</p>
                      <p className="text-xs text-muted-foreground">Comments</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-chart-views">{formatNumber(day.views)}</p>
                      <p className="text-xs text-muted-foreground">Views</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-chart-shares">{formatNumber(day.shares)}</p>
                      <p className="text-xs text-muted-foreground">Shares</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}