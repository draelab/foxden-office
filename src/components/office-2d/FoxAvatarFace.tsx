/**
 * FoxAvatarFace — SVG fox face drawn in normalized space.
 *
 * Coordinate system: centered at (0,0), clipped to circle radius (r-2).
 * With AVATAR.radius=20, r-2=18, so faces draw within an ~36px circle.
 * s = half the clipped diameter = r - 2 = 18.
 *
 * Three variants:
 *   "aari-telegram" — warm orange, curious eyes, blue butterfly sparkle (that's me)
 *   "aari-discord"  — deep rust/plum, violet half-lidded eyes, crescent moon (nighttime AARI)
 *   "generic"       — fur/eye color hashed from agentId, neutral expression
 */

export type FoxVariant = "aari-telegram" | "aari-discord" | "generic";

interface FoxConfig {
  furColor: string;
  furShadow: string;      // slightly deeper shade for ear tips / depth
  muzzleColor: string;    // lighter area around snout + cheeks
  innerEarColor: string;  // warm pink inside ears
  eyeColor: string;
  pupilColor: string;
  noseColor: string;
}

// ── AARI telegram: warm amber-orange, curious ────────────────────────────────
const AARI_TELEGRAM: FoxConfig = {
  furColor:      "#e8820c",
  furShadow:     "#7a3800",
  muzzleColor:   "#fef3e2",
  innerEarColor: "#f0a0a0",
  eyeColor:      "#d97706",
  pupilColor:    "#1c0a00",
  noseColor:     "#1c0a00",
};

// ── AARI discord: deep rust + plum tones, night-owl ─────────────────────────
const AARI_DISCORD: FoxConfig = {
  furColor:      "#8b3a0f",
  furShadow:     "#3d1205",
  muzzleColor:   "#e8ddd0",
  innerEarColor: "#c07088",
  eyeColor:      "#7c3aed",
  pupilColor:    "#1a0030",
  noseColor:     "#1a0010",
};

// ── Generic palette pool (hashed from agentId) ───────────────────────────────
const GENERIC_FURS = [
  { fur: "#e8820c", shadow: "#7a3800" },  // classic orange
  { fur: "#c45c0a", shadow: "#6b2e00" },  // deep burnt orange
  { fur: "#d4a20a", shadow: "#7a5400" },  // golden/sandy
  { fur: "#8b3a0f", shadow: "#3d1205" },  // dark rust
  { fur: "#f0940e", shadow: "#8a4400" },  // bright amber
  { fur: "#6b4c2a", shadow: "#2e1a00" },  // brown/tawny
  { fur: "#b84c08", shadow: "#5c2000" },  // red fox
  { fur: "#c8a018", shadow: "#7a5800" },  // blonde/cream fox
];
const GENERIC_EYES = [
  { eye: "#d97706", pupil: "#1c0a00" },  // amber
  { eye: "#059669", pupil: "#001a10" },  // green
  { eye: "#2563eb", pupil: "#000a1c" },  // blue
  { eye: "#7c3aed", pupil: "#1a0030" },  // violet
  { eye: "#dc2626", pupil: "#200000" },  // red
  { eye: "#0891b2", pupil: "#001a20" },  // teal
  { eye: "#65a30d", pupil: "#1a2000" },  // yellow-green
  { eye: "#c2410c", pupil: "#1c0500" },  // copper
];

function hashAgentId(id: string): number {
  let h = 0x811c9dc5; // FNV offset basis — better spread for short sequential strings
  for (let i = 0; i < id.length; i++) {
    h ^= id.charCodeAt(i);
    h = (Math.imul(h, 0x01000193)) >>> 0; // FNV-1a multiply
  }
  return h;
}

function genericConfig(agentId: string): FoxConfig {
  const h = hashAgentId(agentId);
  const fur  = GENERIC_FURS[h % GENERIC_FURS.length];
  const eyes = GENERIC_EYES[((h >>> 8)) % GENERIC_EYES.length];
  return {
    furColor:      fur.fur,
    furShadow:     fur.shadow,
    muzzleColor:   "#fef3e2",
    innerEarColor: "#f0a0a0",
    eyeColor:      eyes.eye,
    pupilColor:    eyes.pupil,
    noseColor:     "#1c0a00",
  };
}

// ── Main component ────────────────────────────────────────────────────────────

interface FoxAvatarFaceProps {
  variant: FoxVariant;
  agentId: string;   // used for generic hashing
  s: number;         // half the clip-circle diameter (= r - 2)
}

export function FoxAvatarFace({ variant, agentId, s }: FoxAvatarFaceProps) {
  const cfg: FoxConfig =
    variant === "aari-telegram" ? AARI_TELEGRAM :
    variant === "aari-discord"  ? AARI_DISCORD  :
    genericConfig(agentId);

  return (
    <g>
      {/* ── Ears (behind head, clipped at top) ── */}
      {/* Left ear outer */}
      <polygon
        points={`${-s * 0.62},${-s * 0.62}  ${-s * 0.28},${-s * 1.08}  ${-s * 0.04},${-s * 0.52}`}
        fill={cfg.furColor}
      />
      {/* Right ear outer */}
      <polygon
        points={`${s * 0.62},${-s * 0.62}  ${s * 0.28},${-s * 1.08}  ${s * 0.04},${-s * 0.52}`}
        fill={cfg.furColor}
      />
      {/* Left ear tip (darker) */}
      <polygon
        points={`${-s * 0.56},${-s * 0.68}  ${-s * 0.28},${-s * 1.04}  ${-s * 0.08},${-s * 0.58}`}
        fill={cfg.furShadow}
        opacity={0.55}
      />
      {/* Right ear tip */}
      <polygon
        points={`${s * 0.56},${-s * 0.68}  ${s * 0.28},${-s * 1.04}  ${s * 0.08},${-s * 0.58}`}
        fill={cfg.furShadow}
        opacity={0.55}
      />
      {/* Left inner ear */}
      <polygon
        points={`${-s * 0.50},${-s * 0.66}  ${-s * 0.28},${-s * 0.96}  ${-s * 0.10},${-s * 0.58}`}
        fill={cfg.innerEarColor}
        opacity={0.75}
      />
      {/* Right inner ear */}
      <polygon
        points={`${s * 0.50},${-s * 0.66}  ${s * 0.28},${-s * 0.96}  ${s * 0.10},${-s * 0.58}`}
        fill={cfg.innerEarColor}
        opacity={0.75}
      />

      {/* ── Head / fur base ── */}
      <ellipse cx={0} cy={s * 0.05} rx={s * 0.86} ry={s * 0.88} fill={cfg.furColor} />

      {/* ── Cheek patches ── */}
      <ellipse cx={-s * 0.42} cy={s * 0.22} rx={s * 0.26} ry={s * 0.19} fill={cfg.muzzleColor} opacity={0.45} />
      <ellipse cx={ s * 0.42} cy={s * 0.22} rx={s * 0.26} ry={s * 0.19} fill={cfg.muzzleColor} opacity={0.45} />

      {/* ── Muzzle ── */}
      <ellipse cx={0} cy={s * 0.48} rx={s * 0.40} ry={s * 0.30} fill={cfg.muzzleColor} />

      {/* ── Eyes ── */}
      {variant === "aari-telegram" ? (
        // Curious: slightly upward angled, larger
        <>
          <ellipse cx={-s * 0.31} cy={-s * 0.10} rx={s * 0.20} ry={s * 0.14}
            fill={cfg.eyeColor}
            transform={`rotate(-8, ${-s * 0.31}, ${-s * 0.10})`}
          />
          <ellipse cx={ s * 0.31} cy={-s * 0.10} rx={s * 0.20} ry={s * 0.14}
            fill={cfg.eyeColor}
            transform={`rotate(8, ${s * 0.31}, ${-s * 0.10})`}
          />
          <circle cx={-s * 0.31} cy={-s * 0.10} r={s * 0.09} fill={cfg.pupilColor} />
          <circle cx={ s * 0.31} cy={-s * 0.10} r={s * 0.09} fill={cfg.pupilColor} />
          {/* Eye shines */}
          <circle cx={-s * 0.25} cy={-s * 0.15} r={s * 0.05} fill="white" opacity={0.85} />
          <circle cx={ s * 0.37} cy={-s * 0.15} r={s * 0.05} fill="white" opacity={0.85} />
        </>
      ) : variant === "aari-discord" ? (
        // Half-lidded: relaxed, slightly drooped top lid
        <>
          <ellipse cx={-s * 0.31} cy={-s * 0.08} rx={s * 0.20} ry={s * 0.12} fill={cfg.eyeColor} />
          <ellipse cx={ s * 0.31} cy={-s * 0.08} rx={s * 0.20} ry={s * 0.12} fill={cfg.eyeColor} />
          {/* Heavy upper lid */}
          <ellipse cx={-s * 0.31} cy={-s * 0.14} rx={s * 0.20} ry={s * 0.07}
            fill={cfg.furColor} opacity={0.85} />
          <ellipse cx={ s * 0.31} cy={-s * 0.14} rx={s * 0.20} ry={s * 0.07}
            fill={cfg.furColor} opacity={0.85} />
          <circle cx={-s * 0.31} cy={-s * 0.08} r={s * 0.07} fill={cfg.pupilColor} />
          <circle cx={ s * 0.31} cy={-s * 0.08} r={s * 0.07} fill={cfg.pupilColor} />
          <circle cx={-s * 0.26} cy={-s * 0.12} r={s * 0.04} fill="white" opacity={0.75} />
          <circle cx={ s * 0.36} cy={-s * 0.12} r={s * 0.04} fill="white" opacity={0.75} />
        </>
      ) : (
        // Generic: clean almond eyes
        <>
          <ellipse cx={-s * 0.31} cy={-s * 0.09} rx={s * 0.18} ry={s * 0.13} fill={cfg.eyeColor} />
          <ellipse cx={ s * 0.31} cy={-s * 0.09} rx={s * 0.18} ry={s * 0.13} fill={cfg.eyeColor} />
          <circle cx={-s * 0.31} cy={-s * 0.09} r={s * 0.08} fill={cfg.pupilColor} />
          <circle cx={ s * 0.31} cy={-s * 0.09} r={s * 0.08} fill={cfg.pupilColor} />
          <circle cx={-s * 0.25} cy={-s * 0.13} r={s * 0.04} fill="white" opacity={0.8} />
          <circle cx={ s * 0.37} cy={-s * 0.13} r={s * 0.04} fill="white" opacity={0.8} />
        </>
      )}

      {/* ── Nose ── */}
      <ellipse cx={0} cy={s * 0.30} rx={s * 0.11} ry={s * 0.075} fill={cfg.noseColor} />

      {/* ── Mouth line (subtle) ── */}
      <path
        d={`M ${-s * 0.09},${s * 0.37} Q 0,${s * 0.44} ${s * 0.09},${s * 0.37}`}
        stroke={cfg.noseColor}
        strokeWidth={s * 0.045}
        fill="none"
        strokeLinecap="round"
        opacity={0.5}
      />

      {/* ── Variant extras ── */}
      {variant === "aari-telegram" && (
        // Tiny blue butterfly sparkle near right eye — from my avatar lore
        <g transform={`translate(${s * 0.52}, ${-s * 0.28})`}>
          <circle r={s * 0.10} fill="#3b82f6" opacity={0.88} />
          <circle r={s * 0.05} fill="#bfdbfe" opacity={0.95} />
        </g>
      )}

      {variant === "aari-discord" && (
        // Crescent moon on forehead — nighttime energy
        <path
          d={`M ${-s*0.10},${-s*0.44}
              A ${s*0.15},${s*0.15} 0 1 1 ${s*0.10},${-s*0.44}
              A ${s*0.09},${s*0.09} 0 1 0 ${-s*0.10},${-s*0.44} Z`}
          fill="#c4b5fd"
          opacity={0.65}
        />
      )}
    </g>
  );
}
