import React from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import VoiceNoteRecorder from "@/components/journal/VoiceNoteRecorder";
import { Eyebrow } from "@/components/alm/Primitives";
import { promptForDate } from "@/lib/journalPrompts";

// The general wellbeing part of a day's entry: the day's reflective prompt, a
// written reflection and an optional voice note.
export default function JournalEntryBox({
  dateKey,
  response,
  voiceNote,
  onResponseChange,
  onVoiceNoteChange,
}) {
  const { theme, prompt } = promptForDate(dateKey);

  return (
    <div className="space-y-6">
      <div className="border-l-2 border-primary pl-4">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <Eyebrow>Today's prompt</Eyebrow>
          <span className="font-heading text-[12px] italic text-primary">
            {theme.label}
          </span>
        </div>
        <p className="mt-2 font-heading text-[17px] leading-snug">{prompt}</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="journal-response" className="eyebrow text-muted-foreground">
          Your reflection
        </Label>
        <Textarea
          id="journal-response"
          rows={5}
          value={response}
          onChange={(event) => onResponseChange(event.target.value)}
          placeholder="Take your time. Write as much or as little as feels right."
          className="ruled-lines rounded-none border-0 bg-transparent px-0 font-heading text-[16px] italic leading-7 shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
        />
      </div>

      <div className="space-y-2">
        <Label className="eyebrow text-muted-foreground">
          Or record a voice note
        </Label>
        <VoiceNoteRecorder fileUri={voiceNote} onChange={onVoiceNoteChange} />
      </div>
    </div>
  );
}