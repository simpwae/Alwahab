import { describe, it, expect } from 'vitest';
import { validateContact, ContactShippingValues } from './Checkout';

const VALID: ContactShippingValues = {
  fullName: 'Ayesha Khan',
  email: 'ayesha@example.com',
  phone: '0300-1234567',
  address: 'House 1, Street 2',
  city: 'Lahore'
};

describe('validateContact', () => {
  it('passes for fully valid values', () => {
    expect(validateContact(VALID)).toEqual({});
  });

  it('requires full name, address, and city', () => {
    const errors = validateContact({ ...VALID, fullName: '', address: '', city: '' });
    expect(errors.fullName).toBeTruthy();
    expect(errors.address).toBeTruthy();
    expect(errors.city).toBeTruthy();
  });

  it('rejects a malformed email', () => {
    const errors = validateContact({ ...VALID, email: 'not-an-email' });
    expect(errors.email).toBeTruthy();
  });

  it('rejects a too-short phone number', () => {
    const errors = validateContact({ ...VALID, phone: '123' });
    expect(errors.phone).toBeTruthy();
  });
});
