import React from "react";
import { AlmChip } from "@/components/alm/Primitives";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TESTS = [
  { value: "negative", label: "Negative" },
  { value: "positive", label: "Positive" },
];

// The two readings that sharpen a conception prediction: an ovulation test,
// which moves the window, and the first-thing temperature, which confirms
// ovulation after the fact.
export default function ConceptionFields({
  ovulationTest,
  onOvulationTestChange,
  bbt,
  onBbtChange,
}) {
  return (
    <>
      <div className="space-y-3">
        <Label className="eyebrow text-muted-foreground">Ovulation test</Label>
        <div className="flex flex-wrap gap-2">
          {TESTS.map((test) => (
            <AlmChip
              key={test.value}
              on={ovulationTest === test.value}
              onClick={() =>
                onOvulationTestChange(
                  ovulationTest === test.value ? "" : test.value
                )
              }
            >
              {test.label}
            </AlmChip>
          ))}
        </div>
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          A positive test moves your fertile window to the day after it.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bbt" className="eyebrow text-muted-foreground">
          Basal body temperature (°C)
        </Label>
        <Input
          id="bbt"
          type="number"
          inputMode="decimal"
          step="0.01"
          value={bbt}
          onChange={(event) => onBbtChange(event.target.value)}
          placeholder="36.60"
          className="h-11 max-w-[150px] rounded-[3px] font-heading text-[16px]"
        />
        <p className="text-[12px] leading-relaxed text-muted-foreground">
          Take it first thing, before getting up. A sustained rise suggests
          ovulation has passed.
        </p>
      </div>
    </>
  );
}