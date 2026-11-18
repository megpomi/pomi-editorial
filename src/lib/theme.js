// The appearance choice lives on the device, not on the account: a phone that
// is set to dark should open dark, whatever the account was last saved with.
const THEME_KEY = "pomi-theme";

export function readThemePreference() {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    return stored === "dark" || stored === "light" ? stored : null;
  } catch (e) {
    return null;
  }
}

export function systemPrefersDark() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  );
}

// No stored choice yet means the device decides.
export function applyThemePreference(preference) {
  const dark = preference ? preference === "dark" : systemPrefersDark();
  document.documentElement.classList.toggle("dark", dark);
}

export function saveThemePreference(preference) {
  try {
    localStorage.setItem(THEME_KEY, preference);
  } catch (e) {
    // Private browsing: the choice still applies for this visit.
  }
  applyThemePreference(preference);
}