import React, { useEffect, useMemo, useState, useRef, Component } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchIcon,
  UserIcon,
  HeartIcon,
  ShoppingCartIcon,
  ChevronDownIcon,
  MenuIcon,
  XIcon,
  FlameIcon } from
'lucide-react';
import { Logo } from './Logo';
import { useCart } from '../../context/CartContext';
import { sampleProducts } from '../../data/sampleProducts';
const CATEGORY_LINKS = [
{
  label: 'Electronics',
  href: '/category/electronics'
},
{
  label: 'Accessories',
  href: '/category/accessories'
},
{
  label: 'Home & Kitchen',
  href: '/category/home-kitchen'
},
{
  label: 'Gadgets',
  href: '/category/gadgets'
}];

const MEGA_MENU_GROUPS = [
{
  title: 'Electronics',
  items: ['Headphones', 'Speakers', 'Smartwatches', 'Chargers & Cables']
},
{
  title: 'Home & Kitchen',
  items: ['Cookware', 'Storage', 'Small Appliances', 'Décor']
},
{
  title: 'Accessories',
  items: ['Wallets & Bags', 'Sunglasses', 'Belts', 'Jewelry']
},
{
  title: 'Lifestyle & Gadgets',
  items: ['Fitness', 'Travel', 'Home Office', 'Smart Gadgets']
}];

function useSearchBox() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return sampleProducts.
    filter(
      (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    ).
    slice(0, 5);
  }, [query]);
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };
  return {
    navigate,
    query,
    setQuery,
    showSuggestions,
    setShowSuggestions,
    searchRef,
    suggestions,
    submitSearch
  };
}
export function Header() {
  const { itemCount, openCart } = useCart();
  const [wishlistCount] = useState(2);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {
    query,
    setQuery,
    showSuggestions,
    setShowSuggestions,
    searchRef,
    suggestions,
    submitSearch,
    navigate
  } = useSearchBox();
  return (
    <header className="sticky top-0 z-30 w-full border-b border-gray-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-xl text-ink lg:hidden"
          aria-label="Open menu"
          onClick={() => setMobileMenuOpen(true)}>
          
          <MenuIcon className="h-6 w-6" />
        </button>

        <Logo className="shrink-0" />

        <form
          ref={searchRef}
          onSubmit={submitSearch}
          className="relative hidden flex-1 md:block">
          
          <label htmlFor="site-search" className="sr-only">
            Search products
          </label>
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            id="site-search"
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Search electronics, accessories, home…"
            className="w-full rounded-xl border border-gray-200 bg-surface py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
          
          <AnimatePresence>
            {showSuggestions && suggestions.length > 0 &&
            <motion.ul
              initial={{
                opacity: 0,
                y: -6
              }}
              animate={{
                opacity: 1,
                y: 0
              }}
              exit={{
                opacity: 0,
                y: -6
              }}
              transition={{
                duration: 0.15
              }}
              className="absolute left-0 right-0 top-full z-40 mt-2 overflow-hidden rounded-xl border border-gray-100 bg-white shadow-card">
              
                {suggestions.map((product) =>
              <li key={product.id}>
                    <Link
                  to={`/product/${product.id}`}
                  onClick={() => setShowSuggestions(false)}
                  className="flex items-center gap-3 px-3.5 py-2.5 text-sm transition-colors hover:bg-surface">
                  
                      <img
                    src={product.images[0]}
                    alt=""
                    className="h-10 w-10 rounded-lg object-cover" />
                  
                      <span className="flex-1">
                        <span className="line-clamp-1 font-medium text-ink">
                          {product.name}
                        </span>
                        <span className="text-xs text-ink-muted">
                          {product.category}
                        </span>
                      </span>
                    </Link>
                  </li>
              )}
                <li>
                  <button
                  type="submit"
                  className="flex w-full items-center gap-2 border-t border-gray-100 px-3.5 py-2.5 text-left text-sm font-medium text-primary hover:bg-surface">
                  
                    <SearchIcon className="h-3.5 w-3.5" />
                    See all results for &ldquo;{query}&rdquo;
                  </button>
                </li>
              </motion.ul>
            }
          </AnimatePresence>
        </form>

        <nav className="ml-auto flex items-center gap-1 sm:gap-2">
          <Link
            to="/account"
            className="flex flex-col items-center rounded-xl px-2.5 py-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-primary"
            aria-label="Account">
            
            <UserIcon className="h-5 w-5" />
            <span className="hidden text-[11px] sm:block">Account</span>
          </Link>
          <Link
            to="/account/wishlist"
            className="relative flex flex-col items-center rounded-xl px-2.5 py-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-primary"
            aria-label={`Wishlist, ${wishlistCount} items`}>
            
            <HeartIcon className="h-5 w-5" />
            <span className="hidden text-[11px] sm:block">Wishlist</span>
            {wishlistCount > 0 &&
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {wishlistCount}
              </span>
            }
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative flex flex-col items-center rounded-xl px-2.5 py-1.5 text-ink-muted transition-colors hover:bg-surface hover:text-primary"
            aria-label={`Cart, ${itemCount} items`}>
            
            <ShoppingCartIcon className="h-5 w-5" />
            <span className="hidden text-[11px] sm:block">Cart</span>
            {itemCount > 0 &&
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
                {itemCount}
              </span>
            }
          </button>
        </nav>
      </div>

      {/* Mobile search */}
      <div className="px-4 pb-3 md:hidden">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (query.trim())
            navigate(`/search?q=${encodeURIComponent(query.trim())}`);
          }}
          className="relative">
          
          <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search electronics, accessories, home…"
            className="w-full rounded-xl border border-gray-200 bg-surface py-2.5 pl-10 pr-4 text-sm placeholder:text-ink-muted focus:border-primary focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20" />
          
        </form>
      </div>

      {/* Category nav row */}
      <div className="hidden border-t border-gray-100 lg:block">
        <div className="mx-auto flex max-w-7xl items-center gap-6 px-4 py-2.5 sm:px-6 lg:px-8">
          <div
            className="relative"
            onMouseEnter={() => setMegaMenuOpen(true)}
            onMouseLeave={() => setMegaMenuOpen(false)}>
            
            <button
              type="button"
              className="flex items-center gap-1 text-sm font-medium text-ink transition-colors hover:text-primary"
              aria-expanded={megaMenuOpen}>
              
              <MenuIcon className="h-4 w-4" />
              All Categories
              <ChevronDownIcon className="h-3.5 w-3.5" />
            </button>
            <AnimatePresence>
              {megaMenuOpen &&
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8
                }}
                animate={{
                  opacity: 1,
                  y: 0
                }}
                exit={{
                  opacity: 0,
                  y: -8
                }}
                transition={{
                  duration: 0.15
                }}
                className="absolute left-0 top-full z-40 mt-2 grid w-[640px] grid-cols-4 gap-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-card">
                
                  {MEGA_MENU_GROUPS.map((group) =>
                <div key={group.title}>
                      <h4 className="mb-2.5 font-display text-sm font-semibold text-ink">
                        {group.title}
                      </h4>
                      <ul className="space-y-2">
                        {group.items.map((item) =>
                    <li key={item}>
                            <Link
                        to="/category/all"
                        className="text-sm text-ink-muted transition-colors hover:text-primary">
                        
                              {item}
                            </Link>
                          </li>
                    )}
                      </ul>
                    </div>
                )}
                </motion.div>
              }
            </AnimatePresence>
          </div>

          {CATEGORY_LINKS.map((link) =>
          <Link
            key={link.label}
            to={link.href}
            className="text-sm font-medium text-ink transition-colors hover:text-primary">
            
              {link.label}
            </Link>
          )}
          <Link
            to="/deals"
            className="flex items-center gap-1 text-sm font-medium text-accent-dark transition-colors hover:text-accent">
            
            Deals <FlameIcon className="h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Mobile menu drawer */}
      <AnimatePresence>
        {mobileMenuOpen &&
        <>
            <motion.div
            className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setMobileMenuOpen(false)} />
          
            <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Mobile menu"
            className="fixed left-0 top-0 z-50 h-full w-72 bg-white p-5 shadow-2xl lg:hidden"
            initial={{
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            transition={{
              type: 'spring',
              stiffness: 320,
              damping: 34
            }}>
            
              <div className="flex items-center justify-between">
                <Logo />
                <button
                aria-label="Close menu"
                onClick={() => setMobileMenuOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100">
                
                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="mt-6 flex flex-col gap-1">
                {[
              {
                label: 'All Categories',
                href: '/category/all'
              },
              ...CATEGORY_LINKS,
              {
                label: 'Deals 🔥',
                href: '/deals'
              }].
              map((link) =>
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink hover:bg-surface">
                
                    {link.label}
                  </Link>
              )}
              </nav>
            </motion.div>
          </>
        }
      </AnimatePresence>
    </header>);

}