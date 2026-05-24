/* global React */
/* Original blob-style mood characters: organic shapes + animated faces.
   One component, parameterized by color + face + idle motion. */

const BLOB_PATHS = [
  // 6 organic blob silhouettes in a 100x100 viewBox, all roughly centered
  "M 50 8 C 70 8 90 22 92 44 C 94 66 80 90 56 92 C 30 94 8 78 8 54 C 8 30 28 8 50 8 Z",
  "M 48 6 C 72 8 94 24 90 50 C 88 72 70 92 46 92 C 22 92 6 72 10 50 C 14 28 28 6 48 6 Z",
  "M 50 10 C 72 8 88 30 88 50 C 88 70 76 92 50 92 C 26 92 10 76 12 52 C 14 28 30 10 50 10 Z",
  "M 52 6 C 76 6 92 28 90 52 C 88 76 68 94 46 90 C 22 86 8 68 10 46 C 12 22 30 6 52 6 Z",
  "M 50 8 C 66 6 84 18 90 38 C 96 60 82 88 58 92 C 36 96 12 84 10 58 C 8 32 30 8 50 8 Z",
  "M 50 4 C 68 4 88 16 92 38 C 96 60 84 88 60 92 C 36 94 14 80 10 56 C 6 30 28 4 50 4 Z",
];

/* Map face id -> SVG content (simple line drawings).
   Faces use viewBox 100x100; placed inside the blob. */
const Face = ({ id }) => {
  const stroke = "#3D2A22";
  const sw = 2;
  const lc = { strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (id) {
    case 'cry':
      // closed eye crying  T_T
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 38 52 L 32 56 M 38 52 L 44 56" />
        <path d="M 56 52 L 50 56 M 56 52 L 62 56" />
        <path d="M 42 64 Q 50 60 58 64" />
      </g>);
    case 'glum':
      // _ _
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <line x1="34" y1="54" x2="44" y2="54" />
        <line x1="56" y1="54" x2="66" y2="54" />
        <path d="M 42 64 Q 50 62 58 64" />
      </g>);
    case 'neutral':
      // - -
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <line x1="36" y1="52" x2="42" y2="52" />
        <line x1="58" y1="52" x2="64" y2="52" />
        <line x1="44" y1="62" x2="56" y2="62" />
      </g>);
    case 'soft':
      // o o gentle small smile
      return (<g {...lc}>
        <circle cx="40" cy="52" r="1.8" fill={stroke} />
        <circle cx="60" cy="52" r="1.8" fill={stroke} />
        <path d="M 42 62 Q 50 66 58 62" fill="none" stroke={stroke} strokeWidth={sw} />
      </g>);
    case 'smile':
      // ◡ ◡ smile
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 36 52 Q 40 48 44 52" />
        <path d="M 56 52 Q 60 48 64 52" />
        <path d="M 40 62 Q 50 70 60 62" />
      </g>);
    case 'beam':
      // >  < beaming joy
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 36 54 L 42 50 L 36 46" />
        <path d="M 64 54 L 58 50 L 64 46" />
        <path d="M 40 62 Q 50 72 60 62" />
        <path d="M 50 64 Q 47 70 50 72 Q 53 70 50 64 Z" fill="#E16374" stroke="none" opacity="0.7" />
      </g>);
    case 'sleepy':
      // closed sleepy lashes
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 34 52 Q 39 56 44 52" />
        <path d="M 56 52 Q 61 56 66 52" />
        <path d="M 44 64 Q 50 66 56 64" />
      </g>);
    case 'dead':
      // x x exhausted
      return (<g stroke={stroke} strokeWidth={sw} {...lc} fill="none">
        <line x1="36" y1="48" x2="44" y2="56" />
        <line x1="44" y1="48" x2="36" y2="56" />
        <line x1="56" y1="48" x2="64" y2="56" />
        <line x1="64" y1="48" x2="56" y2="56" />
        <line x1="42" y1="65" x2="58" y2="65" />
      </g>);
    case 'sparkle':
      // bright eyes with sparkle dots
      return (<g {...lc}>
        <circle cx="40" cy="51" r="2.5" fill={stroke} />
        <circle cx="60" cy="51" r="2.5" fill={stroke} />
        <circle cx="38.5" cy="50" r="0.7" fill="#FFFFFF" />
        <circle cx="58.5" cy="50" r="0.7" fill="#FFFFFF" />
        <path d="M 40 62 Q 50 70 60 62" fill="none" stroke={stroke} strokeWidth={sw} />
        <path d="M 28 38 L 30 42 L 34 40 L 30 44 L 32 48 L 28 44 L 24 46 L 28 42 Z" fill="#FFFFFF" opacity="0.8" />
        <path d="M 70 36 L 72 40 L 76 38 L 72 42 L 74 46 L 70 42 L 66 44 L 70 40 Z" fill="#FFFFFF" opacity="0.8" />
      </g>);
    case 'wince':
      // tense brows, neutral mouth ;_;
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 34 50 L 44 53" />
        <path d="M 66 50 L 56 53" />
        <circle cx="40" cy="56" r="1.6" fill={stroke} />
        <circle cx="60" cy="56" r="1.6" fill={stroke} />
        <line x1="42" y1="66" x2="58" y2="66" />
      </g>);
    case 'ouch':
      // squeezed eyes >_< pain
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 32 48 Q 38 52 44 48" />
        <path d="M 56 48 Q 62 52 68 48" />
        <path d="M 40 64 Q 50 60 60 64" />
        <path d="M 50 64 Q 47 70 50 72 Q 53 70 50 64 Z" fill="#E16374" stroke="none" opacity="0.7" />
      </g>);
    case 'severe':
      // teary, anguished
      return (<g fill="none" stroke={stroke} strokeWidth={sw} {...lc}>
        <path d="M 32 50 Q 38 56 44 50" />
        <path d="M 56 50 Q 62 56 68 50" />
        <circle cx="42" cy="58" r="1.5" fill="#5BA8E0" />
        <circle cx="58" cy="58" r="1.5" fill="#5BA8E0" />
        <path d="M 40 68 Q 50 60 60 68" />
        <path d="M 42 60 Q 41 64 42 66" stroke="#5BA8E0" />
        <path d="M 58 60 Q 57 64 58 66" stroke="#5BA8E0" />
      </g>);
    default:
      return null;
  }
};

const MoodBlob = ({ size = 56, color = '#F3D7DC', face = 'neutral', selected = false, idx = 0 }) => {
  const path = BLOB_PATHS[idx % BLOB_PATHS.length];
  // Stagger animations by index
  const bobDelay = (idx * 0.27) % 1.6;
  const blinkDelay = (idx * 0.7) % 4.5;
  const wobbleDelay = (idx * 0.4) % 2.4;
  return (
    <span style={{
      display: 'inline-block',
      width: size, height: size,
      position: 'relative',
    }}>
      <svg
        viewBox="0 0 100 100"
        width={size} height={size}
        style={{
          display: 'block', overflow: 'visible',
          animation: `mb-bob 2400ms ease-in-out ${bobDelay}s infinite`,
          transformOrigin: 'center',
        }}
      >
        {/* Subtle drop shadow blob */}
        <ellipse cx="50" cy="90" rx="22" ry="3"
          fill="rgba(0,0,0,0.10)"
          style={{
            transformOrigin: 'center',
            animation: `mb-shadow 2400ms ease-in-out ${bobDelay}s infinite`,
          }} />
        {/* Body */}
        <g style={{
          transformOrigin: '50px 55px',
          animation: `mb-wobble 3200ms ease-in-out ${wobbleDelay}s infinite`,
        }}>
          <path d={path} fill={color} />
          {selected && (
            <path d={path} fill="none" stroke={color} strokeOpacity="0.55" strokeWidth="3"
              style={{
                animation: 'mb-pulse 1800ms ease-in-out infinite',
                transformOrigin: '50px 50px',
              }} />
          )}
          {/* Face — blinks via inner clip */}
          <g style={{
            transformOrigin: '50px 56px',
            animation: `mb-blink 4800ms steps(1, end) ${blinkDelay}s infinite`,
          }}>
            <Face id={face} />
          </g>
        </g>
      </svg>
    </span>
  );
};

window.MoodBlob = MoodBlob;
