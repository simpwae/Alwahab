import { Admin } from '../types';

// Mock admin login only succeeds for this seeded email (any password), same
// pattern as sampleUsers.ts on the customer side.
export const sampleAdmins: Admin[] = [
{
  id: 'adm1',
  name: 'Store Admin',
  email: 'admin@alwahab.pk'
}];
