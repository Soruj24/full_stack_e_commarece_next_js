export interface Review {
  _id: string;
  name?: string;
  user?: { name: string };
  rating: number;
  comment: string;
  isVerified?: boolean;
  createdAt: string;
}

export interface RatingDistribution {
  star: number;
  count: number;
  percentage: number;
}
