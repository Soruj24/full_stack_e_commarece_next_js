export interface TestimonialData {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  product: string;
  date: string;
  featured: boolean;
}

export const testimonials: TestimonialData[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Fashion Enthusiast",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    rating: 5,
    title: "Best Online Shopping Experience!",
    content:
      "I've been shopping here for over a year and I couldn't be happier. The product quality is exceptional, shipping is always fast, and customer service is incredible. Highly recommend!",
    product: "Premium Wireless Headphones",
    date: "2 weeks ago",
    featured: true,
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Tech Reviewer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
    rating: 5,
    title: "Outstanding Quality",
    content:
      "The smart watch exceeded all my expectations. Build quality is premium and the price was competitive. Will definitely be purchasing more!",
    product: "Smart Watch Pro Series",
    date: "1 month ago",
    featured: false,
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Lifestyle Blogger",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    rating: 5,
    title: "Love This Store!",
    content:
      "From browsing to checkout, everything was seamless. The package arrived beautifully packaged and in perfect condition. 10/10 would recommend.",
    product: "Designer Collection Bag",
    date: "3 weeks ago",
    featured: false,
  },
  {
    id: 4,
    name: "David Kim",
    role: "Electronics Expert",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Five Stars All Around!",
    content:
      "This is my go-to store for electronics. Prices are competitive, products are authentic, and delivery is always on time. The 30-day return policy is a bonus.",
    product: "4K Ultra HD Camera",
    date: "1 week ago",
    featured: true,
  },
  {
    id: 5,
    name: "Jessica Thompson",
    role: "Verified Buyer",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    rating: 5,
    title: "Absolutely Amazing!",
    content:
      "This store changed my mind about online shopping. The product photos are accurate and the overall experience has been fantastic. Thank you!",
    product: "Organic Skincare Set",
    date: "5 days ago",
    featured: false,
  },
  {
    id: 6,
    name: "Alex Turner",
    role: "Frequent Shopper",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop",
    rating: 5,
    title: "Unmatched Value",
    content:
      "I've tried many online stores, but this one stands out for its curation and quality. Every product feels carefully selected.",
    product: "Premium Fitness Tracker",
    date: "2 days ago",
    featured: false,
  },
];
