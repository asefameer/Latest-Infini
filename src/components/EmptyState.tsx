import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

const EmptyState = ({ icon, title, description, actionLabel, actionLink }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6 text-muted-foreground">
      {icon || <PackageOpen className="w-7 h-7" />}
    </div>
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
    {actionLabel && actionLink && (
      <Link
        to={actionLink}
        className="rounded-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        {actionLabel}
      </Link>
    )}
  </div>
);

export default EmptyState;
