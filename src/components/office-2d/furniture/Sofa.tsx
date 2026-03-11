import { memo } from "react";

interface SofaProps {
  x: number;
  y: number;
  rotation?: number;
  isDark?: boolean;
}

export const Sofa = memo(function Sofa({ x, y, rotation = 0, isDark = false }: SofaProps) {
  const log = isDark ? "#5a3e28" : "#a07850";
  const logDark = isDark ? "#3d2a1a" : "#8b6b47";
  const bark = isDark ? "#2e1f10" : "#6b4a2a";
  const moss = isDark ? "#4a6630" : "#6b8f47";
  const mossLight = isDark ? "#5a7a3a" : "#82a855";

  return (
    <g transform={`translate(${x}, ${y}) rotate(${rotation})`}>
      {/* Main log body */}
      <rect x={-55} y={-18} width={110} height={36} rx={12} fill={log} stroke={bark} strokeWidth={1.5} />
      {/* Bark end caps (log cross-section feel) */}
      <ellipse cx={-55} cy={0} rx={6} ry={18} fill={logDark} opacity={0.5} />
      <ellipse cx={55} cy={0} rx={6} ry={18} fill={logDark} opacity={0.5} />
      {/* Wood grain lines */}
      <line x1={-46} y1={-8} x2={46} y2={-8} stroke={logDark} strokeWidth={0.7} opacity={0.3} />
      <line x1={-46} y1={0} x2={46} y2={0} stroke={logDark} strokeWidth={0.7} opacity={0.25} />
      <line x1={-46} y1={8} x2={46} y2={8} stroke={logDark} strokeWidth={0.6} opacity={0.2} />
      {/* Moss patches on top */}
      <ellipse cx={-22} cy={-10} rx={12} ry={5} fill={moss} opacity={0.6} />
      <ellipse cx={20} cy={-12} rx={9} ry={4} fill={mossLight} opacity={0.5} />
      <ellipse cx={0} cy={-11} rx={6} ry={3} fill={moss} opacity={0.4} />
    </g>
  );
});
