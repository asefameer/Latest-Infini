export interface Variant {
  id: string;
  name: string;
  type: 'size' | 'color';
  options: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: 'nova' | 'live-the-moment' | 'x-force';
  category: string;
  price: number;
  compareAtPrice?: number;
  currency: string;
  images: string[];
  description: string;
  specs: { label: string; value: string }[];
  variants: Variant[];
  tags: string[];
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  productCount: number;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  currency: string;
  description: string;
  remaining: number;
  maxPerOrder: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  brand: 'nova' | 'live-the-moment' | 'x-force';
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  city: string;
  bannerImage: string;
  description: string;
  lineup?: string[];
  schedule?: { time: string; activity: string }[];
  ticketTiers: TicketTier[];
  faq: { question: string; answer: string }[];
  isFeatured?: boolean;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
}

export interface OrderLineItem {
  productId: string;
  productName: string;
  productSlug: string;
  quantity: number;
  price: number;
  selectedVariants: Record<string, string>;
  image?: string;
}

export interface Order {
  id: string;
  customerId?: string;
  customerEmail: string;
  customerName: string;
  status: 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: 'stripe' | 'bkash';
  paymentStatus: 'pending' | 'paid' | 'refunded';
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  currency: string;
  promoCode?: string;
  items: OrderLineItem[];
  shippingAddress: Address;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

export interface TicketOrder {
  id: string;
  eventId: string;
  event: Event;
  tierSelections: { tierId: string; tierName: string; quantity: number; price: number }[];
  total: number;
  buyerName: string;
  buyerEmail: string;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Address {
  id: string;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  district: string;
  postalCode: string;
  isDefault?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatar?: string;
  addresses: Address[];
  wishlist: string[]; // product IDs
}

export interface BrandContent {
  id: 'nova' | 'live-the-moment' | 'x-force';
  name: string;
  tagline: string;
  heroImage: string;
  logoImage: string;
  description: string;
  story: { heading: string; body: string; image?: string }[];
  color: string;
}
