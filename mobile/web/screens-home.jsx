/* global React */
/* Home: persona-aware (Maria pregnant 34w / Jane postpartum 3mo).
   Three check-ins: mood, energy, pain. Cute pastel emoji chips.
   Persona illustration replaces the abstract motif. */

const { useState } = React;
const D = () => window.COCUNA_DATA;
const { Motif, MotifGlyph, PersonaIllustration, MariaAcuteHero, JaneQuietHero } = window;

/* ============================================================
   ONBOARDING (welcome + name)
   ============================================================ */
const ScreenOnboarding = ({ direction, onContinue }) => {
  const [name, setName] = useState('');
  return (
    <div className="screen-body fade-in">
      <div style={{
        padding: '24px 28px 16px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        <div style={{ paddingTop: 24 }}>
          <Motif direction={direction} size={180} entrance={true} label={{ eyebrow: 'Cocuna', value: '' }} />
        </div>

        <h1 className="serif" style={{
          fontWeight: 500, fontSize: 30, letterSpacing: '-0.022em',
          color: 'var(--text)', margin: 0,
        }}>
          cocuna
        </h1>

        <p className="serif" style={{
          fontVariationSettings: '"opsz" 60', fontWeight: 500,
          fontSize: 19, lineHeight: 1.3, letterSpacing: '-0.01em',
          textAlign: 'center', maxWidth: 290, color: 'var(--text)', margin: 0,
        }}>
          Because moms shouldn{'\u2019'}t need to <em style={{ color: 'var(--accent)', fontStyle: 'italic' }}>worry</em> about taking care of themselves.
        </p>
      </div>

      <div style={{ padding: '20px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
        <span className="eyebrow">Welcome</span>
        <h2 className="serif" style={{
          fontWeight: 600, fontSize: 24, lineHeight: 1.18, letterSpacing: '-0.018em', margin: 0,
        }}>
          What can we call you?
        </h2>
        <input
          className="input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Your first name"
        />
        <button
          className="btn-primary"
          style={{ marginTop: 4, opacity: name.trim() ? 1 : 0.5 }}
          onClick={() => name.trim() && onContinue(name.trim())}
        >
          Continue
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onContinue('Maria')}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text-muted)',
            padding: 8,
          }}
        >Skip for the demo</button>
      </div>

      <div style={{ padding: '8px 28px 28px' }}>
        <div className="row center jc g-3" style={{ flexWrap: 'wrap', gap: 10 }}>
          <TrustChip>Private by design</TrustChip>
          <TrustChip>Clinician built</TrustChip>
          <TrustChip>HIPAA aligned</TrustChip>
        </div>
      </div>
    </div>
  );
};

const TrustChip = ({ children }) => (
  <span style={{
    fontFamily: 'var(--sans)',
    fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase',
    color: 'var(--text-faint)',
    padding: '6px 10px',
    border: '1px solid var(--hairline-soft)', borderRadius: 'var(--radius-pill)',
    fontWeight: 500,
  }}>{children}</span>
);

const ArrowGlyph = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3 7 H11 M7 3 L11 7 L7 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ============================================================
   HOME (persona aware)
   ============================================================ */
const ScreenHome = ({ direction, persona, onNavigate, checkin, setCheckin, onSwitchPersona, displayName }) => {
  const data = D();
  const p = data.PERSONAS[persona];
  const otherPersona = persona === 'maria' ? 'jane' : 'maria';
  const otherP = data.PERSONAS[otherPersona];

  return (
    <div className="screen-body fade-in" key={persona}>
      <div style={{ padding: '12px 26px 26px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* Greeting */}
        <header style={{ display: 'flex', flexDirection: 'column', gap: 4, paddingTop: 4 }}>
          <span className="eyebrow">Good morning</span>
          <h1 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 32, lineHeight: 1.04,
            letterSpacing: '-0.024em', margin: 0,
          }}>{p.name}.</h1>
          <p className="serif" style={{
            fontVariationSettings: '"opsz" 60', fontWeight: 500, fontSize: 19, lineHeight: 1.2,
            letterSpacing: '-0.01em', margin: '2px 0 0',
          }}>{p.stageLong}</p>
        </header>

        {/* Persona illustration */}
        <div className="row center jc" style={{ padding: '4px 0 2px' }}>
          <PersonaIllustration persona={persona} size={180} />
        </div>

        {/* Primary CTA */}
        <button className="cta-block" onClick={() => onNavigate('ask')}>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <h3 className="serif" style={{
              fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 21,
              lineHeight: 1.18, letterSpacing: '-0.012em', margin: '0 0 4px', color: 'var(--text)',
            }}>Ask Hera</h3>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.45,
              color: 'var(--text)', opacity: 0.72, margin: 0,
            }}>{persona === 'maria'
              ? 'Pelvic pain, headaches, sleep, any question.'
              : 'Feeding, sleep, your recovery, any question.'}</p>
          </div>
          <div className="cta-arrow">{ArrowGlyph}</div>
        </button>

        {/* Three check-ins */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <span className="eyebrow">A small check in</span>
          <CheckInRow
            label="Mood"
            options={[
              { face: 'cry',     label: 'Low',    bg: '#E4D4EB', idx: 0 },
              { face: 'glum',    label: 'OK',     bg: '#F5E4B0', idx: 1 },
              { face: 'smile',   label: 'Good',   bg: '#D4E8DC', idx: 2 },
              { face: 'soft',    label: 'Soft',   bg: '#F8D9C5', idx: 3 },
              { face: 'sparkle', label: 'Bright', bg: '#F3D7DC', idx: 4 },
            ]}
            value={checkin.mood}
            onChange={v => setCheckin({ ...checkin, mood: v })}
          />
          <CheckInRow
            label="Energy"
            options={[
              { face: 'dead',    label: 'Empty',  bg: '#E5E0D6', idx: 5 },
              { face: 'sleepy',  label: 'Low',    bg: '#E4D4EB', idx: 0 },
              { face: 'neutral', label: 'OK',     bg: '#F5E4B0', idx: 1 },
              { face: 'soft',    label: 'Lifted', bg: '#D4E8DC', idx: 2 },
              { face: 'beam',    label: 'Sunny',  bg: '#F8D9C5', idx: 3 },
            ]}
            value={checkin.energy}
            onChange={v => setCheckin({ ...checkin, energy: v })}
          />
          <CheckInRow
            label="Pain"
            options={[
              { face: 'smile',   label: 'None',   bg: '#D4E8DC', idx: 4 },
              { face: 'soft',    label: 'Mild',   bg: '#F5E4B0', idx: 5 },
              { face: 'wince',   label: 'Some',   bg: '#F8D9C5', idx: 0 },
              { face: 'ouch',    label: 'High',   bg: '#F3D7DC', idx: 1 },
              { face: 'severe',  label: 'Severe', bg: '#F0B4B4', idx: 2 },
            ]}
            value={checkin.pain}
            onChange={v => setCheckin({ ...checkin, pain: v })}
          />
        </section>

        {/* Next visit / clinician card */}
        <NextVisitCard direction={direction} expert={data.EXPERTS[0]} visit={p.nextVisit} onTap={() => onNavigate('clinic')} />

        {/* Demo switcher pill (small, bottom of home) */}
        <button
          onClick={onSwitchPersona}
          style={{
            alignSelf: 'center', padding: '8px 14px', borderRadius: 999,
            border: '1px dashed var(--hairline)', color: 'var(--text-faint)',
            fontFamily: 'var(--sans)', fontSize: 10.5,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            cursor: 'pointer', marginTop: 4,
          }}
        >
          Demo {'\u00B7'} switch to {otherP.name} ({otherP.stageDetail.toLowerCase()})
          <span style={{ marginLeft: 6 }}>{'\u2192'}</span>
        </button>

      </div>
    </div>
  );
};

/* Check-in row */
const CheckInRow = ({ label, options, value, onChange }) => {
  const MoodBlob = window.MoodBlob;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="row center between">
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)',
        }}>{label}</span>
        {value != null && (
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
            letterSpacing: '0.04em',
          }}>{options[value].label}</span>
        )}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6 }}>
        {options.map((opt, i) => {
          const selected = value === i;
          return (
            <button
              key={i}
              onClick={() => onChange(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 4px 8px',
                background: selected ? 'var(--surface)' : 'transparent',
                border: '1px solid ' + (selected ? 'var(--hairline)' : 'transparent'),
                borderRadius: 14,
                transition: 'transform 150ms, background 200ms, border-color 200ms',
                transform: selected ? 'translateY(-1px)' : 'none',
                cursor: 'pointer',
                boxShadow: selected ? '0 4px 12px rgba(124, 110, 174, 0.08)' : 'none',
              }}
            >
              <MoodBlob size={42} color={opt.bg} face={opt.face} selected={selected} idx={opt.idx ?? i} />
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: selected ? 'var(--text)' : 'var(--text-muted)',
                fontWeight: selected ? 600 : 500,
              }}>{opt.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* Next visit card */
const NextVisitCard = ({ direction, expert, visit, onTap }) => (
  <button className="card" onClick={onTap} style={{
    textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14,
    width: '100%',
  }}>
    <div className="row between center">
      <span className="eyebrow">Next visit</span>
      <span style={{
        padding: '3px 8px',
        background: visit.visitType === 'In person' ? 'var(--accent-mint-soft)' : 'var(--accent-soft)',
        borderRadius: 999,
        fontFamily: 'var(--sans)', fontSize: 10.5, fontWeight: 600,
        color: 'var(--text)', letterSpacing: '0.04em',
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
    <div>
      <h4 className="serif" style={{
        fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 18,
        letterSpacing: '-0.012em', margin: '0 0 4px', color: 'var(--text)',
      }}>{visit.kind}</h4>
      <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-muted)', margin: 0 }}>
        {visit.when} {'\u00B7'} {visit.location}
      </p>
    </div>
    <div className="row center between g-3" style={{
      borderTop: '1px solid var(--hairline-soft)', paddingTop: 12,
    }}>
      <div className="row center g-3">
        <div className="expert-avatar" style={{ width: 32, height: 32, fontSize: 13 }}>{expert.initials}</div>
        <div className="col">
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{expert.name}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{expert.cred.split('\u00B7')[0].trim()}</span>
        </div>
      </div>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--triage-green)',
        display: 'flex', alignItems: 'center', gap: 6,
      }}>
        <span className="triage-dot triage-green" /> online
      </span>
    </div>
  </button>
);

Object.assign(window, {
  ScreenOnboarding, ScreenHome,
  NextVisitCard, ArrowGlyph, CheckInRow, TrustChip,
});
