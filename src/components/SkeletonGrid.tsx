import { cn } from '@/lib/utils';

interface SkeletonGridProps {
  count?: number;
  type?: 'product' | 'event';
  className?: string;
}

const SkeletonGrid = ({ count = 8, type = 'product', className }: SkeletonGridProps) => (
  <div className={cn('grid gap-6', type === 'product' ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3', className)}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className={`rounded-xl bg-muted ${type === 'product' ? 'aspect-[3/4]' : 'aspect-[16/9]'} mb-3`} />
        <div className="h-3 bg-muted rounded w-1/3 mb-2" />
        <div className="h-4 bg-muted rounded w-2/3 mb-2" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
    ))}
  </div>
);

export default SkeletonGrid;
