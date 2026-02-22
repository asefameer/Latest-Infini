import type { BrandContent } from '@/types';
import trinityNova from '@/assets/trinity-nova.jpg';
import trinityLtm from '@/assets/trinity-live-the-moment.jpg';
import trinityXforce from '@/assets/trinity-xforce.jpg';
import novaLogo from '@/assets/trinity-nova-logo.jpg';
import ltmLogo from '@/assets/trinity-ltm-logo.jpg';
import xforceLogo from '@/assets/trinity-xforce-logo.jpg';
import nova01 from '@/assets/nova-01.png';
import nova02 from '@/assets/nova-02.png';
import ltm01 from '@/assets/ltm-01.png';
import ltm02 from '@/assets/ltm-02.png';
import xforce01 from '@/assets/xforce-01.png';
import xforce02 from '@/assets/xforce-02.png';

export const brands: BrandContent[] = [
  {
    id: 'nova',
    name: 'NOVA',
    tagline: 'Light Beyond Limits',
    heroImage: trinityNova,
    logoImage: novaLogo,
    description: 'NOVA is the creative soul of Infinity. Born from the intersection of art and technology, NOVA represents the light that guides us beyond the familiar into the extraordinary.',
    story: [
      {
        heading: 'The Genesis',
        body: 'NOVA was born in the streets of Dhaka, where creativity pulses through every alley and rooftop. We saw a generation hungry for expression — not just through words, but through what they wear, where they gather, and how they move through the world.',
        image: nova01,
      },
      {
        heading: 'Design Philosophy',
        body: 'Every NOVA piece is a conversation between minimalism and rebellion. We strip away the unnecessary to reveal what matters: bold silhouettes, premium materials, and details that reward close attention. Our design language speaks in contrasts — light and shadow, structure and flow.',
        image: nova02,
      },
      {
        heading: 'The Community',
        body: 'NOVA is more than a brand — it\'s a collective. Our community of artists, musicians, and creators shape every collection through collaboration. When you wear NOVA, you carry the energy of a movement.',
      },
    ],
    color: 'var(--infinity-cyan)',
  },
  {
    id: 'live-the-moment',
    name: 'Live The Moment',
    tagline: 'Every Second Counts',
    heroImage: trinityLtm,
    logoImage: ltmLogo,
    description: 'Live The Moment captures the essence of presence. In a world of constant distraction, LTM creates spaces and pieces that anchor you in the now.',
    story: [
      {
        heading: 'The Philosophy',
        body: 'In Bangladesh\'s relentless pace, we found that the most powerful luxury is presence. Live The Moment was created to serve as a constant reminder: the most valuable thing you own is this moment.',
        image: ltm01,
      },
      {
        heading: 'Crafted for Experience',
        body: 'Every LTM product is designed to enhance real-world experiences. From festival-ready accessories to pieces that transition seamlessly from dawn yoga sessions to midnight conversations. Functionality meets feeling.',
        image: ltm02,
      },
      {
        heading: 'Moments That Matter',
        body: 'Our events are designed as catalysts for connection. Sunrise sessions, rooftop screenings, intimate gatherings — each one an invitation to be fully present with yourself and your community.',
      },
    ],
    color: 'var(--infinity-purple)',
  },
  {
    id: 'x-force',
    name: 'X-Force',
    tagline: 'Defy. Disrupt. Dominate.',
    heroImage: trinityXforce,
    logoImage: xforceLogo,
    description: 'X-Force channels raw energy into refined performance. Built for those who push boundaries — in sport, in style, in life.',
    story: [
      {
        heading: 'Built Different',
        body: 'X-Force was forged in the crucible of competition. We studied athletes, fighters, runners — anyone who refuses to accept limits. Then we built gear that matches their intensity without compromising on style.',
        image: xforce01,
      },
      {
        heading: 'Performance Meets Street',
        body: 'The line between athletic wear and street style has been erased. X-Force occupies this space with technical fabrics, engineered fits, and designs that perform whether you\'re in the gym or on the street.',
        image: xforce02,
      },
      {
        heading: 'The X-Force Movement',
        body: 'Our urban runs, fitness challenges, and community events bring together people who believe in pushing past comfortable. X-Force isn\'t just what you wear — it\'s how you show up.',
      },
    ],
    color: 'var(--infinity-pink)',
  },
];

export const getBrandById = (id: string) => brands.find(b => b.id === id);
