import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogInIcon, MailIcon, LockIcon } from 'lucide-react';
import { FormField } from '../../components/ui/FormField';
import { Button } from '../../components/ui/Button';
import { useAdminAuth } from '../../context/AdminAuthContext';

export function AdminLogin() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Enter your email and password.');
      return;
    }
    const ok = login(email);
    if (!ok) {
      setError('No admin account found with that email.');
      return;
    }
    navigate('/admin', { replace: true });
  };

  return (
    <div className="flex min-h-full w-full items-center justify-center bg-ink px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-0.5 font-display text-2xl font-extrabold text-white">
          Alwahab
          <span className="mb-3 h-2 w-2 rounded-full bg-accent" aria-hidden="true" />
          <span className="ml-1.5 text-sm font-medium text-white/50">Admin</span>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-6 shadow-card">

          <FormField
            label="Email Address"
            id="admin-email"
            type="email"
            placeholder="admin@alwahab.pk"
            leadingIcon={<MailIcon className="h-4 w-4" />}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error || undefined} />


          <FormField
            label="Password"
            id="admin-password"
            type="password"
            placeholder="••••••••"
            leadingIcon={<LockIcon className="h-4 w-4" />}
            value={password}
            onChange={(e) => setPassword(e.target.value)} />


          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            icon={<LogInIcon className="h-4 w-4" />}>

            Sign In
          </Button>
        </form>

        <p className="mt-4 rounded-xl bg-white/10 p-3 text-center text-xs text-white/70">
          Demo account: admin@alwahab.pk (any password).
        </p>
      </div>
    </div>);

}
