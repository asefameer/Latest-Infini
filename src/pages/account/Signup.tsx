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

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useCustomerAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await signup(name, email, password);
      navigate(resolveNext(location), { replace: true });
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHead title="Sign Up" description="Create your Infinity account." canonical="/account/signup" />
      <div className="container mx-auto px-6 py-20 max-w-md">
        <h1 className="font-display text-3xl font-bold tracking-tight mb-2">Create Account</h1>
        <p className="text-sm text-muted-foreground mb-8">Sign up to track orders and manage your account.</p>

        <form onSubmit={onSubmit} className="space-y-4 rounded-xl border border-border/30 bg-card/60 p-6">
          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm password</Label>
            <Input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Sign Up'}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account? <Link to="/account/login" className="text-primary hover:underline">Login</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Signup;
