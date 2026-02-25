"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const START_EVENT = "kodous:route-start";

export function PageProgressBar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function start() {
      setVisible(true);
      setActive(true);
      setProgress((prev) => (prev > 8 ? prev : 8));
    }

    document.addEventListener(START_EVENT, start);
    window.addEventListener("popstate", start);
    return () => {
      document.removeEventListener(START_EVENT, start);
      window.removeEventListener("popstate", start);
    };
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    const tick = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          return prev;
        }
        const delta = Math.max(0.8, (95 - prev) * 0.14);
        return Math.min(95, prev + delta);
      });
    }, 120);

    return () => window.clearInterval(tick);
  }, [active]);

  useEffect(() => {
    if (!active) {
      return;
    }

    setProgress(100);
    const finish = window.setTimeout(() => {
      setVisible(false);
      setActive(false);
      setProgress(0);
    }, 220);

    return () => window.clearTimeout(finish);
  }, [pathname, searchParams, active]);

  return (
    <div
      aria-hidden
      className={`kd-page-progress ${visible ? "is-visible" : ""}`}
      style={{ width: `${progress}%` }}
    />
  );
}
