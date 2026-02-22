import type { Event } from '@/types';

export const events: Event[] = [
  {
    id: 'e-1', slug: 'nova-neon-nights', title: 'NOVA Neon Nights', brand: 'nova',
    date: '2026-04-15', time: '8:00 PM', venue: 'Infinity Arena', city: 'Dhaka',
    bannerImage: '/placeholder.svg',
    description: 'An immersive night of electronic music and light installations. Featuring international DJs and local talent in a venue transformed by neon art.',
    lineup: ['DJ Prism', 'Aether Collective', 'Frequency Lab', 'SYNA'],
    schedule: [{ time: '8:00 PM', activity: 'Gates Open' }, { time: '9:00 PM', activity: 'DJ Prism' }, { time: '10:30 PM', activity: 'Aether Collective' }, { time: '12:00 AM', activity: 'Frequency Lab (Headline)' }],
    ticketTiers: [
      { id: 't-1', name: 'General Admission', price: 2500, currency: 'BDT', description: 'Standard entry', remaining: 200, maxPerOrder: 4 },
      { id: 't-2', name: 'VIP', price: 5000, currency: 'BDT', description: 'Priority entry + lounge access', remaining: 50, maxPerOrder: 2 },
      { id: 't-3', name: 'Backstage Pass', price: 12000, currency: 'BDT', description: 'Full backstage + meet & greet', remaining: 10, maxPerOrder: 1 },
    ],
    faq: [
      { question: 'What is the age requirement?', answer: 'This event is 18+. Valid ID required at entry.' },
      { question: 'Can I get a refund?', answer: 'Tickets are non-refundable but transferable up to 48 hours before the event.' },
      { question: 'Is there parking?', answer: 'Limited parking available. We recommend ride-sharing.' },
    ],
    isFeatured: true,
  },
  {
    id: 'e-2', slug: 'ltm-sunrise-session', title: 'Sunrise Session', brand: 'live-the-moment',
    date: '2026-03-22', time: '5:30 AM', venue: 'Patenga Beach', city: 'Chittagong',
    bannerImage: '/placeholder.svg',
    description: 'A dawn yoga and acoustic music session on the beach. Start your day with intention.',
    schedule: [{ time: '5:30 AM', activity: 'Arrival & Setup' }, { time: '6:00 AM', activity: 'Sunrise Yoga' }, { time: '7:30 AM', activity: 'Acoustic Set by Tidal' }, { time: '8:30 AM', activity: 'Community Breakfast' }],
    ticketTiers: [
      { id: 't-4', name: 'Early Bird', price: 1200, currency: 'BDT', description: 'Includes yoga mat & breakfast', remaining: 80, maxPerOrder: 4 },
      { id: 't-5', name: 'Premium', price: 2500, currency: 'BDT', description: 'Front row + wellness kit', remaining: 20, maxPerOrder: 2 },
    ],
    faq: [
      { question: 'Do I need to bring a yoga mat?', answer: 'No, mats are provided with your ticket.' },
      { question: 'What if it rains?', answer: 'The event will be rescheduled. All tickets remain valid.' },
    ],
    isFeatured: true,
  },
  {
    id: 'e-3', slug: 'xforce-urban-run', title: 'X-Force Urban Run', brand: 'x-force',
    date: '2026-05-10', time: '6:00 AM', venue: 'Hatirjheel', city: 'Dhaka',
    bannerImage: '/placeholder.svg',
    description: 'A 10K urban obstacle run through the city. Test your limits with the X-Force community.',
    ticketTiers: [
      { id: 't-6', name: 'Runner', price: 1500, currency: 'BDT', description: 'Entry + finisher medal + tee', remaining: 500, maxPerOrder: 4 },
      { id: 't-7', name: 'Elite Runner', price: 3000, currency: 'BDT', description: 'Timed entry + exclusive kit', remaining: 100, maxPerOrder: 2 },
    ],
    faq: [
      { question: 'Is this suitable for beginners?', answer: 'Yes! All fitness levels are welcome.' },
    ],
  },
  {
    id: 'e-4', slug: 'nova-gallery-opening', title: 'NOVA Gallery: Infinite Perspectives', brand: 'nova',
    date: '2026-06-01', time: '7:00 PM', venue: 'Bengal Gallery', city: 'Dhaka',
    bannerImage: '/placeholder.svg',
    description: 'A curated exhibition of digital art and immersive installations exploring the concept of infinity.',
    ticketTiers: [
      { id: 't-8', name: 'Gallery Entry', price: 800, currency: 'BDT', description: 'Exhibition access', remaining: 300, maxPerOrder: 6 },
      { id: 't-9', name: 'Collector Preview', price: 3500, currency: 'BDT', description: 'Early access + catalogue + wine', remaining: 30, maxPerOrder: 2 },
    ],
    faq: [
      { question: 'How long is the exhibition?', answer: 'The exhibition runs for 3 weeks. Your ticket is valid for one entry.' },
    ],
  },
  {
    id: 'e-5', slug: 'ltm-rooftop-cinema', title: 'Rooftop Cinema Night', brand: 'live-the-moment',
    date: '2026-04-28', time: '7:30 PM', venue: 'Sky Lounge, Banani', city: 'Dhaka',
    bannerImage: '/placeholder.svg',
    description: 'An open-air cinema experience under the stars. Curated film screening with gourmet food trucks.',
    ticketTiers: [
      { id: 't-10', name: 'Standard', price: 1500, currency: 'BDT', description: 'Entry + popcorn', remaining: 100, maxPerOrder: 4 },
      { id: 't-11', name: 'Couple', price: 2500, currency: 'BDT', description: 'Two seats + sharing platter', remaining: 30, maxPerOrder: 2 },
    ],
    faq: [
      { question: 'What film is being screened?', answer: 'Film title will be announced 1 week before the event.' },
    ],
  },
];

export const getEventBySlug = (slug: string) => events.find(e => e.slug === slug);
export const getEventsByBrand = (brand: string) => events.filter(e => e.brand === brand);
export const getFeaturedEvents = () => events.filter(e => e.isFeatured);
