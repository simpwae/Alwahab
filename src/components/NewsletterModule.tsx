import React, { useState } from 'react';
import { MailIcon, SendIcon } from 'lucide-react';
import { toast } from 'sonner';
import { FormField } from './ui/FormField';
import { Button } from './ui/Button';
function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
export function NewsletterModule() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setSubscribed(true);
    toast.success("You're in! 🎉", {
      description: 'Look out for exclusive deals in your inbox.'
    });
  };
  return (
    <section className="rounded-2xl bg-primary px-6 py-10 text-white sm:px-10">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <MailIcon className="h-6 w-6" />
        </div>
        <h2 className="font-display text-2xl font-bold sm:text-3xl">
          Get new arrivals &amp; exclusive deals first
        </h2>
        <p className="mt-2 text-sm text-primary-50">
          Join our list for early access to sales and new drops.
        </p>

        {subscribed ?
        <div
          className="mt-6 rounded-xl bg-white/15 px-6 py-4 font-medium"
          role="status">
          
            You're in! 🎉 Thanks for subscribing.
          </div> :

        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:items-start">
          
            <div className="flex-1 text-left">
              <label htmlFor="newsletter-email" className="sr-only">
                Email address
              </label>
              <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError('');
              }}
              placeholder="you@example.com"
              aria-invalid={!!error}
              aria-describedby={error ? 'newsletter-error' : undefined}
              className={`w-full rounded-xl border-2 bg-white px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-white/50 ${error ? 'border-red-400' : 'border-transparent'}`} />
            
              {error &&
            <p
              id="newsletter-error"
              className="mt-1.5 text-left text-xs font-medium text-amber-100">
              
                  {error}
                </p>
            }
            </div>
            <Button
            type="submit"
            variant="accent"
            size="md"
            icon={<SendIcon className="h-4 w-4" />}
            className="shrink-0">
            
              Subscribe
            </Button>
          </form>
        }
        <p className="mt-3 text-xs text-primary-50">No spam.</p>
      </div>
    </section>);

}