import { FoxAvatarFace, type FoxVariant } from "@/components/office-2d/FoxAvatarFace";

interface SvgAvatarProps {
  agentId: string;
  size?: number;
  className?: string;
}

export function SvgAvatar({ agentId, size = 40, className }: SvgAvatarProps) {
  const variant: FoxVariant =
    agentId === "agent:main:main"        ? "aari-telegram" :
    agentId.startsWith("agent:discord:") ? "aari-discord"  :
    "generic";

  // viewBox is 48×48, centered at (24,24); s = 18 gives a comfortable fox
  const s = 18;

  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      className={className}
      style={{ borderRadius: "50%", overflow: "hidden" }}
    >
      {/* Background circle */}
      <circle cx="24" cy="24" r="24" fill={variant === "aari-telegram" ? "#7a3800" : variant === "aari-discord" ? "#3d1205" : "#4a3010"} />
      {/* Fox face, translated to center of viewBox */}
      <g transform="translate(24, 24)">
        <FoxAvatarFace variant={variant} agentId={agentId} s={s} />
      </g>
    </svg>
  );
}
