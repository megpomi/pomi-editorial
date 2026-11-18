import React, { useCallback, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";

// A pull down from the top of a page refreshes it, the way the native apps on
// the phone do. Nothing happens with a mouse: the handlers are touch only.
const THRESHOLD = 68;
const MAX_PULL = 104;
const RESISTANCE = 0.5;

export default function PullToRefresh({ onRefresh, children }) {
  const [pull, setPull] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(null);
  const active = useRef(false);

  const atTop = () =>
    (window.scrollY || document.documentElement.scrollTop || 0) <= 0;

  const release = () => {
    active.current = false;
    startY.current = null;
  };

  const handleTouchStart = (event) => {
    if (refreshing || event.touches.length !== 1 || !atTop()) return;
    startY.current = event.touches[0].clientY;
    active.current = true;
  };

  const handleTouchMove = (event) => {
    if (!active.current || startY.current === null) return;
    if (!atTop()) {
      release();
      setPull(0);
      return;
    }
    const delta = event.touches[0].clientY - startY.current;
    setPull(delta <= 0 ? 0 : Math.min(MAX_PULL, delta * RESISTANCE));
  };

  const handleTouchEnd = useCallback(async () => {
    if (!active.current) return;
    const distance = pull;
    release();
    if (distance < THRESHOLD) {
      setPull(0);
      return;
    }
    setPull(THRESHOLD);
    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
      setPull(0);
    }
  }, [pull, onRefresh]);

  const armed = pull >= THRESHOLD;
  const offset = refreshing ? THRESHOLD : pull;
  const visible = refreshing || pull > 0;
  const settled = refreshing || pull === 0;

  return (
    <div
      className="relative"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
    >
      <div
        aria-hidden={!visible}
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-center"
        style={{
          opacity: visible ? 1 : 0,
          transform: `translateY(${offset - 40}px)`,
          transition: settled ? "transform 240ms ease, opacity 240ms ease" : "none",
        }}
      >
        <div className="flex items-center gap-2 border border-border bg-card px-3 py-1.5 shadow-sm">
          <RefreshCw
            className={`h-3.5 w-3.5 text-primary ${refreshing ? "animate-spin" : ""}`}
            style={
              refreshing
                ? undefined
                : { transform: `rotate(${Math.min(180, (pull / THRESHOLD) * 180)}deg)` }
            }
          />
          <span className="eyebrow text-muted-foreground">
            {refreshing ? "Refreshing" : armed ? "Release to refresh" : "Pull to refresh"}
          </span>
        </div>
      </div>

      <div
        style={{
          transform: offset ? `translateY(${offset}px)` : undefined,
          transition: settled ? "transform 240ms ease" : "none",
        }}
      >
        {children}
      </div>
    </div>
  );
}