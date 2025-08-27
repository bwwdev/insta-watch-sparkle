export interface WatchDogPost {
  id: number;
  post_code: string;
  post_date: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
  is_video: boolean;
  video_duration?: number;
  created_at: string;
  thumbnail?: string;
  profile_key: string;
  video_url?: string;
  username: string;
  post_url: string;
  caption?: string;
  followers: number;
}

export interface PostEngagement {
  date: string;
  likes: number;
  comments: number;
  views: number;
  shares: number;
}

export interface UniquePost {
  post_code: string;
  username: string;
  caption?: string;
  thumbnail?: string;
  is_video: boolean;
  video_url?: string;
  post_url: string;
  profile_key: string;
  followers: number;
  totalLikes: number;
  totalComments: number;
  totalViews: number;
  totalShares: number;
  engagementData: PostEngagement[];
  firstPostDate: string;
  lastPostDate: string;
}