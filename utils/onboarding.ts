import { normalizeContentSelection, type ContentCategoryId } from './contentCategories.ts';

export const ONBOARDING_SEEN_KEY = 'gnp-welcome-seen-v1';
export const INTERESTS_STORAGE_KEY = 'gnp-content-interests-v1';

export interface OnboardingRegistration {
  fullName: string;
  email: string;
  phoneNumber: string;
  interests: ContentCategoryId[];
  expressLoginRequested: boolean;
}

export function validateOnboardingRegistration(input: unknown): OnboardingRegistration {
  if (!input || typeof input !== 'object') throw new Error('Please complete the registration form.');
  const data = input as Record<string, unknown>;
  const fullName = typeof data.fullName === 'string' ? data.fullName.trim().replace(/\s+/g, ' ') : '';
  const email = typeof data.email === 'string' ? data.email.trim() : '';
  const phoneNumber = typeof data.phoneNumber === 'string' ? data.phoneNumber.replace(/[\s().-]/g, '') : '';
  const interests = normalizeContentSelection(data.interests);
  if (fullName.length < 2 || fullName.length > 120) throw new Error('Enter your full name (2–120 characters).');
  if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if (!/^\+?[0-9]{7,15}$/.test(phoneNumber)) throw new Error('Enter a valid phone number, including your country code where possible.');
  if (!interests.length) throw new Error('Choose at least one interest to continue.');
  return { fullName, email, phoneNumber, interests, expressLoginRequested: data.expressLoginRequested === true };
}
