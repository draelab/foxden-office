import { memo } from "react";

interface ChairProps {
  x: number;
  y: number;
  isDark?: boolean;
}

export const Chair = memo(function Chair({ x, y, isDark = false }: ChairProps) {
  const top = isDark ? "#5a3e28" : "#8b6b47";
  const mid = isDark ? "#4a3020" : "#a07850";
  const moss = isDark ? "#4a6630" : "#6b8f47";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Log stump — top-down view */}
      <circle r={14} fill={mid} />
      {/* Bark ring */}
      <circle r={14} fill="none" stroke={top} strokeWidth={2} opacity={0.7} />
      {/* Inner heartwood ring */}
      <circle r={9} fill="none" stroke={top} strokeWidth={1} opacity={0.5} />
      <circle r={5} fill="none" stroke={top} strokeWidth={0.8} opacity={0.35} />
      {/* Moss patch */}
      <ellipse cx={-4} cy={-5} rx={5} ry={4} fill={moss} opacity={0.55} />
    </g>
  );
});
