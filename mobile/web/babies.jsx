/* global React */
/* Cute SVG illustrations: baby in womb (pregnancy) + 3-month baby (postpartum)
   Both with gentle animations (heart pulse, kick, breath, wiggle, smile sparkle). */

/* ------------------------------------------------------------
   WombBaby — uses the user-supplied image, gently floating
   ------------------------------------------------------------ */
const WombBaby = ({ size = 180, week = 34 }) => (
  <div
    style={{
      position: 'relative',
      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
    }}
  >
    <div style={{
      width: size, height: size, position: 'relative',
      display: 'grid', placeItems: 'center',
    }}>
      <img
        src="baby-34w.png"
        alt="Baby at week 34"
        style={{
          width: size, height: size,
          objectFit: 'contain',
          animation: 'baby-float-img 9000ms ease-in-out infinite',
          transformOrigin: 'center',
        }}
      />
    </div>

    <span style={{
      fontFamily: 'DM Sans, sans-serif',
      fontSize: 9.5, letterSpacing: '0.22em',
      textTransform: 'uppercase',
      color: '#9A573D', fontWeight: 600,
    }}>WEEK {week}</span>
  </div>
);

/* ------------------------------------------------------------
   HappyBaby — chubby 3-month-old baby, smiling, healthy glow
   ------------------------------------------------------------ */
const HappyBaby = ({ size = 180, name = 'Baby' }) => (
  <div
    style={{
      width: size, height: size, position: 'relative',
      display: 'grid', placeItems: 'center',
      filter: 'drop-shadow(0 10px 24px rgba(196, 218, 200, 0.4))',
    }}
  >
    <svg viewBox="0 0 200 200" width={size} height={size} style={{ display: 'block', overflow: 'visible' }}>
      <defs>
        <radialGradient id="halo-grad" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%"   stopColor="#D4E8DC" stopOpacity="0.85" />
          <stop offset="55%"  stopColor="#E4D4EB" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F2C5A8" stopOpacity="0.0"  />
        </radialGradient>
        <radialGradient id="baby2-skin" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%"   stopColor="#FFE0CB" />
          <stop offset="100%" stopColor="#F3B891" />
        </radialGradient>
        <radialGradient id="onesie-grad" cx="0.5" cy="0.3" r="0.7">
          <stop offset="0%"   stopColor="#E4D4EB" />
          <stop offset="100%" stopColor="#BFA8D6" />
        </radialGradient>
      </defs>

      {/* Soft pastel halo */}
      <circle cx="100" cy="100" r="92" fill="url(#halo-grad)" style={{
        transformOrigin: '100px 100px',
        animation: 'halo-pulse 4500ms ease-in-out infinite',
      }} />

      {/* Twinkling sparkles */}
      <g>
        <Sparkle x={42}  y={62}  delay={0}    />
        <Sparkle x={158} y={68}  delay={650}  />
        <Sparkle x={170} y={138} delay={1300} />
        <Sparkle x={38}  y={144} delay={1900} />
      </g>

      {/* Onesie body */}
      <g style={{
        transformOrigin: '100px 156px',
        animation: 'baby-wiggle 3800ms ease-in-out infinite',
      }}>
        <path
          d="M 64 168 Q 64 134, 100 134 Q 136 134, 136 168 Q 136 188, 100 188 Q 64 188, 64 168 Z"
          fill="url(#onesie-grad)"
        />
        {/* Star on onesie */}
        <path d="M 100 156 L 102 162 L 108 162 L 103 166 L 105 172 L 100 168 L 95 172 L 97 166 L 92 162 L 98 162 Z"
          fill="#FFFFFF" opacity="0.8" />
        {/* Tiny waving arm */}
        <g style={{
          transformOrigin: '70px 152px',
          animation: 'arm-wave 2400ms ease-in-out infinite',
        }}>
          <ellipse cx="60" cy="148" rx="9" ry="14" fill="url(#baby2-skin)" transform="rotate(-25 60 148)" />
        </g>
        {/* Other arm relaxed */}
        <ellipse cx="140" cy="148" rx="9" ry="14" fill="url(#baby2-skin)" transform="rotate(20 140 148)" />
      </g>

      {/* Head with gentle bob */}
      <g style={{
        transformOrigin: '100px 92px',
        animation: 'baby-bob 4200ms ease-in-out infinite',
      }}>
        {/* Head */}
        <circle cx="100" cy="92" r="46" fill="url(#baby2-skin)" />
        {/* Ear */}
        <ellipse cx="56" cy="92" rx="5" ry="7"  fill="url(#baby2-skin)" />
        <ellipse cx="144" cy="92" rx="5" ry="7" fill="url(#baby2-skin)" />
        {/* Hair tuft */}
        <path
          d="M 88 52 Q 92 44 98 50 Q 102 44 108 50 Q 114 46 116 56"
          stroke="#7B5447" strokeWidth="3.5" fill="none" strokeLinecap="round"
        />
        {/* Cheek blush */}
        <ellipse cx="74" cy="100" rx="9" ry="6" fill="#F4A3A8" opacity="0.55" />
        <ellipse cx="126" cy="100" rx="9" ry="6" fill="#F4A3A8" opacity="0.55" />
        {/* Eyes — closed-curve smiley arcs */}
        <g style={{
          transformOrigin: '100px 90px',
          animation: 'blink 5200ms ease-in-out infinite',
        }}>
          <path d="M 78 88 Q 84 80 90 88"   stroke="#3A2418" strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <path d="M 110 88 Q 116 80 122 88" stroke="#3A2418" strokeWidth="2.8" fill="none" strokeLinecap="round" />
        </g>
        {/* Eye sparkle */}
        <circle cx="86" cy="84" r="1.2" fill="#FFFFFF" opacity="0.95" />
        <circle cx="118" cy="84" r="1.2" fill="#FFFFFF" opacity="0.95" />
        {/* Smile */}
        <path d="M 90 108 Q 100 118 110 108" stroke="#A85A5A" strokeWidth="2.4" fill="none" strokeLinecap="round" />
        {/* Tongue hint */}
        <path d="M 96 112 Q 100 116 104 112" stroke="#E16374" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.7" />
      </g>

      {/* Heart pulse */}
      <g style={{
        transformOrigin: '156px 56px',
        animation: 'heart-beat 1300ms ease-in-out infinite',
      }}>
        <path d="M 156 50 C 150 44, 142 50, 156 62 C 170 50, 162 44, 156 50 Z"
          fill="#E16374" opacity="0.85" />
      </g>

      <text x="100" y="200" textAnchor="middle"
        fontFamily="DM Sans, sans-serif" fontSize="9.5"
        letterSpacing="2.2" fill="#5B7A66" fontWeight="600">
        {name.toUpperCase()} {'\u00B7'} HEALTHY
      </text>
    </svg>
  </div>
);

const Sparkle = ({ x, y, delay }) => (
  <g style={{
    transformOrigin: `${x}px ${y}px`,
    animation: `sparkle 3200ms ease-in-out ${delay}ms infinite`,
  }}>
    <path
      d={`M ${x} ${y - 5} L ${x + 1.5} ${y - 1.5} L ${x + 5} ${y} L ${x + 1.5} ${y + 1.5} L ${x} ${y + 5} L ${x - 1.5} ${y + 1.5} L ${x - 5} ${y} L ${x - 1.5} ${y - 1.5} Z`}
      fill="#C4A6D6"
    />
  </g>
);

/* Personas */
const PersonaIllustration = ({ persona, size }) => {
  if (persona === 'maria') return <WombBaby size={size} week={34} />;
  if (persona === 'jane')  return <HappyBaby size={size} name="Lila" />;
  return null;
};

window.WombBaby = WombBaby;
window.HappyBaby = HappyBaby;
window.PersonaIllustration = PersonaIllustration;
