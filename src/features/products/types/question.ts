export interface Question {
  _id: string;
  productId: string;
  question: string;
  answer?: string;
  user: { name: string; image?: string };
  seller?: { name: string; image?: string };
  helpful: number;
  createdAt: string;
  updatedAt: string;
}
