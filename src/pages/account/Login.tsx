import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import SEOHead from '@/components/SEOHead';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useCustomerAuth } from '@/contexts/CustomerAuthContext';

function resolveNext(location: ReturnType<typeof useLocation>) {
  const params = new URLSearchParams(location.search);
  return params.get('next') || '/account';
}

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate(resolveNext(location), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Login" description="Login to your Infinity account." canonical="/account/login" />
      <div className="container mx-auto px-6 py-20 max-w-md">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Login</h1>
        <p className="text-sm text-muted-foreground mb-8">Access your orders, addresses, and wishlist.</p>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/30 bg-card/60 p-6">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in…' : 'Login'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account? <Link to="/account/signup" className="text-primary hover:underline">Sign up</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
