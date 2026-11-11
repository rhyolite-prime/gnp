import {
  describeSubscriptionStatus,
  pickCurrentSubscription,
  summarizeSubscription,
  type CurrentSubscriptionSummary,
} from '~/utils/pricingPlans';
import type { MemberSubscriptionPayload, SubscriptionResponseModel, UserSubscription } from '~/models';

/** What the buy modal needs to know about the reader before they pay. */
export interface MemberSubscriptionContext {
  /** e.g. `Kwabena Imhotep`; falls back to the email, then `Your account`. */
  displayName: string;
  email: string;
  username: string;
  userId: string;
  /** Existing package (active or expired), or null for a first purchase. */
  current: CurrentSubscriptionSummary | null;
  /** `Active · 12 days left`, `Expired`, … Empty for a first purchase. */
  statusLabel: string;
  /** False while `subscription/get-all` is still in flight or failed. */
  isLoaded: boolean;
}

function text(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Purchase flow for readers who are already signed in.
 *
 * The guest modal collects name/email/phone and calls `subscription/guest`; a
 * signed-in reader already has an identity, so this composable reads the
 * profile from the auth store (the JWT payload `setAccessToken` decoded), loads
 * their existing package and buys with `subscription/user`, which authenticates
 * with the `gnp-user-identity` bearer token instead of a payload.
 */
export function useMemberSubscription() {
  const authStore = useBasicAuthStore();

  /** JWT claims live in `idTokenClaims`; MSAL fields cover other providers. */
  const profile = computed(() => {
    const user = authStore.user;
    const claims = (user?.idTokenClaims ?? {}) as Record<string, unknown>;

    const email = text(claims.email) || text(user?.email) || text(user?.username);
    const firstName = text(user?.givenName) || text(claims.firstName);
    const lastName = text(user?.surname) || text(claims.surName) || text(claims.surname);
    const fullName =
      text(claims.name) ||
      text(user?.displayName) ||
      text(user?.name) ||
      [firstName, lastName].filter(Boolean).join(' ');

    return {
      email,
      fullName,
      firstName,
      lastName,
      username: text(claims.username) || text(user?.username),
      userId: text(claims.userId) || text(claims.sub),
    };
  });

  const displayName = computed(
    () => profile.value.fullName || profile.value.email || 'Your account',
  );

  /**
   * Loads the reader's packages and reduces them to the one worth showing.
   * Failures are swallowed: not knowing the current plan must never block a
   * purchase, it only hides the summary panel.
   */
  async function loadCurrentSubscription(): Promise<CurrentSubscriptionSummary | null> {
    try {
      const page = await getUserSubscription({ pageNo: 1, pageSize: 50 });
      const rows = Array.isArray(page?.data) ? (page!.data as UserSubscription[]) : [];
      return summarizeSubscription(pickCurrentSubscription(rows));
    } catch (error) {
      console.error('Failed to load the current subscription:', error);
      return null;
    }
  }

  /**
   * Buys (or renews) a package for the signed-in reader. Same
   * `{ success, message, data }` contract as the guest flow so both can share
   * `<PaymentCheckoutModal>`; `data.paymentUrl` is what opens Paystack.
   */
  async function purchase(
    payload: MemberSubscriptionPayload,
  ): Promise<{ success: boolean; message: string; data?: SubscriptionResponseModel }> {
    return userSubscription(payload);
  }

  return {
    profile,
    displayName,
    loadCurrentSubscription,
    purchase,
    describeSubscriptionStatus,
  };
}
