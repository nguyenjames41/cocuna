/* global React */
/* Motifs: BreathingOrb (Atrium) · Sundial (Almanac) · Aurora (Aurora) */

const Motif = ({ direction, size = 100, label, entrance = false }) => {
  const style = { width: size, height: size };
  if (direction === 'almanac') {
    const radius = size / 2 - 8;
    return (
      <div className="motif motif-sundial" style={style}>
        <div className="ring-outer" />
        {[...Array(24)].map((_, i) => {
          const isMajor = i % 6 === 0;
          const isMid   = i % 3 === 0;
          const tickH = isMajor ? 12 : isMid ? 6 : 3;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: 'calc(50% - 0.5px)',
                top: `calc(50% - ${tickH / 2}px)`,
                width: 1, height: tickH,
                background: 'currentColor',
                opacity: isMajor ? 0.9 : isMid ? 0.55 : 0.28,
                transformOrigin: '50% 50%',
                transform: `rotate(${i * 15}deg) translateY(-${radius - tickH / 2}px)`,
              }}
            />
          );
        })}
        <div className="center-mark">
          {label && <span className="small">{label.eyebrow}</span>}
          {label?.value || ''}
        </div>
      </div>
    );
  }
  if (direction === 'aurora') {
    return (
      <div className={`motif motif-aurora ${entrance ? 'aurora-enter' : ''}`} style={style}>
        <div className="aurora-halo blob-1" />
        <div className="aurora-halo blob-2" />
        {entrance && (
          <>
            <div className="aurora-ripple ripple-1" />
            <div className="aurora-ripple ripple-2" />
            <div className="aurora-ripple ripple-3" />
          </>
        )}
        <img className="cocuna-logo" src="logo-symbol.png" alt="Cocuna" />
      </div>
    );
  }
  // atrium (default)
  return (
    <div className="motif motif-orb" style={style}>
      <div className="ring ring-1" />
      <div className="ring ring-2" />
      <div className="ring ring-3" />
      <div className="core" />
    </div>
  );
};

/* Smaller inline motif used in chat bubbles, etc. */
const MotifGlyph = ({ direction, size = 22 }) => {
  if (direction === 'almanac') {
    return (
      <div
        style={{
          width: size, height: size,
          borderRadius: '50%',
          border: '1px solid currentColor',
          position: 'relative',
          flexShrink: 0,
        }}
      >
        <div style={{
          position: 'absolute', left: '50%', top: 2,
          width: 1, height: 5,
          background: 'currentColor', transform: 'translateX(-50%)',
        }} />
      </div>
    );
  }
  if (direction === 'aurora') {
    return (
      <img
        src="logo-symbol.png"
        alt="Cocuna"
        style={{
          width: size, height: size,
          flexShrink: 0,
          objectFit: 'contain',
          animation: 'breathe-soft 4500ms ease-in-out infinite',
          filter: 'drop-shadow(0 2px 6px rgba(196, 166, 214, 0.35))',
        }}
      />
    );
  }
  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%',
        background: 'radial-gradient(circle at 35% 30%, var(--accent-soft), var(--accent) 80%)',
        flexShrink: 0,
      }}
    />
  );
};

window.Motif = Motif;
window.MotifGlyph = MotifGlyph;
