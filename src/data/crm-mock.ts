// CRM Mock Data

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  segment: 'vip' | 'regular' | 'new' | 'inactive';
  totalSpent: number;
  orderCount: number;
  lastActive: string;
  joinedAt: string;
  tags: string[];
  notes: string;
}

export interface ChatConversation {
  id: string;
  customerId: string;
  customerName: string;
  status: 'open' | 'resolved' | 'escalated';
  startedAt: string;
  lastMessageAt: string;
  messages: ChatMessage[];
}

export interface ChatMessage {
  id: string;
  role: 'customer' | 'bot' | 'agent';
  content: string;
  timestamp: string;
}

export interface KBArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  isPublished: boolean;
  updatedAt: string;
}

export interface EmailCampaign {
  id: string;
  name: string;
  subject: string;
  status: 'draft' | 'scheduled' | 'sent';
  segment: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
  openRate?: number;
  clickRate?: number;
}

export interface PushNotification {
  id: string;
  title: string;
  body: string;
  status: 'draft' | 'scheduled' | 'sent';
  segment: string;
  scheduledAt?: string;
  sentAt?: string;
  recipientCount: number;
}

export const mockCustomers: Customer[] = [
  { id: 'c1', name: 'Aya Nakamura', email: 'aya@example.com', phone: '+33 6 12 34 56 78', segment: 'vip', totalSpent: 4250, orderCount: 12, lastActive: '2026-02-23', joinedAt: '2024-06-15', tags: ['nova-fan', 'event-goer'], notes: 'Prefers limited editions.' },
  { id: 'c2', name: 'Marcus Chen', email: 'marcus@example.com', phone: '+1 555 234 5678', segment: 'regular', totalSpent: 980, orderCount: 4, lastActive: '2026-02-20', joinedAt: '2025-01-10', tags: ['xforce-fan'], notes: '' },
  { id: 'c3', name: 'Léa Dupont', email: 'lea@example.com', phone: '+33 7 98 76 54 32', segment: 'new', totalSpent: 120, orderCount: 1, lastActive: '2026-02-22', joinedAt: '2026-02-01', tags: ['ltm-fan'], notes: 'Signed up via encounter event.' },
  { id: 'c4', name: 'James Okafor', email: 'james@example.com', phone: '+44 7700 900123', segment: 'inactive', totalSpent: 560, orderCount: 3, lastActive: '2025-10-05', joinedAt: '2024-09-20', tags: [], notes: 'Hasn\'t returned in months.' },
  { id: 'c5', name: 'Sofia Reyes', email: 'sofia@example.com', phone: '+34 612 345 678', segment: 'vip', totalSpent: 6100, orderCount: 18, lastActive: '2026-02-24', joinedAt: '2024-03-01', tags: ['nova-fan', 'event-goer', 'ambassador'], notes: 'Brand ambassador candidate.' },
  { id: 'c6', name: 'Kenji Tanaka', email: 'kenji@example.com', phone: '+81 90 1234 5678', segment: 'regular', totalSpent: 740, orderCount: 5, lastActive: '2026-02-18', joinedAt: '2025-04-12', tags: ['xforce-fan'], notes: '' },
];

export const mockConversations: ChatConversation[] = [
  {
    id: 'conv1', customerId: 'c1', customerName: 'Aya Nakamura', status: 'resolved', startedAt: '2026-02-23T14:00:00Z', lastMessageAt: '2026-02-23T14:12:00Z',
    messages: [
      { id: 'm1', role: 'customer', content: 'Hi, when does the Nova Spring drop?', timestamp: '2026-02-23T14:00:00Z' },
      { id: 'm2', role: 'bot', content: 'The Nova Spring collection launches March 15! Would you like me to notify you?', timestamp: '2026-02-23T14:00:05Z' },
      { id: 'm3', role: 'customer', content: 'Yes please!', timestamp: '2026-02-23T14:01:00Z' },
      { id: 'm4', role: 'bot', content: 'Done! You\'ll receive an email on launch day. Anything else?', timestamp: '2026-02-23T14:01:03Z' },
      { id: 'm5', role: 'customer', content: 'No, thanks!', timestamp: '2026-02-23T14:12:00Z' },
    ],
  },
  {
    id: 'conv2', customerId: 'c2', customerName: 'Marcus Chen', status: 'open', startedAt: '2026-02-24T09:30:00Z', lastMessageAt: '2026-02-24T09:35:00Z',
    messages: [
      { id: 'm6', role: 'customer', content: 'I need to return my X-Force hoodie, it\'s the wrong size.', timestamp: '2026-02-24T09:30:00Z' },
      { id: 'm7', role: 'bot', content: 'I\'m sorry about that! Could you share your order number so I can help?', timestamp: '2026-02-24T09:30:04Z' },
      { id: 'm8', role: 'customer', content: 'Order #ORD-2026-0045', timestamp: '2026-02-24T09:32:00Z' },
      { id: 'm9', role: 'bot', content: 'I\'ve found your order. Let me connect you with an agent for the return process.', timestamp: '2026-02-24T09:32:06Z' },
      { id: 'm10', role: 'agent', content: 'Hi Marcus! I\'ll process your return right away. Which size do you need?', timestamp: '2026-02-24T09:35:00Z' },
    ],
  },
  {
    id: 'conv3', customerId: 'c3', customerName: 'Léa Dupont', status: 'escalated', startedAt: '2026-02-22T16:00:00Z', lastMessageAt: '2026-02-22T16:20:00Z',
    messages: [
      { id: 'm11', role: 'customer', content: 'My ticket for the LTM Paris event isn\'t showing in my account.', timestamp: '2026-02-22T16:00:00Z' },
      { id: 'm12', role: 'bot', content: 'Let me check that for you. What email did you use to purchase?', timestamp: '2026-02-22T16:00:05Z' },
      { id: 'm13', role: 'customer', content: 'lea@example.com', timestamp: '2026-02-22T16:01:00Z' },
      { id: 'm14', role: 'bot', content: 'I can\'t find a ticket under that email. This needs human review — escalating now.', timestamp: '2026-02-22T16:01:08Z' },
    ],
  },
];

export const mockKBArticles: KBArticle[] = [
  { id: 'kb1', title: 'Shipping & Delivery Information', category: 'Orders', content: 'We ship worldwide. Standard delivery takes 5-7 business days. Express delivery is available in select countries for 2-3 business days.', isPublished: true, updatedAt: '2026-02-20' },
  { id: 'kb2', title: 'Return & Exchange Policy', category: 'Orders', content: 'Items can be returned within 30 days of delivery. Items must be unworn with tags attached. Exchanges are subject to availability.', isPublished: true, updatedAt: '2026-02-18' },
  { id: 'kb3', title: 'Event Ticket Cancellation', category: 'Events', content: 'Tickets can be cancelled up to 48 hours before the event for a full refund. Within 48 hours, a 50% refund applies.', isPublished: true, updatedAt: '2026-02-15' },
  { id: 'kb4', title: 'Size Guide', category: 'Products', content: 'Our sizing follows EU standards. Please refer to the size chart on each product page for specific measurements.', isPublished: true, updatedAt: '2026-02-10' },
  { id: 'kb5', title: 'Loyalty Program (Draft)', category: 'General', content: 'Earn points with every purchase. VIP members get early access and exclusive discounts.', isPublished: false, updatedAt: '2026-02-22' },
];

export const mockEmailCampaigns: EmailCampaign[] = [
  { id: 'em1', name: 'Nova Spring Launch', subject: '🔥 Nova Spring is HERE', status: 'sent', segment: 'nova-fan', sentAt: '2026-02-15', recipientCount: 2450, openRate: 42.3, clickRate: 18.7 },
  { id: 'em2', name: 'VIP Early Access', subject: 'Exclusive: Early Access for VIPs', status: 'scheduled', segment: 'vip', scheduledAt: '2026-03-01', recipientCount: 890 },
  { id: 'em3', name: 'Win-back Inactive Users', subject: 'We miss you! Here\'s 20% off', status: 'draft', segment: 'inactive', recipientCount: 340 },
  { id: 'em4', name: 'X-Force Drop Teaser', subject: 'Something BIG is coming...', status: 'sent', segment: 'xforce-fan', sentAt: '2026-02-10', recipientCount: 1800, openRate: 38.1, clickRate: 12.4 },
];

export const mockPushNotifications: PushNotification[] = [
  { id: 'pn1', title: 'Flash Sale Live!', body: '50% off selected items for the next 4 hours.', status: 'sent', segment: 'all', sentAt: '2026-02-20', recipientCount: 5200 },
  { id: 'pn2', title: 'Your tickets are ready', body: 'Download your LTM Paris tickets now.', status: 'sent', segment: 'event-goer', sentAt: '2026-02-21', recipientCount: 310 },
  { id: 'pn3', title: 'New X-Force arrivals', body: 'Check out the latest X-Force collection.', status: 'scheduled', segment: 'xforce-fan', scheduledAt: '2026-03-05', recipientCount: 1800 },
];
