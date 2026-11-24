import type { SubscriptionResponseModel } from '~/models';
import { extractSubscriptionIdentity, type SubscriptionIdentity } from '~/utils/subscriptionIdentity';

/**
 * Establishes a GNP reader session from an API-issued JWT.
 *
 * Mirrors what `<SignInModal>` does on a password sign-in: the token goes into
 * the `gnp-user-identity` cookie, then into the auth store, which decodes it and
 * updates the reactive user so the header, guard middleware and
 * `gnpUserHttpClient` all see an authenticated reader.
 */
export function useGnpUserSession() {
  const authStore = useBasicAuthStore();

  const gnpUserIdentityCookie = useCookie('gnp-user-identity', {
    maxAge: 60 * 60 * 24 * 366,
    secure: true,
    httpOnly: false,
    priority: 'medium',
    sameSite: 'strict',
  });

  function establishSession(token: string) {
    const value = typeof token === 'string' ? token.trim() : '';
    if (!value) return false;

    gnpUserIdentityCookie.value = value;
    authStore.setAccessToken(value);
    return true;
  }

  /**
   * Signs the buyer in when checkout returned an identity token. Returns null
   * when no token was issued (identity auto-login unavailable), so callers can
   * fall back to the previous behaviour.
   */
  function signInFromCheckout(
    result: Partial<SubscriptionResponseModel> | null | undefined,
  ): SubscriptionIdentity | null {
    const identity = extractSubscriptionIdentity(result);
    if (!identity) return null;

    return establishSession(identity.token) ? identity : null;
  }

  return {
    establishSession,
    signInFromCheckout,
  };
}
