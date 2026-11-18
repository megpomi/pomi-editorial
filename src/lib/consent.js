// The visitor's cookie choice, shared by the banner and anything that reopens it.
// Stored in the browser and reported to Google Consent Mode v2 so the AdSense
// tag can wait for it.

const KEY = "pomi_cookie_choice";
export const CONSENT_OPEN_EVENT = "pomi:cookie-settings";

export const readConsent = () => {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
};

// Push the four consent keys to gtag — once per load for a saved choice, and on
// every change. Never an array: Google expects the arguments object.
const reportConsent = (granted) => {
  const value = granted ? "granted" : "denied";
  window.dataLayer = window.dataLayer || [];
  const gtag =
    window.gtag ||
    function () {
      window.dataLayer.push(arguments);
    };
  gtag("consent", "update", {
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
    analytics_storage: value,
  });
};

// Called on every page load: dataLayer starts empty each time.
export const applySavedConsent = () => {
  const saved = readConsent();
  if (saved) reportConsent(saved === "granted");
};

export const saveConsent = (granted) => {
  try {
    localStorage.setItem(KEY, granted ? "granted" : "denied");
  } catch {
    // A blocked storage just means we ask again next visit.
  }
  reportConsent(granted);
};

export const openConsentSettings = () => {
  window.dispatchEvent(new Event(CONSENT_OPEN_EVENT));
};