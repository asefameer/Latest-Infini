import { useState } from 'react';
import { Send } from 'lucide-react';
import MagneticButton from '@/components/MagneticButton';

interface NewsletterModuleProps {
  variant?: 'section' | 'inline';
}

const NewsletterModule = ({ variant = 'section' }: NewsletterModuleProps) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) setSubmitted(true);
  };

  if (variant === 'inline') {
    return (
      <div className="flex flex-col md:flex-row md:items-center gap-6">
        <div className="flex-1">
          <h4 className="font-display font-semibold text-lg mb-1">Stay in the loop</h4>
          <p className="text-sm text-muted-foreground">Drops, events, and stories — straight to your inbox.</p>
        </div>
        {submitted ? (
          <p className="text-sm text-primary font-medium">You're in. Welcome to Infinity.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 md:w-64 rounded-full bg-muted/50 border border-border/40 px-5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <MagneticButton strength={0.2}>
              <button
                type="submit"
                className="rounded-full px-5 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Join
              </button>
            </MagneticButton>
          </form>
        )}
      </div>
    );
  }

  return (
    <section
      className="relative py-20 px-6 overflow-hidden"
      style={{ background: 'hsl(var(--section-light))' }}
    >
      {/* Ambient glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full blur-[150px] opacity-10 pointer-events-none"
        style={{ background: 'hsl(var(--infinity-pink))' }}
      />

      <div className="container mx-auto text-center max-w-xl relative z-10">
        <h3 className="font-display text-3xl md:text-4xl font-bold tracking-tight mb-4">Join the Movement</h3>
        <p className="text-muted-foreground mb-8">Be the first to know about new drops, exclusive events, and stories from the Infinity universe.</p>
        {submitted ? (
          <p className="text-primary font-medium text-lg">Welcome to Infinity. Check your inbox.</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 rounded-full bg-muted/50 border border-border/40 px-6 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <MagneticButton strength={0.2}>
              <button
                type="submit"
                className="rounded-full px-8 py-3 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
              >
                Subscribe
              </button>
            </MagneticButton>
          </form>
        )}
      </div>
    </section>
  );
};

export default NewsletterModule;
