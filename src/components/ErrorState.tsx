import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

const ErrorState = ({
  title = 'Something went wrong',
  message = "We couldn't load the data. Please try again.",
  onRetry,
  className = '',
}: ErrorStateProps) => (
  <div className={`flex flex-col items-center justify-center py-20 px-6 text-center ${className}`}>
    <div className="relative mb-6">
      <div
        className="absolute inset-0 rounded-full blur-xl opacity-20 pointer-events-none"
        style={{ background: 'hsl(var(--destructive))' }}
      />
      <div className="relative w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center text-destructive">
        <AlertTriangle className="w-7 h-7" />
      </div>
    </div>
    <h3 className="font-display text-xl font-semibold mb-2">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-sm mb-6">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 rounded-full px-6 py-2.5 text-sm font-medium bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </button>
    )}
  </div>
);

export default ErrorState;
