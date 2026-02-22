import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface Crumb {
  label: string;
  href?: string;
}

const Breadcrumbs = ({ items }: { items: Crumb[] }) => (
  <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-sm text-muted-foreground py-4">
    <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
    {items.map((crumb, i) => (
      <span key={i} className="flex items-center gap-1">
        <ChevronRight className="w-3.5 h-3.5" />
        {crumb.href ? (
          <Link to={crumb.href} className="hover:text-foreground transition-colors">{crumb.label}</Link>
        ) : (
          <span className="text-foreground">{crumb.label}</span>
        )}
      </span>
    ))}
  </nav>
);

export default Breadcrumbs;
