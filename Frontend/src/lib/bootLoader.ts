/*
 * Fades out the boot screen that index.html paints on every (re)load. Called
 * once the app has mounted and its first API requests have settled. It stays
 * up for at least MIN_VISIBLE_MS since navigation started, so a fast load
 * shows a calm fade rather than a flash.
 */
const MIN_VISIBLE_MS = 600;
const FADE_MS = 420;

let dismissed = false;

export function dismissBootLoader() {
  if (dismissed) return;
  dismissed = true;
  const el = document.getElementById("boot");
  if (!el) return;

  const wait = Math.max(0, MIN_VISIBLE_MS - performance.now());
  setTimeout(() => {
    el.classList.add("boot--done");
    // Remove after the fade; the timeout covers browsers that skip transitionend
    el.addEventListener("transitionend", () => el.remove(), { once: true });
    setTimeout(() => el.remove(), FADE_MS + 200);
  }, wait);
}
