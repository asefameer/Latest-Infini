import { PackageOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import MagneticButton from '@/components/MagneticButton';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionLink?: string;
}

const EmptyState = ({ icon, title, description, actionLabel, actionLink }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="relative mb-6">
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
        style={{ background: 'linear-gradient(135deg, hsl(var(--infinity-cyan)), hsl(var(--infinity-purple)))' }}
      />
      <div className="relative w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground">
        {icon || <PackageOpen className="w-7 h-7" />}
      </div>
    </div>
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-sm mb-6">{description}</p>
    {actionLabel && actionLink && (
      <MagneticButton strength={0.2}>
        <Link
          to={actionLink}
          className="rounded-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
        >
          {actionLabel}
        </Link>
      </MagneticButton>
    )}
  </div>
);

export default EmptyState;
