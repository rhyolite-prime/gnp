# Content interests and category alerts

## Reader experience

- `/interests` is linked from the desktop header, mobile menu, and footer.
- The 21 choices in `utils/contentCategories.ts` include separate Electronic sales and Promotions choices, and separate Vacancy and We are hiring choices.
- Interests are stored on this browser in `gnp-content-interests-v1`. Invalid and duplicate stored IDs are removed. This is not an account-synchronised preference or a separate category purchase.
- Readers choose a saved interest to browse keyword matches through the existing `news-papers/search-archives` endpoint, with pagination. The archive API currently has no category-filter parameter; labels therefore explicitly describe these as keyword matches, not a curated category feed.
- Cards expose public search previews only and link to `/archives/:id`. The existing archive reader calls `subscription/validate-archive-access/:id` and handles full access, paywalls, and purchasing. No client-side flag grants paid access. `/pricing` remains the plan entry point.

## Notifications

- Alerts are independent of reading access and interest selections. Select interests, choose the alert checkboxes (or Use my interests), and explicitly save.
- First-time saving with at least one alert selected invokes the existing browser permission/subscription flow. Denied/unsupported permission and save failures are surfaced; failed saves do not update local subscribed topics.
- Category topics are `content_<category_id>`. Saving replaces only those topics, preserving billing, breaking news, and other existing preferences.
- Clear category alerts followed by Save turns off content topics without unsubscribing from other alert types. Removing an interest does not silently unsubscribe its alerts; existing alert choices remain visible until explicitly cleared.
- Notification Center also lists the new topics. All preferences remain device/browser-specific, following the existing push architecture.
- Empty topic arrays are respected at registration and by client/server dispatch filtering; they no longer mean opt in to every topic.

## Publisher workflow and limitations

In Admin → Campaigns → New, choose a category under **Content interests**, include a relevant headline and a reader link, and use the existing push campaign delivery flow. Dispatch matches each browser's exact topic subscription. This implementation does not automatically classify ingested pages or generate/send an alert every time content is ingested. The publisher must create the campaign. Existing push infrastructure (VAPID, service worker, persistence, campaign scheduling) must be configured for production delivery.

## Validation

Run `node --test tests/*.test.mjs`. New tests cover the category catalogue, persisted selection validation, reader wiring, and empty-topic filtering. Vue SFC compilation and TypeScript syntax checks were run separately. Live upstream API responses, paid-reader entitlement flows, and OS push delivery still require an integration environment/browser check.
