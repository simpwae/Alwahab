import { redirect } from 'next/navigation';

// The wishlist lives at /account/wishlist (inside AccountLayout, behind
// ProtectedRoute). This alias exists so the short URL works wherever it gets
// shared, and so the header icon can point at the obvious path.
export default function WishlistPage() {
  redirect('/account/wishlist');
}
