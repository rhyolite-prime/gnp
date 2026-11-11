import type { SubscriptionResponseModel } from '~/models';

/** Profile the checkout response gives us for an auto-login. */
export interface SubscriptionIdentity {
  token: string;
  userId: string;
  username: string;
  fullName: string;
  email: string;
}

/** Claims we read from the GNP JWT (see `stores/basic-user-auth.ts`). */
export interface GnpTokenClaims {
  sub?: string;
  userId?: string;
  username?: string;
  email?: string;
  firstName?: string;
  surName?: string;
  surname?: string;
  fullName?: string;
  name?: string;
  picture?: string;
}

/**
 * Reads the signed identity out of a checkout `result`.
 *
 * Returns null when the API did not mint a token (the pre-change behaviour), in
 * which case the caller keeps showing the payment step only. The token alone is
 * enough: the profile fields are optional and fall back to the JWT claims.
 */
export function extractSubscriptionIdentity(
  result: Partial<SubscriptionResponseModel> | null | undefined,
): SubscriptionIdentity | null {
  const token = typeof result?.token === 'string' ? result.token.trim() : '';
  if (!token) return null;

  const claims = decodeGnpToken(token) ?? {};
  const stringOr = (...values: unknown[]): string =>
    values.map((value) => (typeof value === 'string' ? value.trim() : '')).find(Boolean) ?? '';

  return {
    token,
    userId: stringOr(result?.userId, claims.userId, claims.sub),
    username: stringOr(result?.username, claims.username),
    fullName: stringOr(
      result?.fullName,
      claims.fullName,
      claims.name,
      [claims.firstName, claims.surName ?? claims.surname].filter(Boolean).join(' '),
    ),
    email: stringOr(result?.email, claims.email),
  };
}

/**
 * Decodes the payload segment of a JWT without verifying it (the server already
 * did). Tolerates base64url, missing padding and Unicode names; returns null
 * instead of throwing on malformed input.
 */
export function decodeGnpToken(token: string | null | undefined): GnpTokenClaims | null {
  if (typeof token !== 'string') return null;

  const payload = token.trim().split('.')[1];
  if (!payload) return null;

  try {
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    const binary = atob(padded);
    const json = decodeURIComponent(
      binary
        .split('')
        .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, '0')}`)
        .join(''),
    );
    const claims = JSON.parse(json);
    return claims && typeof claims === 'object' ? (claims as GnpTokenClaims) : null;
  } catch {
    return null;
  }
}

/** Best display name for the freshly signed-in buyer, never empty. */
export function getIdentityDisplayName(identity: SubscriptionIdentity | null | undefined): string {
  const name = identity?.fullName?.trim();
  if (name) return name;
  const username = identity?.username?.trim();
  if (username) return username;
  return identity?.email?.trim() ?? '';
}

/**
 * Splits a full name for the biometric enrolment payload, which needs the same
 * shape as the checkout form.
 */
export function toBiometricUser(identity: SubscriptionIdentity | null | undefined) {
  return {
    id: identity?.userId ?? '',
    email: identity?.email ?? '',
    name: getIdentityDisplayName(identity),
  };
}
