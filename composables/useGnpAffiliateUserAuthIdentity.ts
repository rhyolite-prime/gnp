/**
 * The affiliate API bearer token, sourced from the identity cookie.
 *
 * We return the reactive cookie ref directly instead of snapshotting it into
 * `useState`. `useState` only runs its initializer once per app instance, so a
 * cached snapshot could go stale after a client-side login/logout (sending a
 * missing or previous token). Reading the cookie keeps every request in sync
 * with the current session, on both server and client.
 */
export const useGnpAffiliateUserAuthIdentity = () => {
  return useCookie<string | null>('gnp-affiliate-user-identity', {
    readonly: true,
    secure: true,
    sameSite: 'strict',
    priority: 'medium',
  });
};
