import NextImage from "next/image";

type ImageProps = React.ComponentProps<typeof NextImage>;

export function Image(props: ImageProps) {
  return <NextImage {...props} />;
}
