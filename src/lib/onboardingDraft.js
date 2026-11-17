// Answers given before signing in are kept here, so they survive the redirect
// to Google, Apple or Facebook and can be saved to the account once it exists.
//
// Deliberately session storage rather than local storage: the draft holds
// personal wellbeing answers, so it lives only in this tab and disappears when
// the tab closes instead of lingering on a shared device.
const KEY = "pomi_onboarding_draft";

// A draft only belongs to the sign-in that immediately follows it: it expires so
// a shared device never offers one person's answers to the next account.
const MAX_AGE_MS = 2 * 60 * 60 * 1000;

const store = () => window.sessionStorage;

export function readOnboardingDraft() {
  try {
    const raw = store().getItem(KEY);
    if (!raw) return null;
    const draft = JSON.parse(raw);
    if (!draft?.saved_at || Date.now() - draft.saved_at > MAX_AGE_MS) {
      store().removeItem(KEY);
      return null;
    }
    return draft;
  } catch {
    return null;
  }
}

export function writeOnboardingDraft(draft) {
  try {
    store().setItem(KEY, JSON.stringify({ ...draft, saved_at: Date.now() }));
  } catch {
    // Private browsing can refuse storage — onboarding still works, it just
    // cannot carry answers across the sign-in redirect.
  }
}

export function clearOnboardingDraft() {
  try {
    store().removeItem(KEY);
    // Clear any draft left by an older build that kept this in local storage.
    window.localStorage.removeItem(KEY);
  } catch {
    // Nothing to clear.
  }
}