# First-visit interest welcome wizard

## Behaviour

The landing page mounts `InterestWelcomeWizard` client-side. New anonymous visitors are introduced to **Follow what matters to you**, choose at least one of the existing 21 interests, and see a registration form for full name, email, and phone number. The optional Express Login checkbox is unchecked by default and available only on compatible devices in a secure context.

The dialog uses Headless UI for focus containment, focus restoration, Escape handling, and background scroll locking. It can be dismissed or skipped without registration. While a registration request is in flight, closing is disabled to avoid losing an uncertain result; the backend request has a 15-second timeout and no automatic retries.

`gnp-welcome-seen-v1` suppresses automatic repeat prompts on the same browser. In-memory session state remains a fallback if local storage is blocked. A persistent landing-page **Personalise my news** button reopens the guide; signed-in readers go directly to `/interests`. Clearing browser data resets first-visit detection.

Interest selections use the existing `gnp-content-interests-v1` key, so they are immediately available on `/interests`. No contact details or registration drafts are stored in local/session storage by the wizard. Contact fields are cleared when it closes. Interests are saved when continuing from the interest step or browsing as a visitor. Storage failures are reported. This does not opt users into push notifications, marketing, or a paid plan.

## Registration backend: integration required

There is no existing standalone public account-registration API in this repository. The wizard therefore calls a new same-origin adapter, `POST /api/v1/onboarding/register`, rather than inventing a successful registration or misusing a paid subscription purchase.

Configure the private runtime setting **`NUXT_ONBOARDING_REGISTRATION_URL`** to the identity backend's registration endpoint. Until this is configured, the adapter responds with **503**, the wizard reports that registration is unavailable, and visitors can still save interests and browse. Do not expose this setting in public runtime configuration.

Expected backend POST JSON:

```json
{
  "fullName": "Ama Mensah",
  "email": "ama@example.com",
  "phoneNumber": "+233241234567",
  "interests": ["business", "education"],
  "expressLoginRequested": false
}
```

Required successful response follows the existing sign-in identity envelope:

```json
{
  "success": true,
  "result": {
    "token": "<identity-backend-issued-session-token>",
    "userId": "<registered-reader-id>",
    "email": "ama@example.com",
    "fullName": "Ama Mensah",
    "username": "ama@example.com"
  }
}
```

The identity backend is responsible for duplicate-account handling, identity verification, abuse/rate limiting, and recovery/login methods. It must not issue a session before its verification requirements are met. If the backend uses a separate OTP/email-verification flow, extend the adapter and wizard to support that contract before enabling registration. Do not map an unverified registration request to a successful sign-in. The adapter validates input, normalises interests, suppresses upstream diagnostics, and rejects missing tokens/user IDs. Successful identities use the existing auth store, identity cookie, and shared authenticated API state. No token or identity is generated locally.

## Express Login

The checkbox records an explicit request, not a completed passkey enrollment. After successful account registration, opted-in readers are offered **Set up Express Login**. This opens `/account?setupExpressLogin=1`, highlights the existing passkey settings, and explains that they must select **Enable Express Login** and confirm using their device security. No credential is created just by checking the box. Existing passkey API/device integration remains in `useBiometrics`, `registerBiometric`, and the account page, and requires its own backend support. Registration never grants paid content access.

## Width change

The default public layout's standard `.max-w-7xl.px-4` containers and the header get a maximum width of `calc(80rem + 4px)`, increasing width by 2px per side (including the additional 1px-per-side adjustment) on wide screens. Below the original width cap, existing horizontal gutters decrease by 2px per side at each Tailwind breakpoint rather than extending beyond the viewport. The footer, admin layout, and smaller specialised content containers are unchanged.

## Validation

`node --test tests/*.test.mjs` covers input validation, explicit opt-in, persistence keys, dialog/integration wiring, and width rules. Vue SFC compilation and TypeScript syntax checks were also run. Real account creation, device enrollment, first-visit behaviour across browsers, and visual/mobile layout require integration/browser verification with a configured identity backend.
