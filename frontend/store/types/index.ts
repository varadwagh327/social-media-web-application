// User Types
export interface User {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  profilePictureUrl?: string;
  bio?: string;
  role: 'user' | 'admin';
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  postsCount?: number;
}

// Post Types
export interface Post {
  id: string;
  userId: string;
  user?: User;
  title: string;
  description?: string;
  contentType: 'image' | 'video';
  mediaUrl: string;
  thumbnailUrl?: string;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  isPublished: boolean;
  isLikedByUser?: boolean;
  createdAt: string;
  updatedAt: string;
}

// Comment Types
export interface Comment {
  id: string;
  postId: string;
  user: User;
  content: string;
  likesCount: number;
  createdAt: string;
  updatedAt: string;
}

// Pagination Types
export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// State Types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
}

export interface UIState {
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  notifications: Array<{
    id: string;
    message: string;
    type: 'success' | 'error' | 'info';
  }>;
}

// API Response Types
export interface ApiResponse<T> {
  status: string;
  data?: T;
  message?: string;
  error?: string;
  details?: Record<string, any>;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: Pagination;
}

// Form Types
export interface LoginFormData {
  username: string;
  password: string;
}

export interface SignupFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  full_name?: string;
}

export interface PostFormData {
  title: string;
  description?: string;
  content_type: 'text' | 'image' | 'video';
  file?: File;
}

export interface CommentFormData {
  content: string;
}

export interface UpdateUserData {
  full_name?: string;
  bio?: string;
  profile_picture_url?: string;
}

// API Request/Response Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  email: string;
  password: string;
  fullName?: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface SignupResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PostResponse {
  id: string;
  userId: string;
  user: User;
  title: string;
  description?: string;
  content_type: string;
  media_url: string;
  thumbnail_url?: string;
  likes_count: number;
  comments_count: number;
  shares_count: number;
  is_published: boolean;
  is_liked_by_user?: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommentResponse {
  id: string;
  post_id: string;
  user_id: string;
  user: User;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface ListPostsResponse {
  items: PostResponse[];
  pagination: Pagination;
}

export interface ListCommentsResponse {
  items: CommentResponse[];
  pagination: Pagination;
}

export interface UserResponse {
  id: string;
  username: string;
  email: string;
  full_name?: string;
  profile_picture_url?: string;
  bio?: string;
  role: string;
  is_active: boolean;
  email_verified: boolean;
  created_at: string;
  posts_count?: number;
}

// Hook Types
export type UseAuthReturn = {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<any>;
  signup: (userData: SignupRequest) => Promise<any>;
  logout: () => Promise<void>;
};

export type UsePostsReturn = {
  posts: PostResponse[];
  loading: boolean;
  error: string | null;
  pagination: Pagination;
  fetchPosts: (page: number, limit: number) => Promise<void>;
};

export type UseReduxReturn = {
  state: any;
  dispatch: any;
};

// Component Props Types
export interface PostCardProps {
  post: PostResponse;
  onLike?: (postId: string) => void;
  onDelete?: (postId: string) => void;
  onComment?: (postId: string) => void;
  currentUserId?: string;
  isLoading?: boolean;
}

export interface PostFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export interface CommentSectionProps {
  postId: string;
  comments: CommentResponse[];
  onAddComment: (content: string) => Promise<void>;
  isLoading?: boolean;
  currentUserId?: string;
}

export interface LoginFormProps {
  onSuccess?: () => void;
}

export interface SignupFormProps {
  onSuccess?: () => void;
}

export interface NavbarProps {
  user?: User | null;
}

export interface ErrorBoundaryProps {
  children: any;
}

export interface AnimatedBackgroundProps {
  className?: string;
}

// Redux Action Types
export interface ThunkError {
  rejectValue: string;
}

export interface AsyncThunkConfig {
  state: {
    auth: AuthState;
    posts: PostsState;
    ui: UIState;
  };
  rejectValue: string;
}
