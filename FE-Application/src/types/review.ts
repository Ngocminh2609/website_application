export interface ReviewUser {
  id: number;
  fullName?: string;
  username: string;
  avatarUrl?: string;
}

export interface ProductReview {
  id: number;
  user: ReviewUser;
  rating: number;
  comment?: string;
  isVerifiedPurchase: boolean;
  isApproved: boolean;
  product?: { id: number; name?: string };
  createdAt: string;
}
