/* global React */
/* Phone chrome: status bar, bottom nav, sheet header, screen transitions */

const StatusBar = () => (
  <div className="status-bar">
    <span className="time">9:41</span>
    <div style={{ width: 110 }} />
    <div className="status-glyphs">
      {/* signal */}
      <svg width="17" height="11" viewBox="0 0 17 11" fill="none">
        <rect x="0"  y="7" width="3" height="4" rx="0.5" fill="currentColor" />
        <rect x="4"  y="5" width="3" height="6" rx="0.5" fill="currentColor" />
        <rect x="8"  y="3" width="3" height="8" rx="0.5" fill="currentColor" />
        <rect x="12" y="0" width="3" height="11" rx="0.5" fill="currentColor" />
      </svg>
      {/* wifi */}
      <svg width="15" height="11" viewBox="0 0 15 11" fill="none">
        <path d="M7.5 10.3 L9.5 8.3 A2.8 2.8 0 0 0 5.5 8.3 Z" fill="currentColor" />
        <path d="M7.5 6.5 A5.5 5.5 0 0 0 3.5 8.5 L4.5 9.5 A4 4 0 0 1 10.5 9.5 L11.5 8.5 A5.5 5.5 0 0 0 7.5 6.5 Z" fill="currentColor" opacity="0.6"/>
        <path d="M7.5 3 A9.5 9.5 0 0 0 0.5 6 L1.5 7 A8 8 0 0 1 13.5 7 L14.5 6 A9.5 9.5 0 0 0 7.5 3 Z" fill="currentColor" opacity="0.35"/>
      </svg>
      {/* battery */}
      <svg width="25" height="11" viewBox="0 0 25 11" fill="none">
        <rect x="0.5" y="0.5" width="21" height="10" rx="2.5" stroke="currentColor" strokeOpacity="0.5" />
        <rect x="2"   y="2"   width="13" height="7"  rx="1" fill="currentColor" />
        <rect x="22"  y="3.5" width="1.5" height="4"  rx="0.5" fill="currentColor" opacity="0.5" />
      </svg>
    </div>
  </div>
);

const BottomNav = ({ current, onNavigate, direction }) => {
  const items = [
    { id: 'home',       label: 'Home' },
    { id: 'care-plan',  label: 'Care' },
    { id: 'companion',  label: 'Companion' },
    { id: 'meetings',   label: 'Visits' },
  ];
  return (
    <nav className="bottom-nav">
      {items.map(it => (
        <button
          key={it.id}
          className={`nav-item ${current === it.id ? 'active' : ''}`}
          onClick={() => onNavigate(it.id)}
        >
          <NavIcon name={it.id} active={current === it.id} direction={direction} />
          <span className="nav-label">{it.label}</span>
        </button>
      ))}
    </nav>
  );
};

const NavIcon = ({ name, active, direction }) => {
  const stroke = 'currentColor';
  const sw = active ? 1.8 : 1.5;
  const s = 22;
  if (name === 'home') {
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <path d="M3.5 9.5 L11 3.5 L18.5 9.5 V18 H3.5 Z" stroke={stroke} strokeWidth={sw} strokeLinejoin="round" />
      </svg>
    );
  }
  if (name === 'care-plan') {
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <rect x="4.5" y="3.5" width="13" height="15" rx="2" stroke={stroke} strokeWidth={sw} />
        <line x1="7"  y1="8"   x2="15" y2="8"   stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="7"  y1="11.5" x2="15" y2="11.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="7"  y1="15"  x2="12" y2="15"  stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }
  if (name === 'companion') {
    // Direction-aware: orb / sundial / aurora glyph
    if (direction === 'almanac') {
      return (
        <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
          <circle cx="11" cy="11" r="7.5" stroke={stroke} strokeWidth={sw} />
          <line x1="11" y1="3.5" x2="11" y2="5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
          <line x1="11" y1="11" x2="14.5" y2="11" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        </svg>
      );
    }
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="8"   stroke={stroke} strokeWidth={sw} opacity="0.55" />
        <circle cx="11" cy="11" r="5"   stroke={stroke} strokeWidth={sw} opacity="0.85" />
        <circle cx="11" cy="11" r="2.2" fill={stroke} />
      </svg>
    );
  }
  if (name === 'profile') {
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="3.5" stroke={stroke} strokeWidth={sw} />
        <path d="M4 18.5 Q 11 13 18 18.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" fill="none" />
      </svg>
    );
  }
  if (name === 'meetings') {
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <rect x="3.5" y="5" width="15" height="13.5" rx="2" stroke={stroke} strokeWidth={sw} />
        <line x1="3.5" y1="9" x2="18.5" y2="9" stroke={stroke} strokeWidth={sw} />
        <line x1="7"  y1="3.5" x2="7"  y2="6.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <line x1="15" y1="3.5" x2="15" y2="6.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
        <circle cx="11" cy="13" r="1.6" fill={stroke} />
      </svg>
    );
  }
  if (name === 'inbox') {
    return (
      <svg width={s} height={s} viewBox="0 0 22 22" fill="none">
        <path d="M3.5 6 V16 A1.5 1.5 0 0 0 5 17.5 H17 A1.5 1.5 0 0 0 18.5 16 V6 A1.5 1.5 0 0 0 17 4.5 H5 A1.5 1.5 0 0 0 3.5 6 Z" stroke={stroke} strokeWidth={sw} />
        <path d="M3.5 6.5 L11 12 L18.5 6.5" stroke={stroke} strokeWidth={sw} strokeLinecap="round" />
      </svg>
    );
  }
  return null;
};

const SheetHeader = ({ title, onClose, direction }) => (
  <div style={{
    padding: '4px 22px 12px',
    borderBottom: '1px solid var(--hairline-soft)',
    flexShrink: 0,
  }}>
    <div style={{
      width: 38, height: 4, borderRadius: 2,
      background: 'var(--hairline)',
      margin: '0 auto 10px',
    }} />
    <div className="row center between">
      <div style={{ width: 50 }} />
      <span style={{
        fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)',
      }}>{title}</span>
      <button
        onClick={onClose}
        style={{
          fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13,
          color: 'var(--text-muted)', width: 50, textAlign: 'right',
        }}
      >Close</button>
    </div>
  </div>
);

/* Top back-bar (sub screens) */
const TopBar = ({ title, onBack, right, direction }) => (
  <div style={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    padding: '6px 18px 10px',
    flexShrink: 0,
  }}>
    <button
      onClick={onBack}
      style={{
        display: 'flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--sans)', fontWeight: 500, fontSize: 13,
        color: 'var(--text-muted)',
      }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M10 3.5 L5.5 8 L10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Back
    </button>
    {title && (
      <span style={{
        fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13,
        color: 'var(--text)',
        letterSpacing: '0.01em',
      }}>{title}</span>
    )}
    <div style={{ minWidth: 50, textAlign: 'right' }}>{right}</div>
  </div>
);

window.StatusBar = StatusBar;
window.BottomNav = BottomNav;
window.SheetHeader = SheetHeader;
window.TopBar = TopBar;
