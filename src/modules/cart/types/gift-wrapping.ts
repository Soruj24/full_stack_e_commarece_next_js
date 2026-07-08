export interface GiftWrappingOption {
  id: string;
  name: string;
  price: number;
  description: string;
  color: string;
  pattern?: string;
  image?: string;
}

export interface GiftMessage {
  to: string;
  from: string;
  message: string;
}
