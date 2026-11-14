import { createError, defineEventHandler, readBody } from 'h3';
import { validateOnboardingRegistration } from '~/utils/onboarding';
import type { BaseApiResponse, SigninResponseModel } from '~/models';

/** Adapter to the identity backend. Never creates a local or simulated identity. */
export default defineEventHandler(async (event) => {
  let payload;
  try {
    payload = validateOnboardingRegistration(await readBody(event));
  } catch (error) {
    throw createError({ statusCode: 400, statusMessage: error instanceof Error ? error.message : 'Invalid registration details.' });
  }
  const config = useRuntimeConfig(event);
  const endpoint = config.onboardingRegistrationUrl;
  if (!endpoint) {
    throw createError({ statusCode: 503, statusMessage: 'Registration is not available yet. You can still save your interests and browse as a visitor.' });
  }
  try {
    const response = await $fetch<BaseApiResponse<SigninResponseModel>>(endpoint, {
      method: 'POST', body: payload, timeout: 15000, retry: 0,
    });
    const identity = response.result;
    if (!response.success || !identity?.token || !identity.userId) {
      throw new Error('Registration was not confirmed.');
    }
    // Only return the established identity contract; do not expose upstream diagnostics.
    return { success: true, result: {
      token: identity.token, userId: identity.userId, email: identity.email,
      fullName: identity.fullName, username: identity.username,
    } };
  } catch {
    throw createError({ statusCode: 502, statusMessage: 'Registration could not be confirmed. If you already have an account, sign in; otherwise please try again later.' });
  }
});
