import { memo } from "react";

interface CoffeeCupProps {
  x: number;
  y: number;
}

export const CoffeeCup = memo(function CoffeeCup({ x, y }: CoffeeCupProps) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      {/* Acorn — top-down view */}
      {/* Cap (cupule) */}
      <ellipse cx={0} cy={-3} rx={7} ry={5} fill="#8b6b47" />
      {/* Cap texture bumps */}
      <ellipse cx={-2} cy={-4} rx={2} ry={1.5} fill="#6b4a2a" opacity={0.4} />
      <ellipse cx={2} cy={-3} rx={2} ry={1.5} fill="#6b4a2a" opacity={0.3} />
      {/* Nut body */}
      <ellipse cx={0} cy={3} rx={6} ry={7} fill="#c4956a" />
      {/* Nut highlight */}
      <ellipse cx={-1.5} cy={1} rx={2.5} ry={3} fill="#d4a870" opacity={0.5} />
      {/* Stem */}
      <line x1={0} y1={-7} x2={0} y2={-10} stroke="#6b4a2a" strokeWidth={1.2} strokeLinecap="round" />
    </g>
  );
});
