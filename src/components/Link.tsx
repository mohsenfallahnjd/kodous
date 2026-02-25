"use client";

import NextLink from "next/link";
import type { MouseEvent } from "react";

type LinkProps = React.ComponentProps<typeof NextLink>;
const START_EVENT = "kodous:route-start";

export function Link({ children, className = "", onClick, target, ...props }: LinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) {
      return;
    }

    if (target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    document.dispatchEvent(new Event(START_EVENT));
  }

  return (
    <NextLink
      className={`text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)] ${className}`}
      onClick={handleClick}
      target={target}
      {...props}
    >
      {children}
    </NextLink>
  );
}
