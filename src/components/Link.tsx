import NextLink from "next/link";

type LinkProps = React.ComponentProps<typeof NextLink>;

export function Link({ children, className = "", ...props }: LinkProps) {
  return (
    <NextLink
      className={`text-amber-600 hover:text-amber-700 underline-offset-2 hover:underline ${className}`}
      {...props}
    >
      {children}
    </NextLink>
  );
}
