import { memo } from "react";

interface PlantProps {
  x: number;
  y: number;
}

export const Plant = memo(function Plant({ x, y }: PlantProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Mushroom cluster — 3 mushrooms */}
      {/* Back-left mushroom (smaller) */}
      <rect x={-12} y={-4} width={5} height={10} rx={1} fill="#c4956a" opacity={0.8} />
      <ellipse cx={-9.5} cy={-5} rx={9} ry={5} fill="#c0392b" opacity={0.85} />
      <ellipse cx={-9.5} cy={-4} rx={6} ry={2} fill="#e8b4a0" opacity={0.4} />

      {/* Back-right mushroom (medium) */}
      <rect x={6} y={-6} width={5} height={12} rx={1} fill="#c4956a" opacity={0.8} />
      <ellipse cx={8.5} cy={-7} rx={10} ry={6} fill="#a93226" opacity={0.85} />
      <ellipse cx={8.5} cy={-6} rx={7} ry={2.5} fill="#e8b4a0" opacity={0.4} />

      {/* Front center mushroom (tallest) */}
      <rect x={-3} y={-2} width={6} height={14} rx={1.5} fill="#d4a870" />
      <ellipse cx={0} cy={-3} rx={13} ry={7} fill="#e74c3c" />
      {/* White spots */}
      <circle cx={-4} cy={-4} r={2} fill="white" opacity={0.7} />
      <circle cx={4} cy={-2} r={1.5} fill="white" opacity={0.6} />
      <circle cx={0} cy={-6} r={1.2} fill="white" opacity={0.55} />
      {/* Cap underside rim */}
      <ellipse cx={0} cy={-1} rx={10} ry={3} fill="#e8b4a0" opacity={0.45} />
    </g>
  );
});
