import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';
import NewsletterModule from '@/components/blocks/NewsletterModule';

const Footer = () => (
  <footer className="border-t border-border/30 bg-background">
    <div className="container mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
        {/* Brand */}
        <div className="lg:col-span-2">
          <h3 className="font-display text-2xl font-bold tracking-tight mb-3">INFINITY</h3>
          <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
            A premium Bangladesh-born platform at the intersection of style, experience, and community.
          </p>
          <div className="flex items-center gap-4 mt-6">
            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
              <a key={i} href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Social link">
                <Icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
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

        {/* Experience */}
        <div>
          <h4 className="font-display font-semibold text-sm uppercase tracking-wider mb-4">Experience</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/the-trinity" className="hover:text-foreground transition-colors">The Trinity</Link></li>
            <li><Link to="/the-trinity/nova" className="hover:text-foreground transition-colors">NOVA</Link></li>
            <li><Link to="/the-trinity/live-the-moment" className="hover:text-foreground transition-colors">Live The Moment</Link></li>
            <li><Link to="/the-trinity/x-force" className="hover:text-foreground transition-colors">X-Force</Link></li>
            <li><Link to="/encounter" className="hover:text-foreground transition-colors">Encounter</Link></li>
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
        © {new Date().getFullYear()} Infinity. All rights reserved. Made in Bangladesh.
      </div>
    </div>
  </footer>
);

export default Footer;
