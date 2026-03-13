# FoxDen 3D Asset Plan

*Created: 2026-03-12 | Status: Planning*

---

## Current State

**Stack:** React Three Fiber + Three.js (drei, postprocessing)  
**Geometry:** All procedural — Three.js primitives (boxes, cylinders, etc.)  
**No GLB imports** — everything built in code  
**Room names:** Already fox-themed (The Burrow, The Warren, The Clearing, The Den)  
**Colors/config:** Shared between 2D map and 3D view — edits propagate automatically

---

## Direction: Two-Phase Approach

### Phase 1: Palette & Lighting Pass (Pure Code)

**Goal:** Establish fox den warmth without adding external dependencies

**Color palette:**
- Walls: Warm amber/terracotta tones (replacing generic office gray)
- Floors: Dark wood/walnut browns
- Accents: Copper, burnt orange, forest green
- Lighting: Warm point lights (2700K-3000K feel), soft shadows

**Lighting changes:**
- Replace harsh office lighting with cozy ambient + warm spots
- Add subtle glow effects around key areas (fireplace spots, desk lamps)
- Consider time-of-day cycle (optional, future)

**Geometry tweaks:**
- Soften hard box edges where possible (bevels, rounded corners)
- More organic shapes for furniture (less corporate cubicle, more cozy cabin)
- Add procedural clutter: books, mugs, plants with more character

**Why this first:** No new dependencies, fast iteration, establishes the visual language before committing to custom assets.

---

### Phase 2: GLB Accent Pieces

**Goal:** Add personality with curated 3D models

**Candidates for GLB imports:**
- Fox figurine/statue (AARI mascot)
- Fireplace (for The Den — centerpiece)
- Bookshelves with character
- Cozy furniture: armchair, rug, floor cushions
- Decorative: lanterns, candles, nature elements (branches, stones)

**Sources (free/open):**
- **Sketchfab** — huge library, filter by "low poly" + license
- **Poly Haven** — CC0 assets, high quality
- **Quaternius** — free low-poly packs, stylized aesthetic
- **Kenney Assets** — game-ready, consistent style

**Loading pattern:**
```tsx
import { useGLTF } from '@react-three/drei'

function FoxStatue() {
  const { scene } = useGLTF('/models/fox-statue.glb')
  return <primitive object={scene} />
}
```

**Asset prep workflow:**
1. Download from source
2. Optimize in Blender if needed (decimate, bake textures)
3. Export as `.glb` (binary, smaller than .gltf)
4. Place in `public/models/`
5. Load with `useGLTF`, preload for perf

---

## Spline Option (Alternative/Complement)

**What it is:** Browser-based 3D design tool with native React Three Fiber export

**Pros:**
- No Blender skills needed
- Design directly in browser, real-time preview
- Export to R3F code or `.splinecode` runtime
- Great for stylized/illustrative 3D (fits fox den aesthetic)
- Free tier is generous

**Cons:**
- Less control than Blender for detailed modeling
- Runtime dependency if using `.splinecode` (adds ~200KB)
- Style is opinionated — works great for some looks, not all

**Best use case:** 
- Quickly prototype room layouts and accent pieces
- Design custom stylized objects (fox character, furniture)
- Iterate on aesthetic before committing to Blender pipeline

**Integration:**
```bash
npm install @splinetool/react-spline
```
```tsx
import Spline from '@splinetool/react-spline'

// Option 1: Spline runtime
<Spline scene="https://prod.spline.design/xxxxx/scene.splinecode" />

// Option 2: Export to GLB from Spline, load normally
const { scene } = useGLTF('/models/spline-export.glb')
```

**Recommendation:** Use Spline for rapid prototyping and simple accent pieces. For complex/detailed models, export to GLB and load traditionally (avoids runtime dependency).

---

## Blender MCP Integration (Future)

**AP Todo:** "Blender MCP for 2438 ship design" — lower priority but relevant here

**When it makes sense:**
- Custom branded assets (AARI-specific fox design)
- Procedural generation (many variations from templates)
- Complex modeling beyond Spline's capabilities
- 2438 ship models (original use case)

**How it would work:**
1. Install Blender MCP server via mcporter
2. Send modeling commands programmatically
3. Export GLB automatically
4. Hot-reload into FoxDen

**Not needed for Phase 1 or basic Phase 2** — this is for when we want AI-generated custom 3D assets at scale.

---

## Recommended Execution Order

1. **Today/Soon:** Phase 1 palette pass — warm colors, cozy lighting (code only)
2. **When Phase 1 feels right:** Curate 2-3 GLB accent pieces from Sketchfab/Poly Haven
3. **Optional:** Try Spline for a custom piece (fox statue?)
4. **Later:** Blender MCP if we want procedural/AI-generated assets

---

## Reference Links

- [Spline](https://spline.design/) — browser 3D design
- [Sketchfab](https://sketchfab.com/) — 3D model marketplace (filter: downloadable, free)
- [Poly Haven](https://polyhaven.com/) — CC0 models, textures, HDRIs
- [Quaternius](https://quaternius.com/) — free low-poly game assets
- [drei useGLTF docs](https://github.com/pmndrs/drei#usegltf)
- [R3F + Spline guide](https://docs.spline.design/react-three-fiber)

---

## Notes

- The 2D map and 3D view share config — color/name changes propagate automatically ✅
- Current room names (Burrow, Warren, Clearing, Den) are already on-brand
- No rush on Blender MCP — that's a bigger lift for a specific use case
- Keep asset count low initially — performance matters for the office view

---

*Last updated: 2026-03-12 by AARI 🦊*
