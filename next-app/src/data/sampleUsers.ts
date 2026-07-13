import { User } from '../types';

// Emails match sampleOrders.ts so mock login has real order history to show.
export const sampleUsers: User[] = [
{
  id: 'u1',
  name: 'Ayesha Khan',
  email: 'ayesha.khan@example.com',
  phone: '0300-1234567',
  addresses: [
  {
    id: 'a1',
    label: 'Home',
    line1: 'House 12, Street 4, DHA Phase 5',
    city: 'Lahore',
    phone: '0300-1234567'
  }],

  wishlist: [],
  joinedDate: '2026-04-12'
},
{
  id: 'u2',
  name: 'Bilal Ahmed',
  email: 'bilal.ahmed@example.com',
  phone: '0311-9876543',
  addresses: [
  {
    id: 'a2',
    label: 'Home',
    line1: 'Flat 3B, Clifton Block 2',
    city: 'Karachi',
    phone: '0311-9876543'
  }],

  wishlist: [],
  joinedDate: '2026-02-03'
},
{
  id: 'u3',
  name: 'Sara Malik',
  email: 'sara.malik@example.com',
  phone: '0321-4567890',
  addresses: [
  {
    id: 'a3',
    label: 'Home',
    line1: 'B-45, Gulberg III',
    city: 'Lahore',
    phone: '0321-4567890'
  }],

  wishlist: [],
  joinedDate: '2026-01-20'
}];
