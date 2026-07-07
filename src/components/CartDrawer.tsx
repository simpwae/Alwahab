import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MinusIcon,
  PlusIcon,
  ShoppingBagIcon,
  XIcon,
  TrashIcon } from
'lucide-react';
import { useCart } from '../context/CartContext';
import { Button } from './ui/Button';
import { EmptyState } from './states/EmptyState';
const PKR = new Intl.NumberFormat('en-PK', {
  maximumFractionDigits: 0
});
export function CartDrawer() {
  const { isOpen, closeCart, lines, updateQty, removeFromCart, subtotal } =
  useCart();
  const navigate = useNavigate();
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          className="fixed inset-0 z-40 bg-ink/40"
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          onClick={closeCart}
          aria-hidden="true" />
        
          <motion.aside
          role="dialog"
          aria-modal="true"
          aria-label="Shopping cart"
          className="fixed right-0 top-0 z-50 flex h-full w-full max-w-sm flex-col bg-white shadow-2xl"
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            stiffness: 320,
            damping: 34
          }}>
          
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h2 className="font-display text-lg font-semibold text-ink">
                Your Cart ({lines.length})
              </h2>
              <button
              onClick={closeCart}
              aria-label="Close cart"
              className="flex h-9 w-9 items-center justify-center rounded-full text-ink-muted transition-colors hover:bg-gray-100">
              
                <XIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ?
            <EmptyState
              icon={<ShoppingBagIcon className="h-8 w-8" />}
              title="Your cart is empty"
              description="Looks like you haven't added anything yet. Start exploring our latest deals."
              actionLabel="Continue Shopping"
              onAction={closeCart} /> :


            <ul className="space-y-4">
                  {lines.map((line) =>
              <li key={line.productId} className="flex gap-3">
                      <img
                  src={line.image}
                  alt={line.name}
                  className="h-20 w-20 shrink-0 rounded-xl border border-gray-100 object-cover" />
                
                      <div className="flex flex-1 flex-col">
                        <p className="line-clamp-2 text-sm font-medium text-ink">
                          {line.name}
                        </p>
                        <span className="mt-1 text-sm font-semibold text-ink">
                          PKR {PKR.format(line.price)}
                        </span>
                        <div className="mt-auto flex items-center justify-between">
                          <div className="flex items-center rounded-lg border border-gray-200">
                            <button
                        aria-label={`Decrease quantity of ${line.name}`}
                        onClick={() =>
                        updateQty(line.productId, line.qty - 1)
                        }
                        disabled={line.qty <= 1}
                        className="flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40">
                        
                              <MinusIcon className="h-3.5 w-3.5" />
                            </button>
                            <span className="w-6 text-center text-sm font-medium">
                              {line.qty}
                            </span>
                            <button
                        aria-label={`Increase quantity of ${line.name}`}
                        onClick={() =>
                        updateQty(line.productId, line.qty + 1)
                        }
                        className="flex h-7 w-7 items-center justify-center text-ink-muted hover:text-ink">
                        
                              <PlusIcon className="h-3.5 w-3.5" />
                            </button>
                          </div>
                          <button
                      aria-label={`Remove ${line.name} from cart`}
                      onClick={() => removeFromCart(line.productId)}
                      className="flex h-7 w-7 items-center justify-center text-ink-muted hover:text-red-600">
                      
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
              )}
                </ul>
            }
            </div>

            {lines.length > 0 &&
          <div className="border-t border-gray-100 px-5 py-4">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-ink-muted">Subtotal</span>
                  <span className="font-display text-lg font-bold text-ink">
                    PKR {PKR.format(subtotal)}
                  </span>
                </div>
                <Button
              variant="primary"
              size="lg"
              fullWidth
              onClick={() => {
                closeCart();
                navigate('/cart');
              }}>
              
                  Checkout
                </Button>
                <button
              onClick={closeCart}
              className="mt-2 w-full py-1 text-center text-sm font-medium text-ink-muted hover:text-primary">
              
                  Continue Shopping
                </button>
              </div>
          }
          </motion.aside>
        </>
      }
    </AnimatePresence>);

}