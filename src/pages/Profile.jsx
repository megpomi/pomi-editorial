import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useToast } from "@/components/ui/use-toast";
import Masthead from "@/components/alm/Masthead";
import AlmTabs from "@/components/alm/AlmTabs";
import { AlmButton, Rule } from "@/components/alm/Primitives";
import TrackingPreferences from "@/components/profile/TrackingPreferences";
import ProfileNameForm from "@/components/profile/ProfileNameForm";
import EmailBox from "@/components/profile/EmailBox";
import PasswordForm from "@/components/profile/PasswordForm";
import CausePreferences from "@/components/profile/CausePreferences";
import CurrencyPreference from "@/components/profile/CurrencyPreference";
import NotificationPreferences from "@/components/profile/NotificationPreferences";
import { DEFAULT_CURRENCY, currencyOf } from "@/lib/currency";
import {
  notificationUserFields,
  readNotificationPrefs,
} from "@/lib/notifications";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tracking, setTracking] = useState([]);
  const [causes, setCauses] = useState([]);
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [notifications, setNotifications] = useState(() =>
    readNotificationPrefs(null)
  );
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  // Clears the stored session and reloads, so the app opens as a new visitor.
  const handleLogout = () => {
    window.location.replace("/?clear_access_token=true");
  };

  useEffect(() => {
    base44.auth
      .me()
      .then((u) => {
        setUser(u || null);
        setTracking(u?.tracking_focus || []);
        setCauses(u?.charity_interests || []);
        setCurrency(currencyOf(u));
        setNotifications(readNotificationPrefs(u));
      })
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await base44.auth.updateMe({
        tracking_focus: tracking,
        charity_interests: causes,
        currency,
        ...notificationUserFields(notifications),
      });
      toast({
        title: "Preferences saved",
        description:
          "Your tracking areas, causes, currency and notifications are updated.",
      });
    } catch (e) {
      toast({
        title: "Couldn't save your preferences",
        description: e?.message || "Please try again.",
        variant: "destructive",
      });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-pomegranate-100 border-t-pomegranate-600" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <p className="font-heading text-xl font-semibold text-slate-700">
          We couldn't load your profile.
        </p>
        <Link
          to="/"
          className="text-sm font-medium text-pomegranate-600 hover:text-pomegranate-700"
        >
          Back to my dashboard
        </Link>
      </div>
    );
  }

  const canSave = tracking.length > 0 && causes.length > 0 && !saving;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl pb-28">
        <Masthead />

        <section className="px-6 pb-2">
          <h1 className="font-heading text-[30px] leading-[1.08] tracking-tight sm:text-[34px] sm:leading-[1.05]">
            Your profile
          </h1>
        </section>

        <Rule className="my-6" />

        <div className="space-y-6 px-6">
          <ProfileNameForm
            user={user}
            onSaved={(name) =>
              setUser((current) => ({ ...current, preferred_name: name }))
            }
          />
          <EmailBox email={user.email} />
          <PasswordForm user={user} />
          <TrackingPreferences selected={tracking} onChange={setTracking} />
          <CausePreferences selected={causes} onChange={setCauses} />
          <CurrencyPreference value={currency} onChange={setCurrency} />
          <NotificationPreferences
            preferences={notifications}
            onChange={setNotifications}
            tracking={tracking}
          />
        </div>

        <div className="px-6 pt-2">
          <AlmButton onClick={handleSave} disabled={!canSave}>
            {saving ? "Saving…" : "Save preferences"}
          </AlmButton>
          {!canSave && !saving && (
            <p className="mt-3 text-center font-heading text-[12.5px] italic text-muted-foreground">
              Choose at least one tracking area and one cause to save.
            </p>
          )}

          <div className="mt-8 border-t border-border pt-5">
            <button
              type="button"
              onClick={handleLogout}
              className="block font-heading text-[13px] italic text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
            >
              Log out
            </button>
            <Link
              to="/delete-account"
              className="mt-3 block font-heading text-[13px] italic text-muted-foreground underline underline-offset-4 transition-colors hover:text-destructive"
            >
              Delete my account
            </Link>
          </div>
        </div>
      </div>
      <AlmTabs />
    </div>
  );
}