export const AVATARS = [
  "boy1",
  "boy2",
  "boy3",
  "girl1",
  "girl2",
  "girl3",
  "boy4",
  "girl4",
  "boy5",
  "girl5",
  "boy6",
  "girl6",
] as const;

export type AvatarId = (typeof AVATARS)[number];

const avatars: Record<AvatarId | "anonymous", string | null> = {
  anonymous: null,
  boy1: "/avatars/avatar-1.png",
  boy2: "/avatars/avatar-2.png",
  boy3: "/avatars/avatar-3.png",
  girl1: "/avatars/avatar-4.png",
  girl2: "/avatars/avatar-5.png",
  girl3: "/avatars/avatar-6.png",
  boy4: "/avatars/avatar-7.png",
  girl4: "/avatars/avatar-8.png",
  boy5: "/avatars/avatar-9.png",
  girl5: "/avatars/avatar-10.png",
  boy6: "/avatars/avatar-11.png",
  girl6: "/avatars/avatar-12.png",
};

type AvatarProps = {
  id: AvatarId | string;
  size?: number;
  className?: string;
  imgSize?: number;
};

export function Avatar({ id, size = 40, className = "", imgSize = 40 }: AvatarProps) {
  const safeId =
    id === "anonymous" || id === "Someone" ? "anonymous" : AVATARS.includes(id as AvatarId) ? (id as AvatarId) : "boy1";
  const src = avatars[safeId];
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.05)] ring-1 ring-[var(--border)] ${className}`}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" width={imgSize} height={imgSize} draggable={false} style={{ borderRadius: "50%" }} />
      ) : (
        <svg width={imgSize} height={imgSize} viewBox="0 0 48 48" fill="none" aria-hidden>
          <circle cx="24" cy="24" r="21" fill="#f2f2f7" stroke="#d1d1d6" />
          <circle cx="24" cy="20" r="6" fill="#b0b3b8" />
          <path d="M11 38 Q24 29 37 38 L37 41 L11 41 Z" fill="#b0b3b8" />
        </svg>
      )}
    </span>
  );
}
