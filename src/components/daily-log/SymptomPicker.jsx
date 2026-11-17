import React, { useEffect, useState } from "react";
import { Check, Loader2, Pencil, Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { SYMPTOM_OPTIONS } from "@/lib/dailyLog";
import { Label } from "@/components/ui/label";

const BUBBLE =
  "rounded-[3px] border px-3 py-1.5 text-[13px] capitalize transition-colors";

// The day's symptoms: the standard bubbles, the user's own symptoms saved for
// good, and a bubble at the end that turns into an input for a new one.
export default function SymptomPicker({ value, onChange }) {
  const [custom, setCustom] = useState([]);
  const [editing, setEditing] = useState(null); // "new" or a CustomSymptom id
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    base44.entities.CustomSymptom.list({ sort: "created_date", limit: 100 })
      .then((page) => active && setCustom(page.items))
      .catch(() => active && setError("Couldn't load your own symptoms."));
    return () => {
      active = false;
    };
  }, []);

  const toggle = (symptom) =>
    onChange(
      value.includes(symptom)
        ? value.filter((item) => item !== symptom)
        : [...value, symptom]
    );

  const startEdit = (target, name = "") => {
    setError("");
    setEditing(target);
    setDraft(name);
  };

  const cancelEdit = () => {
    setEditing(null);
    setDraft("");
  };

  const commit = async () => {
    const name = draft.trim();
    if (!name || busy) return;
    setBusy(true);
    setError("");
    try {
      if (editing === "new") {
        const existing =
          custom.find(
            (item) => item.name.toLowerCase() === name.toLowerCase()
          ) || SYMPTOM_OPTIONS.includes(name.toLowerCase());
        if (existing) {
          if (!value.includes(name)) toggle(name);
        } else {
          const record = await base44.entities.CustomSymptom.create({ name });
          setCustom((current) => [...current, record]);
          onChange([...value, name]);
        }
      } else {
        const previous = custom.find((item) => item.id === editing);
        await base44.entities.CustomSymptom.update(editing, { name });
        setCustom((current) =>
          current.map((item) => (item.id === editing ? { ...item, name } : item))
        );
        if (previous && value.includes(previous.name)) {
          onChange(
            [...value.filter((item) => item !== previous.name), name]
          );
        }
      }
      cancelEdit();
    } catch (e) {
      setError(e?.message || "Couldn't save that symptom.");
    } finally {
      setBusy(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      commit();
    }
    if (event.key === "Escape") cancelEdit();
  };

  const editor = (placeholder) => (
    <span className="inline-flex items-center gap-1 rounded-[3px] border border-primary bg-secondary px-2.5 py-1">
      <input
        autoFocus
        value={draft}
        maxLength={60}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className="w-28 bg-transparent text-[13px] text-foreground outline-none placeholder:text-muted-foreground/60"
      />
      <button
        type="button"
        onClick={commit}
        disabled={!draft.trim() || busy}
        aria-label="Save symptom"
        className="text-pomegranate-600 disabled:opacity-40"
      >
        {busy ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Check className="h-3 w-3" />
        )}
      </button>
      <button
        type="button"
        onClick={cancelEdit}
        aria-label="Cancel"
        className="text-pomegranate-400 hover:text-pomegranate-600"
      >
        <X className="h-3 w-3" />
      </button>
    </span>
  );

  return (
    <div className="space-y-2">
      <Label className="eyebrow text-muted-foreground">Symptoms</Label>
      <div className="flex flex-wrap items-center gap-2">
        {SYMPTOM_OPTIONS.map((symptom) => (
          <button
            key={symptom}
            type="button"
            onClick={() => toggle(symptom)}
            className={`${BUBBLE} ${
              value.includes(symptom)
                ? "border-primary bg-primary text-primary-foreground"
                : "border-foreground/20 text-foreground hover:border-primary/50"
            }`}
          >
            {symptom.replace(/_/g, " ")}
          </button>
        ))}

        {custom.map((item) =>
          editing === item.id ? (
            <React.Fragment key={item.id}>{editor("Symptom")}</React.Fragment>
          ) : (
            <span key={item.id} className="relative inline-flex">
              <button
                type="button"
                onClick={() => toggle(item.name)}
                className={`${BUBBLE} ${
                  value.includes(item.name)
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-foreground/20 text-foreground hover:border-primary/50"
                }`}
              >
                {item.name}
              </button>
              <button
                type="button"
                onClick={() => startEdit(item.id, item.name)}
                aria-label={`Edit ${item.name}`}
                className="absolute -right-1.5 -top-1.5 rounded-full border border-border bg-card p-[3px] text-muted-foreground shadow-sm transition hover:text-primary"
              >
                <Pencil className="h-2.5 w-2.5" />
              </button>
            </span>
          )
        )}

        {editing === "new" ? (
          editor("New symptom")
        ) : (
          <button
            type="button"
            onClick={() => startEdit("new")}
            className="inline-flex items-center gap-1 rounded-[3px] border border-dashed border-primary/40 px-3 py-1.5 text-[13px] text-primary transition hover:border-primary hover:bg-secondary"
          >
            <Plus className="h-3 w-3" />
            Add Custom Symptom
          </button>
        )}
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}