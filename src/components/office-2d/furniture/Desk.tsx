import { memo } from "react";

interface DeskProps {
  x: number;
  y: number;
  isDark?: boolean;
}

export const Desk = memo(function Desk({ x, y, isDark = false }: DeskProps) {
  const wood = isDark ? "#5a3e28" : "#a07850";
  const woodDark = isDark ? "#3d2a1a" : "#8b6b47";
  const woodLight = isDark ? "#6b4f33" : "#b8906a";
  const bark = isDark ? "#2e1f10" : "#6b4a2a";

  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Log desk surface — flat top view */}
      <rect x={-50} y={-6} width={100} height={60} rx={8} fill={wood} stroke={bark} strokeWidth={1.5} />
      {/* Wood grain lines */}
      <line x1={-42} y1={10} x2={42} y2={10} stroke={woodDark} strokeWidth={0.7} opacity={0.4} />
      <line x1={-44} y1={20} x2={44} y2={20} stroke={woodDark} strokeWidth={0.7} opacity={0.3} />
      <line x1={-42} y1={30} x2={42} y2={30} stroke={woodLight} strokeWidth={0.5} opacity={0.3} />
      <line x1={-40} y1={40} x2={40} y2={40} stroke={woodDark} strokeWidth={0.6} opacity={0.25} />
      {/* Knot detail */}
      <ellipse cx={18} cy={22} rx={5} ry={3} fill="none" stroke={bark} strokeWidth={0.8} opacity={0.35} />
      {/* Bark front edge */}
      <path d="M -50 54 L -50 60 Q -50 66 -44 66 L 44 66 Q 50 66 50 60 L 50 54" fill={bark} opacity={0.5} />
      {/* Small stone/acorn prop */}
      <ellipse cx={-28} cy={18} rx={5} ry={4} fill={woodDark} opacity={0.45} />
      <ellipse cx={-28} cy={16} rx={4} ry={2.5} fill={woodLight} opacity={0.35} />
    </g>
  );
});
