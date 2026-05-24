/* global React */
/* Screens: Companion (meditation app style), Notifications, Clinic, Expert, Settings */

const { useState: useStateC } = React;
const DC = () => window.COCUNA_DATA;
const { Motif, MotifGlyph, SheetHeader, TopBar, ArrowGlyph, PersonaIllustration } = window;

/* ============================================================
   COMPANION (meditation app style)
   ============================================================ */
const ScreenCompanion = ({ direction, persona }) => {
  const [category, setCategory] = useStateC(null);

  if (category) {
    return <CategoryDetail category={category} persona={persona} onBack={() => setCategory(null)} />;
  }

  const data = DC();
  const invitation = data.TODAY_INVITATIONS[persona];
  const p = data.PERSONAS[persona];

  return (
    <div className="screen-body fade-in" key={persona}>
      <div style={{ padding: '14px 24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="eyebrow">Companion</span>
          <h2 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 28,
            lineHeight: 1.1, letterSpacing: '-0.022em', margin: 0,
          }}>A quiet place,<br />for you alone.</h2>
        </header>

        {/* Today's invitation hero */}
        <div style={{
          padding: '22px 22px 24px',
          borderRadius: 24,
          background:
            'radial-gradient(ellipse at 20% 20%, var(--accent-soft) 0%, transparent 60%), ' +
            'radial-gradient(ellipse at 80% 80%, var(--accent-mint-soft) 0%, transparent 60%), ' +
            'var(--surface)',
          border: 'none',
          boxShadow: '0 12px 40px rgba(124, 110, 174, 0.10)',
          display: 'flex', flexDirection: 'column', gap: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -30, right: -30, width: 140, height: 140,
            borderRadius: '50%',
            background: 'radial-gradient(circle, var(--accent-peach) 0%, transparent 70%)',
            opacity: 0.5,
            animation: 'breathe-soft 5500ms ease-in-out infinite',
            pointerEvents: 'none',
          }} />
          <span className="eyebrow" style={{ color: 'var(--text-muted)' }}>{invitation.eyebrow}</span>
          <h3 className="serif" style={{
            fontVariationSettings: '"opsz" 144', fontWeight: 500, fontSize: 30,
            lineHeight: 1.05, letterSpacing: '-0.024em', margin: 0, color: 'var(--text)',
            whiteSpace: 'pre-line',
          }}>{invitation.title}</h3>
          <p className="body" style={{ color: 'var(--text)' }}>{invitation.body}</p>
          <button style={{
            alignSelf: 'flex-start', marginTop: 4,
            padding: '12px 22px', borderRadius: 999,
            background: 'var(--text)', color: 'var(--bg)',
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 8,
          }}>
            <svg width="11" height="11" viewBox="0 0 11 11" fill="currentColor">
              <path d="M2 1 L 9.5 5.5 L 2 10 Z" />
            </svg>
            Begin {invitation.minutes} min
          </button>
        </div>

        {/* Categories */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span className="eyebrow">Practices</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
            {DC().COMPANION_CATEGORIES.map(c => (
              <CategoryCard key={c.id} cat={c} onTap={() => setCategory(c)} />
            ))}
          </div>
        </section>

        {/* Weekly activity calendar */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="row center between">
            <span className="eyebrow">Your week with Cocuna</span>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)', letterSpacing: '0.04em',
            }}>This week</span>
          </div>
          <ActivityCalendar persona={persona} />
        </section>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11.5, lineHeight: 1.6, color: 'var(--text-faint)',
          textAlign: 'center', padding: '0 12px', margin: 0,
        }}>
          A hand to hold. Not a score, not a streak. Just quiet space when you want it.
        </p>

      </div>
    </div>
  );
};

const CategoryCard = ({ cat, onTap }) => {
  const bg = {
    lavender: 'var(--accent-soft)',
    mint:     'var(--accent-mint-soft)',
    peach:    'var(--accent-peach)',
    butter:   'var(--accent-butter)',
    rose:     'var(--accent-rose)',
  }[cat.color] || 'var(--accent-soft)';

  return (
    <button onClick={onTap} style={{
      padding: '18px 16px 16px',
      borderRadius: 20,
      background: bg,
      border: 'none',
      cursor: 'pointer',
      textAlign: 'left',
      display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 8,
      aspectRatio: '1.05',
      position: 'relative', overflow: 'hidden',
      transition: 'transform 200ms',
    }}
    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.97)'}
    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
    >
      <CategoryIcon name={cat.icon} />
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 2 }}>
        <span className="serif" style={{
          fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 19,
          letterSpacing: '-0.012em', color: 'var(--text)',
        }}>{cat.label}</span>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text)', opacity: 0.6,
        }}>{cat.count} practices</span>
      </div>
    </button>
  );
};

const CategoryIcon = ({ name }) => {
  const s = 32;
  if (name === 'breath') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="16" r="6"  stroke="var(--text)" strokeWidth="1.4" />
      <circle cx="16" cy="16" r="11" stroke="var(--text)" strokeWidth="1.4" opacity="0.55" />
      <circle cx="16" cy="16" r="15" stroke="var(--text)" strokeWidth="1.4" opacity="0.25" />
    </svg>
  );
  if (name === 'lotus') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M16 22 Q 8 18 4 22 Q 8 26 16 26 Q 24 26 28 22 Q 24 18 16 22 Z" stroke="var(--text)" strokeWidth="1.4" fill="none" />
      <path d="M16 22 Q 10 14 14 8" stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M16 22 Q 22 14 18 8" stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
      <path d="M16 22 V 8"          stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinecap="round" />
    </svg>
  );
  if (name === 'yoga') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <circle cx="16" cy="7" r="2.5" stroke="var(--text)" strokeWidth="1.4" />
      <path d="M16 10 V 17" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 13 L 9 16 L 7 22"  stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M16 13 L 23 16 L 25 22" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M16 17 L 12 25" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M16 17 L 20 25" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
  if (name === 'pen') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M22 7 L 25 10 L 12 23 L 7 24 L 8 19 Z" stroke="var(--text)" strokeWidth="1.4" strokeLinejoin="round" fill="none" />
      <line x1="20" y1="9" x2="23" y2="12" stroke="var(--text)" strokeWidth="1.4" />
    </svg>
  );
  if (name === 'moon') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M22 7 A 11 11 0 1 0 25 22 A 8 8 0 0 1 22 7 Z" stroke="var(--text)" strokeWidth="1.4" fill="none" />
      <circle cx="10" cy="10" r="0.8" fill="var(--text)" />
      <circle cx="6" cy="16" r="0.8" fill="var(--text)" />
      <circle cx="14" cy="6" r="0.8" fill="var(--text)" />
    </svg>
  );
  if (name === 'hands') return (
    <svg width={s} height={s} viewBox="0 0 32 32" fill="none">
      <path d="M9 21 L9 14 Q 9 12 11 12 L 11 11 Q 11 9 13 9 L 13 8 Q 13 6 15 6 L 15 14 L 17 14 Q 19 14 19 16 L 19 22"
        stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      <path d="M23 21 L23 14 Q 23 12 21 12 L 21 11 Q 21 9 19 9 L 19 8 Q 19 6 17 6 L 17 14"
        stroke="var(--text)" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
    </svg>
  );
  return null;
};

/* ============================================================
   CATEGORY DETAIL (Yoga clip library example)
   ============================================================ */
const CategoryDetail = ({ category, persona, onBack }) => {
  const data = DC();
  const clips = category.id === 'yoga' ? data.YOGA_CLIPS[persona] : null;
  const p = data.PERSONAS[persona];

  return (
    <>
      <TopBar title={category.label} onBack={onBack} />
      <div className="screen-body fade-in">
        <div style={{ padding: '4px 24px 32px', display: 'flex', flexDirection: 'column', gap: 20 }}>

          <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="eyebrow">{category.label} {'\u00B7'} {category.count} practices</span>
            <h2 className="serif" style={{
              fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
              lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0,
            }}>
              {category.id === 'yoga' ? `For ${p.stageLabel.toLowerCase()}, ${p.stageDetail.toLowerCase()}.` :
               category.id === 'breathe' ? 'Slow your shoulders down.' :
               category.id === 'meditate' ? 'A quiet minute, with you.' :
               category.id === 'journal' ? 'Whatever is on your mind.' :
               category.id === 'stories' ? 'A story to drift to.' :
               'A circle that knows.'}
            </h2>
            <p className="body">
              {category.id === 'yoga'
                ? `Vetted clips chosen for where you are in your ${p.stageLabel.toLowerCase()} journey. Update as you move through it.`
                : 'Curated by clinicians and teachers we trust.'}
            </p>
          </header>

          {/* Filter chips (only for yoga to keep it tight) */}
          {clips && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <span className="chip active">All</span>
              <span className="chip">Restorative</span>
              <span className="chip">Gentle</span>
              <span className="chip">Active</span>
            </div>
          )}

          {/* Clips */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {(clips || PLACEHOLDER_CLIPS).map((c, i) => (
              <ClipCard key={c.id} clip={c} index={i} />
            ))}
          </div>

          <div className="source-line" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Reviewed by</span>
            <span>Dr. Sarah Patel, OB GYN {'\u00B7'} Priya Aboud, Prenatal Yoga Center</span>
          </div>

        </div>
      </div>
    </>
  );
};

const PLACEHOLDER_CLIPS = [
  { id: 'p1', title: 'Box breath for racing thoughts', min: 4,  level: 'Restorative', teacher: 'Priya, RYT 500', tag: 'For anyone' },
  { id: 'p2', title: 'Slow exhale before sleep',       min: 6,  level: 'Restorative', teacher: 'Mei, Postnatal Yoga', tag: 'For anyone' },
  { id: 'p3', title: 'Steady morning breath',          min: 5,  level: 'Gentle',      teacher: 'Priya, RYT 500', tag: 'For anyone' },
  { id: 'p4', title: 'Reset between feeds',            min: 3,  level: 'Restorative', teacher: 'Sasha, Doula',   tag: 'For anyone' },
];

const ClipCard = ({ clip, index }) => {
  const gradients = [
    'linear-gradient(135deg, #E4D4EB 0%, #C4A6D6 100%)',
    'linear-gradient(135deg, #D4E8DC 0%, #9FC9B2 100%)',
    'linear-gradient(135deg, #F8D9C5 0%, #F2C5A8 100%)',
    'linear-gradient(135deg, #F5E4B0 0%, #E8D88A 100%)',
    'linear-gradient(135deg, #F3D7DC 0%, #EFC1C8 100%)',
  ];
  return (
    <button className="card" style={{
      padding: 14,
      display: 'flex', alignItems: 'center', gap: 14,
      cursor: 'pointer', textAlign: 'left',
      background: 'var(--surface)',
    }}>
      <div style={{
        width: 72, height: 72, borderRadius: 14,
        background: gradients[index % gradients.length],
        display: 'grid', placeItems: 'center',
        flexShrink: 0, position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255,255,255,0.85)',
          display: 'grid', placeItems: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="var(--text)">
            <path d="M3 2 L 10 6 L 3 10 Z" />
          </svg>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <h4 style={{
          fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)',
          margin: '0 0 4px',
        }}>{clip.title}</h4>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
        }}>
          <span>{clip.min} min</span>
          <span style={{ color: 'var(--text-faint)' }}>{'\u00B7'}</span>
          <span>{clip.level}</span>
          <span style={{ color: 'var(--text-faint)' }}>{'\u00B7'}</span>
          <span>{clip.teacher}</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--text)', fontWeight: 600,
            padding: '3px 8px', background: 'var(--surface-sunk)', borderRadius: 999,
          }}>{clip.tag}</span>
        </div>
      </div>
    </button>
  );
};

/* ============================================================
   PROFILE
   ============================================================ */
const ScreenProfile = ({ direction, persona, displayName, onSwitchPersona, onOpenSettings, onOpenClinic, onOpenBPLog }) => {
  const data = DC();
  const p = data.PERSONAS[persona];
  const other = persona === 'maria' ? data.PERSONAS.jane : data.PERSONAS.maria;
  return (
    <div className="screen-body fade-in" key={persona}>
      <div style={{ padding: '50px 24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Identity */}
        <header style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, paddingTop: 8 }}>
          <div style={{
            width: 84, height: 84, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-soft), var(--accent-mint-soft))',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 32,
            color: 'var(--text)',
            boxShadow: '0 8px 22px rgba(124, 110, 174, 0.18)',
          }}>{p.name[0]}</div>
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 4 }}>
            <h2 className="serif" style={{
              fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
              letterSpacing: '-0.018em', margin: 0,
            }}>{p.name}</h2>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)',
            }}>{p.stageLabel} {'\u00B7'} {p.stageDetail} {'\u00B7'} Pasadena</span>
          </div>
        </header>

        {/* Care team */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="row center between">
            <span className="eyebrow">Your care team</span>
            <button onClick={onOpenClinic} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
            }}>See all {'\u2192'}</button>
          </div>
          <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '4px 2px' }}>
            {data.EXPERTS.map(e => (
              <div key={e.id} style={{
                minWidth: 96, padding: '14px 10px',
                background: 'var(--surface)',
                border: '1px solid var(--hairline-soft)',
                borderRadius: 14,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                flexShrink: 0,
              }}>
                <div className="expert-avatar" style={{ width: 40, height: 40, fontSize: 14 }}>{e.initials}</div>
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600, color: 'var(--text)',
                  textAlign: 'center', lineHeight: 1.2,
                }}>{e.name.replace('Dr. ', '')}</span>
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.06em',
                  textTransform: 'uppercase', color: 'var(--text-faint)', textAlign: 'center',
                  fontWeight: 600,
                }}>{e.cred.split('\u00B7')[0].trim()}</span>
                {e.online && <span className="triage-dot triage-green" style={{ width: 6, height: 6 }} />}
              </div>
            ))}
          </div>
        </section>

        {/* Stats row */}
        <section>
          <span className="eyebrow" style={{ marginBottom: 10, display: 'block' }}>Your week</span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
            <StatTile value="12" label="Check ins" />
            <StatTile value="7"  label="Days logged" />
            <StatTile value="3"  label="Hera chats" />
          </div>
        </section>

        {/* Quick links */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span className="eyebrow">Manage</span>
          <ProfileRow icon="bp"      label="Blood pressure log" sublabel="7 day trend, all readings" onTap={onOpenBPLog} />
          <ProfileRow icon="device"  label="Connected devices"  sublabel="Apple Watch, Oura" />
          <ProfileRow icon="privacy" label="Privacy & data"     sublabel="HIPAA aligned \u00B7 End to end" tone="green" />
          <ProfileRow icon="bell"    label="Notifications"      sublabel="Quiet hours 9:30 PM to 6:30 AM" />
          <ProfileRow icon="gear"    label="All settings"       sublabel="Account, time zone, language" onTap={onOpenSettings} />
        </section>

        {/* Demo persona toggle hint */}
        <div style={{
          padding: 14, borderRadius: 14,
          border: '1px dashed var(--hairline)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          <span className="label-cap">Demo mode</span>
          <p className="body-tight" style={{ marginBottom: 4 }}>
            You are signed in as <span style={{ fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>. Switch to {other.name} ({other.stageDetail.toLowerCase()}) at the top of the screen.
          </p>
        </div>

        <button style={{
          padding: '12px 16px', background: 'none',
          border: '1px solid var(--hairline)', borderRadius: 999,
          fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-muted)',
          cursor: 'pointer',
        }}>Sign out</button>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)',
          textAlign: 'center', margin: 0, letterSpacing: '0.04em',
        }}>Cocuna Health {'\u00B7'} v0.4.2</p>

      </div>
    </div>
  );
};

const StatTile = ({ value, label }) => (
  <div className="card" style={{
    padding: '14px 10px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
  }}>
    <span className="serif" style={{
      fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
      letterSpacing: '-0.014em', color: 'var(--text)', lineHeight: 1,
    }}>{value}</span>
    <span style={{
      fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.12em',
      textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600,
      textAlign: 'center',
    }}>{label}</span>
  </div>
);

const ProfileRow = ({ icon, label, sublabel, tone, onTap }) => (
  <button onClick={onTap} style={{
    display: 'flex', alignItems: 'center', gap: 12,
    padding: '14px 16px',
    background: 'var(--surface)',
    border: '1px solid var(--hairline-soft)',
    borderRadius: 14,
    cursor: onTap ? 'pointer' : 'default',
    textAlign: 'left', width: '100%',
  }}>
    <ProfileIcon name={icon} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{label}</div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{sublabel}</div>
    </div>
    {tone === 'green' && <span className="triage-dot triage-green" />}
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 3 L 9 7 L 5 11" stroke="var(--text-faint)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </button>
);

const ProfileIcon = ({ name }) => {
  const wrap = (children) => (
    <div style={{
      width: 32, height: 32, borderRadius: 10,
      background: 'var(--surface-sunk)',
      display: 'grid', placeItems: 'center', flexShrink: 0,
    }}>{children}</div>
  );
  if (name === 'bp')      return wrap(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M1.5 8 H4 L6 4 L9 12 L11 8 H14.5" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);
  if (name === 'device')  return wrap(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><rect x="3" y="2" width="10" height="12" rx="2" stroke="var(--text)" strokeWidth="1.3" fill="none"/><line x1="6" y1="12" x2="10" y2="12" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round"/></svg>);
  if (name === 'privacy') return wrap(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M8 2 L 13 4 V 8 C 13 11 11 13 8 14 C 5 13 3 11 3 8 V 4 L 8 2 Z" stroke="var(--text)" strokeWidth="1.3" fill="none"/><path d="M6 8.2 L 7.3 9.4 L 10 7" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>);
  if (name === 'bell')    return wrap(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M4 11 V 7 A 4 4 0 0 1 12 7 V 11 L 13 12 H 3 L 4 11 Z" stroke="var(--text)" strokeWidth="1.3" fill="none" strokeLinejoin="round"/><path d="M7 13.5 Q 8 14.5 9 13.5" stroke="var(--text)" strokeWidth="1.3" fill="none" strokeLinecap="round"/></svg>);
  if (name === 'gear')    return wrap(<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="2" stroke="var(--text)" strokeWidth="1.3" fill="none"/><path d="M8 1 V3 M8 13 V15 M1 8 H3 M13 8 H15 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round"/></svg>);
  return wrap(<span />);
};

/* ============================================================
   NOTIFICATIONS / INBOX (kept for back-compat; unused)
   ============================================================ */
const ScreenInbox = ({ direction, onOpenAsk, onOpenExpert }) => {
  const data = DC();
  const [filter, setFilter] = useStateC('all');
  const filtered = filter === 'all' ? data.NOTIFICATIONS : data.NOTIFICATIONS.filter(n => n.triage === filter);
  return (
    <div className="screen-body fade-in">
      <div style={{ padding: '14px 24px 28px', display: 'flex', flexDirection: 'column', gap: 18 }}>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="eyebrow">Inbox</span>
          <h2 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
            lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0,
          }}>What you might want to see.</h2>
        </header>

        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All' },
            { id: 'red', label: 'Urgent' },
            { id: 'yellow', label: 'Care team' },
            { id: 'green', label: 'Quiet wins' },
            { id: 'gray', label: 'Reminders' },
          ].map(f => (
            <button
              key={f.id}
              className={`chip ${filter === f.id ? 'active' : ''}`}
              onClick={() => setFilter(f.id)}
            >
              {f.id !== 'all' && <span className={`triage-dot triage-${f.id}`} />}
              {f.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(n => (
            <InboxItem
              key={n.id}
              note={n}
              direction={direction}
              onOpen={() => n.cta ? onOpenAsk() : (n.expert ? onOpenExpert(n.expert) : null)}
            />
          ))}
          {filtered.length === 0 && (
            <p className="body" style={{ textAlign: 'center', padding: '20px 0' }}>Nothing here. Quiet is OK.</p>
          )}
        </div>

      </div>
    </div>
  );
};

const InboxItem = ({ note, direction, onOpen }) => {
  const data = DC();
  const exp = note.expert ? data.EXPERTS.find(e => e.id === note.expert) : null;
  return (
    <button onClick={onOpen} style={{
      background: 'var(--surface)',
      border: '1px solid var(--hairline-soft)',
      borderRadius: 'var(--radius-card)',
      padding: 16,
      textAlign: 'left',
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 8,
    }}>
      <div className="row center between">
        <div className="row center g-2">
          <span className={`triage-dot triage-${note.triage}`} />
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.16em',
            textTransform: 'uppercase', color: `var(--triage-${note.triage})`, fontWeight: 600,
          }}>{({ red: 'Urgent', orange: 'Soon', yellow: 'Review', green: 'Quiet', gray: 'Check in' })[note.triage]}</span>
        </div>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)' }}>{note.time}</span>
      </div>
      <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14.5, color: 'var(--text)', margin: 0 }}>{note.title}</h4>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 }}>{note.body}</p>
      {exp && (
        <div className="row center g-2" style={{ paddingTop: 4 }}>
          <div className="expert-avatar" style={{ width: 22, height: 22, fontSize: 10 }}>{exp.initials}</div>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{exp.name} {'\u00B7'} {exp.cred.split('\u00B7')[0].trim()}</span>
        </div>
      )}
      {note.source && (
        <div className="source-line" style={{ fontSize: 10, paddingTop: 4 }}>
          <span>Source {'\u00B7'} {note.source}</span>
        </div>
      )}
      {note.cta && (
        <span style={{
          alignSelf: 'flex-start', marginTop: 4,
          padding: '5px 10px',
          background: 'var(--text)', color: 'var(--bg)',
          borderRadius: 999,
          fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
        }}>{note.cta}</span>
      )}
    </button>
  );
};

/* ============================================================
   CLINIC / CARE TEAM
   ============================================================ */
const ScreenClinic = ({ direction, onClose, onOpenExpert }) => {
  const data = DC();
  return (
    <>
      <SheetHeader title="Care team" onClose={onClose} direction={direction} />
      <div className="screen-body fade-in">
        <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <span className="eyebrow">Your care team</span>
            <h2 className="serif" style={{
              fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 25,
              lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0,
            }}>Real humans, in minutes.</h2>
            <p className="body" style={{ marginTop: 4 }}>
              Vetted clinicians who know your story. Message any of them. The thread is saved.
            </p>
          </header>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {data.EXPERTS.map(e => (
              <ExpertRow key={e.id} expert={e} direction={direction} onOpen={() => onOpenExpert(e.id)} />
            ))}
          </div>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Your clinic</span>
            <div className="card">
              <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, margin: '0 0 4px' }}>
                {data.CLINIC.name}
              </h4>
              <p className="body-tight" style={{ marginBottom: 4 }}>
                {data.CLINIC.area} {'\u00B7'} {data.CLINIC.near}
              </p>
              <p className="body-tight" style={{ marginBottom: 10, color: 'var(--text-faint)' }}>
                {data.CLINIC.address}
              </p>
              <div className="row center g-3" style={{ paddingTop: 10, borderTop: '1px solid var(--hairline-soft)' }}>
                <button className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: '10px 14px' }}>Call clinic</button>
                <button className="btn-ghost" style={{ flex: 1, fontSize: 12, padding: '10px 14px' }}>Directions</button>
              </div>
            </div>
          </section>

          <button style={{
            padding: 14,
            border: '1px dashed var(--hairline)',
            borderRadius: 'var(--radius-card)',
            background: 'transparent',
            fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-muted)',
            cursor: 'pointer',
          }}>
            + Add a clinician to your team
          </button>

          <div className="source-line" style={{ paddingTop: 4 }}>
            <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Verified</span>
            <span className="dot-sep">{'\u00B7'}</span>
            <span>California Medical Board {'\u00B7'} Indemnity in scope</span>
          </div>

        </div>
      </div>
    </>
  );
};

const ExpertRow = ({ expert, direction, onOpen }) => (
  <button onClick={onOpen} className="expert-card" style={{
    cursor: 'pointer', textAlign: 'left', width: '100%',
  }}>
    <div className="expert-avatar">{expert.initials}</div>
    <div className="expert-meta">
      <div className="row center between">
        <span className="expert-name">{expert.name}</span>
        {expert.online ? (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--triage-green)',
            display: 'flex', alignItems: 'center', gap: 5, fontWeight: 600,
          }}>
            <span className="triage-dot triage-green" /> online
          </span>
        ) : (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', border: '1px solid var(--text-faint)' }} />
            away
          </span>
        )}
      </div>
      <span className="expert-cred">{expert.cred}</span>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)', marginTop: 2 }}>{expert.responds}</span>
    </div>
  </button>
);

/* ============================================================
   EXPERT DETAIL
   ============================================================ */
const ScreenExpert = ({ direction, expertId, onBack }) => {
  const data = DC();
  const expert = data.EXPERTS.find(e => e.id === expertId);
  if (!expert) return null;
  return (
    <>
      <TopBar title={expert.name} onBack={onBack} direction={direction} />
      <div className="screen-body fade-in">
        <div style={{ padding: '4px 26px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '14px 0' }}>
            <div className="expert-avatar" style={{ width: 84, height: 84, fontSize: 30 }}>{expert.initials}</div>
            <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
              <h2 className="serif" style={{
                fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
                letterSpacing: '-0.018em', margin: 0,
              }}>{expert.name}</h2>
              <span className="body-tight">{expert.cred} {'\u00B7'} {expert.pronoun}</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11.5,
                color: expert.online ? 'var(--triage-green)' : 'var(--text-faint)',
                display: 'inline-flex', alignItems: 'center', gap: 6, justifyContent: 'center',
              }}>
                <span className={`triage-dot triage-${expert.online ? 'green' : 'gray'}`} />
                {expert.responds}
              </span>
            </div>
          </div>

          <button className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4 V11 A1 1 0 0 0 3 12 H11 A1 1 0 0 0 12 11 V4 A1 1 0 0 0 11 3 H3 A1 1 0 0 0 2 4 Z M2 4 L7 8 L12 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
            Message {expert.name.split(' ')[0]}
          </button>
          <button className="btn-ghost">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="2" y="3" width="9" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
              <path d="M11 6 L13 4.5 V9.5 L11 8" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" fill="none"/>
            </svg>
            Request a video call
          </button>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="eyebrow">About</span>
            <p className="body" style={{ color: 'var(--text)' }}>{expert.bio}</p>
          </section>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span className="eyebrow">Recent threads</span>
            <div className="card">
              <div style={{ padding: '4px 0', borderBottom: '1px solid var(--hairline-soft)' }}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>BP trend up</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)' }}>Today</span>
                </div>
                <p className="body-tight" style={{ margin: 0 }}>{'"'}Let{'\u2019'}s check in by 10. Bring last 3 readings and notes on the headache.{'"'}</p>
              </div>
              <div style={{ padding: '12px 0 4px' }}>
                <div className="row between" style={{ marginBottom: 4 }}>
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>Visit prep</span>
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)' }}>Mon</span>
                </div>
                <p className="body-tight" style={{ margin: 0 }}>{'"'}I{'\u2019'}ll have your BP trend and mood screen ready. Anything you want me to look at first?{'"'}</p>
              </div>
            </div>
          </section>

          <div className="source-line">
            <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Verified</span>
            <span className="dot-sep">{'\u00B7'}</span>
            <span>License current {'\u00B7'} Indemnity in scope</span>
          </div>
        </div>
      </div>
    </>
  );
};

/* ============================================================
   SETTINGS
   ============================================================ */
const ScreenSettings = ({ direction, onClose }) => (
  <>
    <SheetHeader title="Settings" onClose={onClose} direction={direction} />
    <div className="screen-body fade-in">
      <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>

        <header style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <span className="eyebrow">Private by design</span>
          <h2 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
            lineHeight: 1.18, letterSpacing: '-0.018em', margin: 0,
          }}>Your data, yours alone.</h2>
          <p className="body" style={{ marginTop: 4 }}>
            Encrypted end to end. Never sold. Shared only with the clinicians you choose.
          </p>
        </header>

        <SettingsGroup label="Account">
          <SettingsRow label="Name"      value="Maria S." />
          <SettingsRow label="Stage"     value="Pregnant, week 34" />
          <SettingsRow label="Time zone" value="Pasadena, GMT\u22128" />
        </SettingsGroup>

        <SettingsGroup label="Connected devices">
          <SettingsRow label="Apple Watch"      value="Connected"     tone="green" />
          <SettingsRow label="Oura Ring"        value="Connected"     tone="green" />
          <SettingsRow label="Owlet baby band"  value="Not connected" tone="gray" />
        </SettingsGroup>

        <SettingsGroup label="Notifications">
          <SettingsRow label="Daily check ins" value="Once a day" />
          <SettingsRow label="Urgent alerts"   value="Always on"  tone="red" />
          <SettingsRow label="Quiet hours"     value="9:30 PM to 6:30 AM" />
        </SettingsGroup>

        <SettingsGroup label="Privacy">
          <SettingsRow label="Encryption"      value="End to end"     tone="green" />
          <SettingsRow label="Data sharing"    value="Your clinic only" />
          <SettingsRow label="HIPAA compliance" value="Aligned"        tone="green" />
        </SettingsGroup>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <button className="btn-ghost">Export my data</button>
          <button className="btn-ghost" style={{ color: 'var(--triage-red)', borderColor: 'var(--triage-red)' }}>
            Delete account
          </button>
        </div>

        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)',
          textAlign: 'center', margin: 0, letterSpacing: '0.04em',
        }}>Cocuna Health {'\u00B7'} v0.4.2 {'\u00B7'} HIPAA aligned</p>
      </div>
    </div>
  </>
);

const SettingsGroup = ({ label, children }) => (
  <section style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
    <span className="eyebrow">{label}</span>
    <div className="card" style={{ padding: 0 }}>{children}</div>
  </section>
);

const SettingsRow = ({ label, value, tone }) => (
  <div style={{
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '14px 16px',
    borderBottom: '1px solid var(--hairline-soft)',
  }}>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 13.5, color: 'var(--text)' }}>{label}</span>
    <span style={{
      fontFamily: 'var(--sans)', fontSize: 12.5,
      color: tone === 'green' ? 'var(--triage-green)' :
             tone === 'red'   ? 'var(--triage-red)' :
             tone === 'gray'  ? 'var(--text-faint)' : 'var(--text-muted)',
      display: 'flex', alignItems: 'center', gap: 6,
    }}>
      {tone && <span className={`triage-dot triage-${tone === 'red' ? 'red' : tone === 'green' ? 'green' : 'gray'}`} />}
      {value}
    </span>
  </div>
);

Object.assign(window, {
  ScreenCompanion, ScreenInbox, ScreenProfile, ScreenClinic, ScreenExpert, ScreenSettings,
});

/* ============================================================
   Weekly activity calendar (used by Companion)
   ============================================================ */
const Legend = ({ color, label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 4,
    fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--text-muted)',
  }}>
    <span style={{ width: 7, height: 7, borderRadius: '50%', background: color }} />
    {label}
  </span>
);

const ActivityCalendar = ({ persona }) => {
  const week = persona === 'maria' ? [
    { d: 'M', items: ['yoga', 'breathe'] },
    { d: 'T', items: ['journal'] },
    { d: 'W', items: ['yoga', 'meditate', 'journal'] },
    { d: 'T', items: ['breathe'] },
    { d: 'F', items: ['stories', 'breathe'] },
    { d: 'S', items: ['yoga'] },
    { d: 'S', items: ['meditate', 'journal'], today: true },
  ] : [
    { d: 'M', items: [] },
    { d: 'T', items: ['breathe'] },
    { d: 'W', items: [] },
    { d: 'T', items: ['stories'] },
    { d: 'F', items: [] },
    { d: 'S', items: ['journal'] },
    { d: 'S', items: ['breathe'], today: true },
  ];

  const COLORS = {
    yoga: '#F2C5A8', breathe: '#C4A6D6', meditate: '#9DCBB0',
    journal: '#F5E4B0', stories: '#EFC1C8', circle: '#D4C7E8',
  };
  const ICONS = {
    yoga: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="6" r="2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M11 8 V 13 M11 11 L 7 13 M11 11 L 15 13 M11 13 L 9 18 M11 13 L 13 18"
          stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    breathe: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="4" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.4" opacity="0.4" />
      </svg>
    ),
    meditate: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <path d="M11 16 Q 5 13 3 16 Q 5 19 11 19 Q 17 19 19 16 Q 17 13 11 16 Z"
          stroke="currentColor" strokeWidth="1.4" fill="none" />
        <line x1="11" y1="16" x2="11" y2="6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
      </svg>
    ),
    journal: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <path d="M16 4 L 18 6 L 8 16 L 5 17 L 6 14 Z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round" />
      </svg>
    ),
    stories: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <path d="M16 4 A 8 8 0 1 0 18 16 A 6 6 0 0 1 16 4 Z" stroke="currentColor" strokeWidth="1.4" fill="none"/>
      </svg>
    ),
    circle: (
      <svg width="10" height="10" viewBox="0 0 22 22" fill="none">
        <circle cx="8" cy="11" r="3" stroke="currentColor" strokeWidth="1.4"/>
        <circle cx="14" cy="11" r="3" stroke="currentColor" strokeWidth="1.4"/>
      </svg>
    ),
  };
  const total = week.reduce((n, day) => n + day.items.length, 0);

  return (
    <div className="card" style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 8 }}>
        {week.map((day, i) => (
          <div key={i} style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            padding: '8px 0 10px', borderRadius: 12,
            background: day.today ? 'var(--surface-sunk)' : 'transparent',
          }}>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 10, fontWeight: 600,
              letterSpacing: '0.06em', color: day.today ? 'var(--text)' : 'var(--text-muted)',
            }}>{day.d}</span>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, minHeight: 44,
            }}>
              {day.items.length === 0 ? (
                <span style={{
                  width: 5, height: 5, borderRadius: '50%', background: 'transparent',
                  border: '1px dashed var(--hairline)', marginTop: 6,
                }} />
              ) : day.items.map((item, j) => (
                <div key={j} style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: COLORS[item] || 'var(--surface-sunk)',
                  display: 'grid', placeItems: 'center', color: 'rgba(42, 39, 35, 0.7)',
                }}>{ICONS[item]}</div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="row center between" style={{ paddingTop: 10, borderTop: '1px solid var(--hairline-soft)' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
          {total} {total === 1 ? 'practice' : 'practices'} this week
        </span>
        <div className="row center g-2" style={{ flexWrap: 'wrap', gap: 6 }}>
          <Legend color={COLORS.yoga}    label="Yoga" />
          <Legend color={COLORS.breathe} label="Breath" />
          <Legend color={COLORS.journal} label="Journal" />
        </div>
      </div>
    </div>
  );
};

window.ActivityCalendar = ActivityCalendar;
window.Legend = Legend;
