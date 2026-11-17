// Options for the daily check-in — mood, flow and symptoms.

export const FLOW_OPTIONS = [
  { value: "none", label: "None", dot: "bg-slate-300" },
  { value: "light", label: "Light", dot: "bg-pomegranate-200" },
  { value: "medium", label: "Medium", dot: "bg-pomegranate-400" },
  { value: "heavy", label: "Heavy", dot: "bg-pomegranate-600" },
];

export const MOOD_OPTIONS = [
  { value: "great", label: "Great" },
  { value: "good", label: "Good" },
  { value: "okay", label: "Okay" },
  { value: "low", label: "Low" },
  { value: "anxious", label: "Anxious" },
  { value: "devastated", label: "Devastated" },
];

// The two signs that only mean something when someone is trying to conceive.
export const CONCEPTION_SYMPTOMS = ["mittelschmerz", "cervix_high_soft"];

export const SYMPTOM_OPTIONS = [
  "cramps",
  "headache",
  "bloating",
  "fatigue",
  "breast_tenderness",
  "spotting",
  "acne",
  "cravings",
  "appetite_loss",
  "backache",
  "mood_swings",
  "insomnia",
  "dreams",
  "increased_libido",
  ...CONCEPTION_SYMPTOMS,
];

export const DISCHARGE_OPTIONS = [
  "egg_white",
  "creamy",
  "watery",
  "sticky",
  "milky_white",
  "discoloured",
];

// Symptoms are stored as keys; this is how they're read back on screen.
const SYMPTOM_LABELS = {
  mittelschmerz: "one-sided twinge",
  cervix_high_soft: "high, soft cervix",
  increased_libido: "increased libido",
};

export const prettySymptom = (symptom) =>
  SYMPTOM_LABELS[symptom] || symptom.replace(/_/g, " ");