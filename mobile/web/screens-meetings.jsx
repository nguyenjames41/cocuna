/* global React */
/* Two screens:
   - ScreenMeetings: visits hub (upcoming, past, request)
   - ScreenSummary: gentle wellness summary instead of raw BP numbers
*/

const DM = () => window.COCUNA_DATA;
const { SheetHeader: SHM } = window;

/* ============================================================
   MEETINGS / VISITS
   ============================================================ */
const ScreenMeetings = ({ direction, persona, onOpenExpert }) => {
  const data = DM();
  const p = data.PERSONAS[persona];
  const upcoming = p.nextVisit;

  const past = [
    { when: '2 weeks ago', kind: persona === 'maria' ? '32 week check' : 'Two month wellness', clinician: 'Dr. Patel', visitType: 'In person', notes: 'BP within range. Iron looking better.' },
    { when: 'Last month',  kind: persona === 'maria' ? 'Glucose test'   : 'Six week postpartum',  clinician: 'Dr. Patel', visitType: 'In person', notes: 'All within range.' },
    { when: '2 months ago', kind: persona === 'maria' ? 'Anatomy scan'  : 'Lactation visit',      clinician: persona === 'maria' ? 'Dr. Patel' : 'Naomi Okafor', visitType: 'Online', notes: 'Latch + feeding plan reviewed.' },
  ];

  return (
    <div className="screen-body fade-in" key={persona}>
      <div style={{ padding: '14px 24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="eyebrow">Visits</span>
          <h2 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
            lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0,
          }}>What{'\u2019'}s coming up.</h2>
        </header>

        {/* Upcoming */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow">Next visit</span>
          <UpcomingVisitCard visit={upcoming} expert={data.EXPERTS[0]} onOpenExpert={onOpenExpert} />
        </section>

        {/* Add a visit */}
        <button style={{
          padding: 14,
          border: '1px dashed var(--hairline)',
          borderRadius: 'var(--radius-card)',
          background: 'transparent',
          fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-muted)',
          cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          Request a new visit
        </button>

        {/* Past */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow">Past visits</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {past.map((v, i) => (
              <PastVisitCard key={i} visit={v} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

const UpcomingVisitCard = ({ visit, expert, onOpenExpert }) => (
  <div className="card" style={{
    padding: 18,
    background: visit.visitType === 'In person' ? 'var(--accent-mint-soft)' : 'var(--accent-soft)',
    border: 'none',
    display: 'flex', flexDirection: 'column', gap: 14,
  }}>
    <div className="row between center">
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em',
        textTransform: 'uppercase', color: 'var(--text)', opacity: 0.6, fontWeight: 600,
      }}>{visit.when}</span>
      <span style={{
        padding: '4px 10px', background: 'var(--surface)', borderRadius: 999,
        fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, color: 'var(--text)',
        display: 'inline-flex', alignItems: 'center', gap: 5,
      }}>
        {visit.visitType === 'In person' ? (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M5.5 1 C 3.5 1 2 2.5 2 4.5 C 2 7 5.5 10 5.5 10 C 5.5 10 9 7 9 4.5 C 9 2.5 7.5 1 5.5 1 Z" stroke="currentColor" strokeWidth="1" />
            <circle cx="5.5" cy="4.5" r="1.2" fill="currentColor" />
          </svg>
        ) : (
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <rect x="1.5" y="3" width="6" height="5" rx="1" stroke="currentColor" strokeWidth="1" />
            <path d="M7.5 5 L 10 4 V 7 L 7.5 6" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="none" />
          </svg>
        )}
        {visit.visitType}
      </span>
    </div>

    <h3 className="serif" style={{
      fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 22,
      lineHeight: 1.16, letterSpacing: '-0.016em', margin: 0, color: 'var(--text)',
    }}>{visit.kind}</h3>

    <p style={{
      fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.45,
      color: 'var(--text)', opacity: 0.75, margin: 0,
    }}>{visit.location}</p>

    <div className="row between center" style={{
      paddingTop: 12,
      borderTop: '1px solid rgba(42, 39, 35, 0.08)',
    }}>
      <button onClick={() => onOpenExpert && onOpenExpert('patel')} style={{
        display: 'flex', alignItems: 'center', gap: 10,
        background: 'none', border: 'none', cursor: 'pointer', padding: 0, textAlign: 'left',
      }}>
        <div className="expert-avatar" style={{ width: 34, height: 34, fontSize: 13 }}>{expert.initials}</div>
        <div className="col">
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{expert.name}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text)', opacity: 0.6 }}>{expert.cred.split('\u00B7')[0].trim()}</span>
        </div>
      </button>
      <button style={{
        padding: '8px 14px', borderRadius: 999,
        background: 'var(--text)', color: 'var(--bg)',
        fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
        border: 'none', cursor: 'pointer',
      }}>{visit.visitType === 'In person' ? 'Get directions' : 'Join'}</button>
    </div>
  </div>
);

const PastVisitCard = ({ visit }) => (
  <div className="card" style={{
    padding: 14,
    display: 'flex', flexDirection: 'column', gap: 6,
  }}>
    <div className="row center between">
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.16em',
        textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600,
      }}>{visit.when}</span>
      <span style={{
        padding: '3px 8px', background: 'var(--surface-sunk)', borderRadius: 999,
        fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)', fontWeight: 500,
      }}>{visit.visitType}</span>
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>
      {visit.kind}
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
      {visit.clinician} {'\u00B7'} {visit.notes}
    </div>
  </div>
);

/* ============================================================
   SUMMARY — calm, week-progression layout
   ============================================================ */
const ScreenSummary = ({ direction, persona, onClose }) => {
  const p = DM().PERSONAS[persona];
  const isPreg = persona === 'maria';

  // Milestones differ by stage
  const milestones = isPreg
    ? [{ w: 20, label: '20W' }, { w: 24, label: '24W' }, { w: 28, label: '28W' }, { w: 32, label: '32W' }, { w: 36, label: '36W' }, { w: 40, label: '40W' }]
    : [{ w: 0,  label: 'Birth' }, { w: 2, label: '2W' }, { w: 6, label: '6W' }, { w: 12, label: '3M' }, { w: 24, label: '6M' }, { w: 52, label: '1Y' }];
  const currentW = isPreg ? 34 : 12;
  const startW   = milestones[0].w;
  const endW     = milestones[milestones.length - 1].w;
  const progress = Math.max(0, Math.min(1, (currentW - startW) / (endW - startW)));

  // Persona-aware tiles
  const tiles = isPreg ? [
    { tone: 'lavender', label: 'Heart rate',     icon: 'heart',  value: '78',  unit: 'bpm',     mood: 'steady' },
    { tone: 'mint',     label: 'Baby kicks',     icon: 'foot',   value: '14',  unit: 'today',   mood: 'lively' },
    { tone: 'butter',   label: 'Sleep',          icon: 'moon',   value: '7.1', unit: 'hours',   mood: 'restful' },
    { tone: 'peach',    label: 'Hydration',      icon: 'drop',   value: '1.9', unit: 'L',       mood: 'on track' },
  ] : [
    { tone: 'lavender', label: 'Recovery',       icon: 'heart',  value: 'Day', unit: '94',      mood: 'on track' },
    { tone: 'mint',     label: 'Feeding',        icon: 'drop',   value: '8',   unit: 'a day',   mood: 'steady' },
    { tone: 'butter',   label: 'Sleep',          icon: 'moon',   value: '5.4', unit: 'hours',   mood: 'broken' },
    { tone: 'peach',    label: 'Mood',           icon: 'heart',  value: 'A few', unit: 'quiet days', mood: 'gentle' },
  ];

  return (
    <>
      <SHM title="" onClose={onClose} direction={direction} />
      <div className="screen-body fade-in" key={persona}>
        <div style={{ padding: '4px 22px 32px', display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Title row */}
          <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="eyebrow">{isPreg ? 'Pregnancy' : 'Postpartum'} {'\u00B7'} your week</span>
            <h2 className="serif" style={{
              fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
              lineHeight: 1.16, letterSpacing: '-0.018em', margin: 0,
            }}>{isPreg ? 'Mother of one, becoming.' : 'Steady, with Lila.'}</h2>
          </header>

          {/* Progression bar */}
          <div className="card" style={{ padding: 16 }}>
            <div className="row between" style={{ marginBottom: 12 }}>
              {milestones.map(m => (
                <span key={m.label} style={{
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
                  color: m.w === currentW || (m.w <= currentW) ? 'var(--text)' : 'var(--text-faint)',
                  letterSpacing: '0.04em',
                }}>{m.label}</span>
              ))}
            </div>
            <ProgressionBar progress={progress} currentLabel={isPreg ? `W${currentW}` : 'M3'} />
            <div className="row between" style={{ marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
                {isPreg ? `${endW - currentW} weeks to go` : `${52 - currentW} weeks since birth`}
              </span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--triage-green)', fontWeight: 600,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                <span className="triage-dot triage-green" />
                {isPreg ? 'Third trimester' : 'Fourth trimester'}
              </span>
            </div>
          </div>

          {/* Tile grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {tiles.map(t => <SummaryTile key={t.label} {...t} />)}
          </div>

          {/* Calm closing note */}
          <div style={{
            padding: 14,
            borderRadius: 16,
            background: 'var(--surface-sunk)',
            display: 'flex', alignItems: 'flex-start', gap: 12,
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background:
                'radial-gradient(circle at 35% 30%, var(--accent-soft) 0%, var(--accent) 70%, var(--accent-mint) 100%)',
              flexShrink: 0,
              animation: 'breathe-soft 3000ms ease-in-out infinite',
            }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 3 }}>
                {isPreg ? 'You\u2019re doing the work.' : 'You\u2019re doing better than you might feel.'}
              </div>
              <p style={{ fontFamily: 'var(--sans)', fontSize: 11.5, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 }}>
                Hera is watching the numbers in the background. You{'\u2019'}ll hear from us if anything needs you.
              </p>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

const ProgressionBar = ({ progress, currentLabel }) => (
  <div style={{
    position: 'relative',
    height: 22,
    background: 'var(--surface-sunk)',
    borderRadius: 999,
    overflow: 'visible',
  }}>
    {/* fill */}
    <div style={{
      position: 'absolute', left: 0, top: 0, bottom: 0,
      width: `calc(${progress * 100}% - 11px)`,
      borderRadius: 999,
      background: 'linear-gradient(90deg, var(--accent-soft) 0%, var(--accent) 100%)',
    }} />
    {/* track-remaining hatched */}
    <div style={{
      position: 'absolute',
      left: `calc(${progress * 100}% + 11px)`,
      right: 0, top: 0, bottom: 0,
      borderRadius: 999,
      backgroundImage: 'repeating-linear-gradient(135deg, transparent 0 4px, rgba(42, 39, 35, 0.08) 4px 6px)',
    }} />
    {/* current marker */}
    <div style={{
      position: 'absolute',
      left: `${progress * 100}%`,
      top: '50%',
      transform: 'translate(-50%, -50%)',
      width: 38, height: 26,
      borderRadius: 999,
      background: 'var(--text)',
      color: 'var(--bg)',
      display: 'grid', placeItems: 'center',
      fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 700, letterSpacing: '0.04em',
      boxShadow: '0 4px 10px rgba(42, 39, 35, 0.18)',
    }}>{currentLabel}</div>
  </div>
);

const TILE_BG = {
  lavender: 'linear-gradient(135deg, var(--accent-soft) 0%, #C9A8DD 100%)',
  mint:     'linear-gradient(135deg, var(--accent-mint-soft) 0%, var(--accent-mint) 100%)',
  butter:   'linear-gradient(135deg, var(--accent-butter) 0%, #DCC872 100%)',
  peach:    'linear-gradient(135deg, var(--accent-peach) 0%, #E89C72 100%)',
  white:    'var(--surface)',
};

const SummaryTile = ({ tone, label, icon, value, unit, mood }) => {
  const dark = tone !== 'white';
  const fg = dark ? 'rgba(255,255,255,0.95)' : 'var(--text)';
  const fgSoft = dark ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)';
  return (
    <div style={{
      padding: '14px 14px 16px',
      borderRadius: 18,
      background: TILE_BG[tone] || TILE_BG.white,
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      minHeight: 138,
      position: 'relative', overflow: 'hidden',
      color: fg,
    }}>
      {/* Soft watermark */}
      <div style={{
        position: 'absolute', right: -10, bottom: -16,
        width: 90, height: 90, borderRadius: '50%',
        background: dark ? 'rgba(255,255,255,0.15)' : 'var(--surface-sunk)',
        pointerEvents: 'none',
      }} />

      <div className="row center between" style={{ position: 'relative' }}>
        <div style={{
          width: 26, height: 26, borderRadius: '50%',
          background: dark ? 'rgba(255,255,255,0.20)' : 'var(--surface-sunk)',
          display: 'grid', placeItems: 'center',
        }}>
          <TileIcon name={icon} color={fg} />
        </div>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: fg,
        }}>{label}</span>
      </div>

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="serif" style={{
          fontVariationSettings: '"opsz" 144', fontWeight: 600, fontSize: 38,
          lineHeight: 1, letterSpacing: '-0.02em', color: fg,
        }}>{value}</span>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, color: fgSoft, fontWeight: 500,
        }}>{unit} {'\u00B7'} {mood}</span>
      </div>
    </div>
  );
};

const TileIcon = ({ name, color }) => {
  const c = color || 'currentColor';
  if (name === 'heart') return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 12.5 C 1 8.5 1 4 4 2.5 C 5.5 1.8 7 2.8 7 4 C 7 2.8 8.5 1.8 10 2.5 C 13 4 13 8.5 7 12.5 Z" stroke={c} strokeWidth="1.4" fill="none" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'foot') return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M3 10 Q 3 5 6 5 Q 9 5 9 8 Q 9 11 6 12 Q 3 12 3 10 Z" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
      <circle cx="10" cy="4" r="0.7" fill={c} />
      <circle cx="11.5" cy="5.5" r="0.7" fill={c} />
      <circle cx="11" cy="7" r="0.7" fill={c} />
    </svg>
  );
  if (name === 'moon') return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M10 3 A 5 5 0 1 0 11.5 9.5 A 4 4 0 0 1 10 3 Z" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
    </svg>
  );
  if (name === 'drop') return (
    <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
      <path d="M7 2 C 5 5 4 7 4 9 A 3 3 0 0 0 10 9 C 10 7 9 5 7 2 Z" stroke={c} strokeWidth="1.3" fill="none" strokeLinejoin="round"/>
    </svg>
  );
  return null;
};

Object.assign(window, { ScreenMeetings, ScreenSummary });
