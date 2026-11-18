import { Droplet, Egg, Flame, HeartPulse, Sprout } from "lucide-react";
import LotusIcon from "@/components/icons/LotusIcon";
import ButterflyIcon from "@/components/icons/ButterflyIcon";

export const CYCLE_FOCUS = "menstrual_cycles";
export const CONCEPTION_FOCUS = "trying_to_conceive";

// Ovulation and the fertile window are read off the cycle, so the two areas
// travel together: conception brings cycle tracking with it, and dropping the
// cycle drops conception too.
export function addFocus(list, value) {
  if (value === CONCEPTION_FOCUS && !list.includes(CYCLE_FOCUS)) {
    return [...list, value, CYCLE_FOCUS];
  }
  return [...list, value];
}

export function removeFocus(list, value) {
  const next = list.filter((v) => v !== value);
  return value === CYCLE_FOCUS
    ? next.filter((v) => v !== CONCEPTION_FOCUS)
    : next;
}

// The areas a user can choose to track — shared by onboarding and the profile page.
export const TRACKING_OPTIONS = [
  {
    value: "menstrual_cycles",
    label: "Menstrual cycles",
    desc: "Track periods, flow, and predictions.",
    icon: Droplet,
    removal: {
      title: "Stop tracking menstrual cycles?",
      items: [
        "Period days, flow intensity and cycle symptoms",
        "Cycle predictions, stats and patterns",
        "Logging historical menstrual days from your calendar",
      ],
    },
  },
  {
    value: "perimenopause_menopause",
    label: "Perimenopause or menopause",
    desc: "Track symptoms specificly for perimenopause pattern detection and progress.",
    icon: Flame,
    comingSoon: true,
  },
  {
    value: "gender_transitioning",
    label: "Gender affirming journey",
    desc: "Track symptoms throughout your care.",
    icon: ButterflyIcon,
    comingSoon: true,
  },
  {
    value: "trying_to_conceive",
    label: "Trying for a baby",
    desc: "Watch for ovulation and your fertile window with the intention of conception.",
    icon: Egg,
    removal: {
      title: "Stop tracking trying for a baby?",
      items: [
        "Your fertile window and ovulation prediction on the dashboard",
        "The conception note on your cycle",
      ],
    },
  },
  {
    value: "pregnancy",
    label: "Pregnancy journey",
    desc: "Track pregnancy symptoms.",
    icon: Sprout,
    comingSoon: true,
  },
  {
    value: "postpartum",
    label: "Postpartum recovery",
    desc: "Track recovery and changes after birth.",
    icon: HeartPulse,
    comingSoon: true,
  },
  {
    value: "general_wellbeing",
    label: "Mental wellbeing",
    desc: "Track your thoughts and feelings with daily journalling prompts and voice recordings.",
    icon: LotusIcon,
    removal: {
      title: "Stop tracking mental wellbeing?",
      items: [
        "Daily journal prompts, reflections and voice notes",
        "The wellbeing prompt on your dashboard",
        "Seeing your journal entries on the calendar",
      ],
    },
  },
];