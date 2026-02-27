import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import NewsletterModule from '@/components/blocks/NewsletterModule';
import { useSiteContent, contentToMap, useNavigationItems } from '@/hooks/use-cms';

const socialIcons: Record<string, React.ElementType> = {
  Instagram, Facebook, Twitter, Youtube,
};

const Footer = () => {
  const { data: contentRows } = useSiteContent('footer');
  const { data: footerLinks } = useNavigationItems('footer');
  const { data: socialLinks } = useNavigationItems('footer_social');
  const cm = contentRows ? contentToMap(contentRows) : {};
  const t = cm['footer'] ?? {};

  return (
    <footer className="border-t border-border/30" style={{ background: 'hsl(var(--section-mid))' }}>
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div className="lg:col-span-2">
            <h3 className="font-display text-2xl font-bold tracking-tight mb-3">
              {t['brand_name'] ?? 'INFINITY'}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t['brand_description'] ?? 'A premium Bangladesh-born platform at the intersection of style, experience, and community.'}
            </p>
            <div className="flex items-center gap-4 mt-6">
              {(socialLinks && socialLinks.length > 0 ? socialLinks : [
                { id: '1', label: 'Instagram', href: '#' },
                { id: '2', label: 'Facebook', href: '#' },
                { id: '3', label: 'Twitter', href: '#' },
                { id: '4', label: 'Youtube', href: '#' },
              ]).map((link) => {
                const Icon = socialIcons[link.label] ?? Instagram;
                return (
                  <a
                    key={link.id}
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors"
                    aria-label={link.label}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Shop — static for now */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Shop</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/editions" className="hover:text-foreground transition-colors">All Editions</Link></li>
              <li><Link to="/editions/c/apparel" className="hover:text-foreground transition-colors">Apparel</Link></li>
              <li><Link to="/editions/c/accessories" className="hover:text-foreground transition-colors">Accessories</Link></li>
              <li><Link to="/editions/c/footwear" className="hover:text-foreground transition-colors">Footwear</Link></li>
              <li><Link to="/editions/c/limited-drops" className="hover:text-foreground transition-colors">Limited Drops</Link></li>
            </ul>
          </div>

          {/* Experience — CMS driven */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Experience</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {(footerLinks && footerLinks.length > 0 ? footerLinks : [
                { id: '1', label: 'The Trinity', href: '/the-trinity' },
                { id: '2', label: 'NOVA', href: '/the-trinity/nova' },
                { id: '3', label: 'Live The Moment', href: '/the-trinity/live-the-moment' },
                { id: '4', label: 'X-Force', href: '/the-trinity/x-force' },
                { id: '5', label: 'Encounter', href: '/encounter' },
              ]).map((link) => (
                <li key={link.id}>
                  <Link to={link.href} className="hover:text-foreground transition-colors">{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Support</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link to="/account" className="hover:text-foreground transition-colors">My Account</Link></li>
              <li><Link to="/account/orders" className="hover:text-foreground transition-colors">Order Tracking</Link></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Shipping & Returns</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-border/30 pt-12 mb-12">
          <NewsletterModule variant="inline" />
        </div>

        {/* Copyright */}
        <div className="border-t border-border/30 pt-6 text-center text-xs text-muted-foreground">
          {t['copyright'] ?? `© ${new Date().getFullYear()} Infinity. All rights reserved. Made in Bangladesh.`}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
