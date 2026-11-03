export default defineNuxtPlugin(() => {
  const router = useRouter();

  router.onError((error, to) => {
    const msg = String(error?.message || error || '');
    const isDynamicImportError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('Unable to preload CSS') ||
      msg.includes('does not provide an export');

    if (isDynamicImportError && to?.fullPath && window.location.pathname !== to.path) {
      window.location.assign(to.fullPath);
    }
  });
});
