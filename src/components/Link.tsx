import NextLink from "next/link";

type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link({ children, className = "", ...props }: LinkProps) {
  return (
    <NextLink
      className={`text-[var(--accent)] transition-colors hover:text-[var(--accent-strong)] ${className}`}
      {...props}
    >
      {children}
    </NextLink>
  );
}
