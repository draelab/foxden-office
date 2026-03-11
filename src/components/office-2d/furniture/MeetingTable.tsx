import { memo } from "react";

interface MeetingTableProps {
  x: number;
  y: number;
  radius?: number;
  isDark?: boolean;
}

export const MeetingTable = memo(function MeetingTable({
  x,
  y,
  radius = 80,
  isDark = false,
}: MeetingTableProps) {
  const gradId = `mt-grad-${x}-${y}`;
  const heartwood = isDark ? "#3d2a1a" : "#c4956a";
  const sapwood = isDark ? "#5a3e28" : "#a07850";
  const bark = isDark ? "#2e1f10" : "#6b4a2a";

  return (
    <g transform={`translate(${x}, ${y})`}>
      <defs>
        <radialGradient id={gradId}>
          <stop offset="0%" stopColor={heartwood} />
          <stop offset="100%" stopColor={sapwood} />
        </radialGradient>
      </defs>
      {/* Tree stump surface */}
      <circle
        r={radius}
        fill={`url(#${gradId})`}
        stroke={bark}
        strokeWidth={2}
        style={{ filter: "drop-shadow(0 3px 8px rgba(0,0,0,0.15))" }}
      />
      {/* Tree rings */}
      <circle r={radius * 0.80} fill="none" stroke={bark} strokeWidth={0.8} opacity={0.25} />
      <circle r={radius * 0.62} fill="none" stroke={bark} strokeWidth={0.8} opacity={0.22} />
      <circle r={radius * 0.45} fill="none" stroke={bark} strokeWidth={0.7} opacity={0.20} />
      <circle r={radius * 0.28} fill="none" stroke={bark} strokeWidth={0.7} opacity={0.18} />
      <circle r={radius * 0.13} fill="none" stroke={bark} strokeWidth={0.6} opacity={0.15} />
      {/* Crack line */}
      <path
        d={`M 0 0 Q ${radius * 0.15} ${radius * -0.1} ${radius * 0.25} ${radius * -0.35}`}
        fill="none"
        stroke={bark}
        strokeWidth={1}
        opacity={0.3}
      />
    </g>
  );
});
