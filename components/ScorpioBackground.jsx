import { useMemo } from "react";

/**
 * ScorpioBackground
 * Dark mode na background na may Scorpio constellation sa gitna.
 *
 * Gamit:
 *   <ScorpioBackground>
 *     <YourContent />
 *   </ScorpioBackground>
 *
 * Props:
 *   - children: content na lalabas sa ibabaw ng background
 *   - starCount: dami ng maliliit na bituin sa background (default 90)
 *   - showLabel: ipakita ang "Scorpio" na label sa baba (default false)
 *   - constellationOpacity: 0-1, lakas ng fade ng constellation (default 0.15)
 *   - color: kulay ng constellation (default "#7fb2ff")
 *   - scale: laki ng constellation (default 1.25)
 *   - offsetX / offsetY: ilipat ang constellation, sa px (default 0)
 *   - animated: true para may twinkle/fade na animation (default false)
 */

// Coordinates ng mga bituin (viewBox 0 0 368 563, base sa reference image)
const STARS = [
  { id: "claw1", x: 245, y: 160, r: 4.5 },
  { id: "claw2", x: 268, y: 171, r: 6.5 },
  { id: "head", x: 273, y: 193, r: 5 },
  { id: "claw3", x: 275, y: 225, r: 4 },
  { id: "claw4", x: 275, y: 247, r: 4 },
  { id: "b1", x: 234, y: 213, r: 3.5 },
  { id: "antares", x: 217, y: 220, r: 7 },
  { id: "b2", x: 205, y: 235, r: 3.5 },
  { id: "body1", x: 180, y: 287, r: 5.5 },
  { id: "body2", x: 176, y: 316, r: 7 },
  { id: "tail1", x: 172, y: 350, r: 4.5 },
  { id: "tail2", x: 145, y: 358, r: 6.5 },
  { id: "tail3", x: 105, y: 359, r: 5 },
  { id: "tail4", x: 88, y: 340, r: 4 },
  { id: "tail5", x: 97, y: 327, r: 6 },
  { id: "sting1", x: 80, y: 313, r: 5 },
  { id: "sting2", x: 105, y: 308, r: 5 },
  { id: "sting3", x: 112, y: 311, r: 4 },
];

// Mga linya na nag-uugnay sa mga bituin (by id)
const LINES = [
  ["claw1", "claw2"],
  ["claw2", "head"],
  ["head", "claw3"],
  ["claw3", "claw4"],
  ["head", "b1"],
  ["b1", "antares"],
  ["antares", "b2"],
  ["b2", "body1"],
  ["body1", "body2"],
  ["body2", "tail1"],
  ["tail1", "tail2"],
  ["tail2", "tail3"],
  ["tail3", "tail4"],
  ["tail4", "tail5"],
  ["tail5", "sting1"],
  ["tail5", "sting2"],
  ["sting2", "sting3"],
];

const byId = Object.fromEntries(STARS.map((s) => [s.id, s]));

// Seeded random para hindi nagbabago ang posisyon ng mga bituin kada render
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ScorpioBackground({
  children = null,
  starCount = 90,
  showLabel = false,
  constellationOpacity = 0.15, // 0 - 1, mas mababa = mas fade
  color = "#7fb2ff", // kulay ng constellation (bituin, linya, glow)
  scale = 1.25, // laki ng constellation (1 = default)
  offsetX = 0, // ilipat pakaliwa(-) / pakanan(+), sa px
  offsetY = 0, // ilipat pataas(-) / pababa(+), sa px
  animated = false, // true = may twinkle/fade na animation
}) {
  const bgStars = useMemo(() => {
    const rand = mulberry32(2026);
    return Array.from({ length: starCount }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 1 + rand() * 2.2,
      opacity: 0.12 + rand() * 0.35,
      delay: rand() * 6,
      duration: 3 + rand() * 4,
    }));
  }, [starCount]);

  return (
    <div className={`scorpio-bg${animated ? "" : " scorpio-bg--still"}`}>
      <style>{css}</style>

      {/* Maliliit na bituin sa background */}
      <div className="scorpio-bg__field" aria-hidden="true">
        {bgStars.map((s) => (
          <span
            key={s.id}
            className="scorpio-bg__dot"
            style={{
              left: `${s.left}%`,
              top: `${s.top}%`,
              width: s.size,
              height: s.size,
              opacity: s.opacity,
              animationDelay: `${s.delay}s`,
              animationDuration: `${s.duration}s`,
            }}
          />
        ))}
      </div>

      {/* Scorpio constellation sa gitna */}
      <svg
        className="scorpio-bg__constellation"
        viewBox="0 0 368 563"
        style={{
          opacity: constellationOpacity,
          color,
          transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${scale})`,
        }}
        role="img"
        aria-label="Scorpio constellation"
      >
        <defs>
          <filter id="scorpio-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="scorpio-halo">
            <stop offset="0%" stopColor="currentColor" stopOpacity="0.85" />
            <stop offset="45%" stopColor="currentColor" stopOpacity="0.35" />
            <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#scorpio-glow)">
          {LINES.map(([a, b]) => (
            <line
              key={`${a}-${b}`}
              x1={byId[a].x}
              y1={byId[a].y}
              x2={byId[b].x}
              y2={byId[b].y}
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              opacity="0.7"
            />
          ))}
          {STARS.map((s, i) => (
            <g
              key={s.id}
              className="scorpio-bg__star"
              style={{ animationDelay: `${(i % 6) * 0.5}s` }}
            >
              {/* malabong halo */}
              <circle cx={s.x} cy={s.y} r={s.r * 1.3} fill="url(#scorpio-halo)" />
              {/* bilog na core */}
              <circle cx={s.x} cy={s.y} r={s.r * 0.5} fill="currentColor" />
            </g>
          ))}
        </g>
      </svg>

      {showLabel && <p className="scorpio-bg__label">Scorpio</p>}

      {children && <div className="scorpio-bg__content">{children}</div>}
    </div>
  );
}

const css = `
.scorpio-bg {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow: hidden;
  display: grid;
  place-items: center;
  background:
    radial-gradient(ellipse at 50% 50%, rgba(30, 34, 70, 0.55) 0%, transparent 55%),
    linear-gradient(180deg, #05060d 0%, #07080f 50%, #030408 100%);
  color: #fff;
}

.scorpio-bg__field {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.scorpio-bg__dot {
  position: absolute;
  border-radius: 50%;
  background: #d8dcff;
  animation: scorpio-twinkle ease-in-out infinite;
}

.scorpio-bg__constellation {
  position: absolute;
  top: 50%;
  left: 50%;
  height: min(78vh, 720px);
  width: auto;
  max-width: 90vw;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.scorpio-bg__star {
  transform-box: fill-box;
  transform-origin: center;
  animation: scorpio-pulse 6s ease-in-out infinite;
}

.scorpio-bg__label {
  position: absolute;
  bottom: 6vh;
  left: 0;
  right: 0;
  text-align: center;
  margin: 0;
  font-size: 1rem;
  letter-spacing: 0.3em;
  color: rgba(255, 255, 255, 0.7);
}

.scorpio-bg__content {
  position: relative;
  z-index: 1;
}

@keyframes scorpio-twinkle {
  0%, 100% { transform: scale(1); filter: brightness(1); }
  50% { transform: scale(0.6); filter: brightness(0.6); }
}

@keyframes scorpio-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.55; }
}

.scorpio-bg--still .scorpio-bg__dot,
.scorpio-bg--still .scorpio-bg__star { animation: none; }

@media (prefers-reduced-motion: reduce) {
  .scorpio-bg__dot,
  .scorpio-bg__star { animation: none; }
}
`;
