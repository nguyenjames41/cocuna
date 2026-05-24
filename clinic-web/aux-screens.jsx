/* global React */
/* Login + Schedule + Settings screens. */

const { useState: useStateAux } = React;
const { Icon: IconAux } = window;

/* ============================================================
   LOGIN
   ============================================================ */
const LoginScreen = ({ onSignIn }) => {
  const [email, setEmail] = useStateAux('sarah.patel@huntington-hill.com');
  const [pwd, setPwd] = useStateAux('\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1,
      display: 'flex',
      background: 'var(--bg)',
      animation: 'fade-in 320ms ease-out',
    }}>
      {/* Left: aurora visual */}
      <div style={{
        flex: 1.1,
        background: 'linear-gradient(135deg, var(--accent-soft) 0%, var(--lavender-soft) 100%)',
        position: 'relative', overflow: 'hidden',
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
        padding: '40px 48px 36px',
        color: 'var(--text)',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '20%', width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 65%)',
          filter: 'blur(40px)', opacity: 0.4,
          animation: 'lg-drift 18s ease-in-out infinite alternate',
        }} />
        <div style={{
          position: 'absolute', bottom: '10%', right: '15%', width: 260, height: 260, borderRadius: '50%',
          background: 'radial-gradient(circle, var(--lavender) 0%, transparent 65%)',
          filter: 'blur(40px)', opacity: 0.35,
          animation: 'lg-drift 22s ease-in-out infinite alternate-reverse',
        }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'var(--surface)', display: 'grid', placeItems: 'center',
            overflow: 'hidden', boxShadow: '0 8px 20px rgba(31, 37, 32, 0.12)',
          }}>
            <img src="cocuna-logo.jpeg" alt="" style={{ width: '78%', height: '78%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24, letterSpacing: '-0.018em' }}>cocuna</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.24em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Clinic continuity</div>
          </div>
        </div>

        <div style={{ position: 'relative', maxWidth: 460 }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600,
          }}>The clinic side</span>
          <h1 className="serif" style={{
            fontVariationSettings: '"opsz" 144', fontWeight: 600,
            fontSize: 52, lineHeight: 1.02, letterSpacing: '-0.028em',
            color: 'var(--text)', margin: '12px 0 16px',
            textWrap: 'pretty',
          }}>
            Begin the day with a worklist, <em style={{ fontStyle: 'italic', color: 'var(--accent-deep)' }}>not an inbox.</em>
          </h1>
          <p className="serif" style={{
            fontVariationSettings: '"opsz" 60', fontWeight: 500, fontSize: 18,
            lineHeight: 1.4, letterSpacing: '-0.008em', color: 'var(--text-muted)', margin: 0,
            maxWidth: 380,
          }}>
            Cocuna structures the day's mother\u2013baby signals into a calm, prioritized triage queue. You spend the morning on what matters.
          </p>
        </div>

        <div style={{ position: 'relative', display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
          <TrustPill>HIPAA aligned</TrustPill>
          <TrustPill>Clinician built</TrustPill>
          <TrustPill>Source-cited</TrustPill>
          <TrustPill>SOC 2 in progress</TrustPill>
        </div>
      </div>

      {/* Right: form */}
      <div style={{
        width: 460, padding: '48px 56px',
        background: 'var(--surface)',
        display: 'flex', flexDirection: 'column', gap: 24,
        borderLeft: '1px solid var(--hairline)',
      }}>
        <span className="eyebrow">Welcome back</span>
        <h2 className="serif" style={{
          fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 28,
          letterSpacing: '-0.022em', color: 'var(--text)', margin: 0,
        }}>Sign in to your clinic.</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 8 }}>
          <Field label="Work email">
            <input value={email} onChange={e => setEmail(e.target.value)} style={inputStyle}/>
          </Field>
          <Field label="Password">
            <input type="password" value={pwd} onChange={e => setPwd(e.target.value)} style={inputStyle}/>
          </Field>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ accentColor: 'var(--accent-deep)' }}/> Keep me signed in
            </label>
            <span style={{ flex: 1 }} />
            <a style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--accent-deep)', textDecoration: 'none', cursor: 'pointer' }}>Forgot password?</a>
          </div>

          <button onClick={onSignIn} className="btn btn-primary" style={{ padding: '14px 18px', fontSize: 14, marginTop: 6 }}>
            Sign in <IconAux name="arrow-right" size={14}/>
          </button>

          <div style={{ position: 'relative', height: 14, margin: '6px 0' }}>
            <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--hairline)' }} />
            <span style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              padding: '0 10px', background: 'var(--surface)',
              fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.16em', textTransform: 'uppercase',
              color: 'var(--text-faint)',
            }}>or</span>
          </div>

          <button className="btn btn-ghost" style={{ padding: '12px 18px', fontSize: 13 }}>
            <span style={{ width: 16, height: 16, borderRadius: 4, background: 'var(--lavender-soft)', display: 'inline-grid', placeItems: 'center', fontFamily: 'var(--serif)', fontWeight: 700, fontSize: 10, color: 'var(--lavender-deep)' }}>SSO</span>
            Continue with clinic SSO
          </button>
        </div>

        <div style={{ marginTop: 'auto', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)', lineHeight: 1.6 }}>
          By signing in you agree to Cocuna{'\u2019'}s clinic terms and the data use agreement specific to your organization. Patient data is never used to train models.
        </div>
      </div>

      <style>{`
        @keyframes lg-drift {
          0%   { transform: translate(0, 0) scale(1); }
          50%  { transform: translate(20px, -16px) scale(1.06); }
          100% { transform: translate(-12px, 18px) scale(0.96); }
        }
      `}</style>
    </div>
  );
};

const TrustPill = ({ children }) => (
  <span style={{
    fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.16em',
    textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500,
    padding: '6px 10px',
    border: '1px solid var(--hairline-strong)', borderRadius: 999,
    background: 'rgba(255, 255, 255, 0.4)',
  }}>{children}</span>
);

const Field = ({ label, children }) => (
  <label style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
    {children}
  </label>
);

const inputStyle = {
  padding: '12px 14px',
  background: 'var(--surface-soft)',
  border: '1px solid var(--hairline)',
  borderRadius: 10,
  fontFamily: 'var(--sans)', fontSize: 14,
  color: 'var(--text)', outline: 'none',
};

/* ============================================================
   SCHEDULE
   ============================================================ */
const ScheduleScreen = ({ onOpenPatient }) => {
  const appts = [
    { time: '8:30',  end: '8:45',  patient: 'Maria S.',  pid: 'maria',  type: 'Postpartum BP check',    visitType: 'In person', staff: 'Dr. Patel',     triage: 'red'    },
    { time: '9:00',  end: '9:20',  patient: 'Hana M.',   pid: 'hana',   type: '28w + GTT review',       visitType: 'In person', staff: 'Dr. Patel',     triage: 'yellow' },
    { time: '9:30',  end: '10:00', patient: 'Lila G.',   pid: 'lila',   type: '24w anatomy follow-up',  visitType: 'In person', staff: 'Dr. Patel',     triage: 'green'  },
    { time: '10:30', end: '11:00', patient: 'Ana R.',    pid: 'ana',    type: '32w growth + behavioral', visitType: 'In person', staff: 'Dr. Patel',     triage: 'orange' },
    { time: '11:30', end: '11:45', patient: 'Ben H.',    pid: 'ben',    type: 'Pedi nurse \u00b7 weighted feed', visitType: 'Online',    staff: 'Jane Kim, RN',  triage: 'yellow' },
    { time: '1:30',  end: '2:00',  patient: 'Jane W.',   pid: 'jane',   type: '3 month wellness + EPDS', visitType: 'Online',    staff: 'Dr. Ruiz',      triage: 'orange' },
    { time: '2:30',  end: '3:00',  patient: 'Mei L.',    pid: 'mei',    type: '6w postpartum review',   visitType: 'In person', staff: 'Dr. Patel',     triage: 'yellow' },
    { time: '3:30',  end: '4:00',  patient: 'Emily T.',  pid: 'emily',  type: 'Lactation video',         visitType: 'Online',    staff: 'Naomi Okafor',  triage: 'yellow' },
    { time: '4:30',  end: '4:45',  patient: 'Sara K.',   pid: 'sara',   type: 'Same-day BP recheck',     visitType: 'Online',    staff: 'Dr. Patel',     triage: 'orange' },
  ];

  const stats = [
    { label: 'Booked today',  value: appts.length, sub: 'across 3 clinicians' },
    { label: 'Telehealth',    value: appts.filter(a => a.visitType === 'Online').length, sub: 'video slots' },
    { label: 'In-person',     value: appts.filter(a => a.visitType === 'In person').length, sub: 'clinic rooms 2\u20134' },
    { label: 'Free slots',    value: 7, sub: 'next opening 11:00 AM' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {stats.map(s => (
          <div key={s.label} className="metric-card">
            <span className="metric-eyebrow">{s.label}</span>
            <span className="metric-value num">{s.value}</span>
            <span className="metric-trend">{s.sub}</span>
          </div>
        ))}
      </div>

      <div className="queue-shell">
        <div className="queue-header">
          <span className="title">Today {'\u00b7'} Tuesday, May 24</span>
          <span className="meta">Appointments routed by Cocuna triage outcome \u00b7 sorted chronologically</span>
          <button className="btn btn-ghost" style={{ marginLeft: 'auto', padding: '8px 12px', fontSize: 12 }}>
            <IconAux name="calendar" size={13}/> Open week view
          </button>
        </div>
        <div style={{ padding: '8px 0' }}>
          {appts.map((a, i) => (
            <ApptRow key={i} appt={a} onClick={() => onOpenPatient(a.pid)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const ApptRow = ({ appt: a, onClick }) => (
  <div onClick={onClick} style={{
    display: 'grid',
    gridTemplateColumns: '90px 4px 1fr 200px 160px 120px',
    alignItems: 'center', gap: 12,
    padding: '12px 22px',
    cursor: 'pointer',
    borderBottom: '1px solid var(--hairline-soft)',
  }}>
    <div style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em' }}>
      {a.time}
      <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)', display: 'block', marginTop: 2, fontWeight: 500 }}>{'\u2192'} {a.end}</span>
    </div>
    <span className={`triage-bar ${a.triage}`} style={{ height: 28 }}></span>
    <div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{a.patient}</div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{a.type}</div>
    </div>
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <IconAux name={a.visitType === 'Online' ? 'video' : 'patients'} size={13} color="var(--text-muted)" />
      <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)' }}>{a.visitType}</span>
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>{a.staff}</div>
    <span className={`triage-pill ${a.triage}`}><span className="dot"></span>{window.COCUNA_DATA.TRIAGE[a.triage].short}</span>
  </div>
);

/* ============================================================
   SETTINGS
   ============================================================ */
const SettingsScreen = () => {
  const D = window.COCUNA_DATA;
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="card" style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
        <div style={{
          width: 60, height: 60, borderRadius: 14,
          background: 'var(--accent-soft)', display: 'grid', placeItems: 'center',
          fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 22, color: 'var(--accent-deep)',
        }}>HH</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <span className="eyebrow">Clinic profile</span>
          <h2 className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
            letterSpacing: '-0.02em', margin: '4px 0 6px',
          }}>{D.CLINIC.name}</h2>
          <p className="body">{D.CLINIC.city} {'\u00b7'} 12 clinicians {'\u00b7'} 312 active patients</p>
        </div>
        <button className="btn btn-ghost">Edit profile</button>
      </div>

      <div className="drawer-grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 }}>Care team</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { name: 'Dr. Sarah Patel',   role: 'OB GYN',                  online: true,  photo: 'doctor-patel.png' },
              { name: 'Naomi Okafor',      role: 'IBCLC \u00b7 Lactation',  online: true,  photo: 'doctor-okafor.png' },
              { name: 'Dr. Ana Ruiz',      role: 'Perinatal psychologist',  online: false, photo: 'doctor-ruiz.png' },
              { name: 'Jane Kim, RN',      role: 'Paediatric nurse',        online: true,  photo: 'doctor-kim.png' },
            ].map(s => (
              <div key={s.name} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 12px', borderRadius: 12,
                background: 'var(--surface-soft)',
              }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', overflow: 'hidden', flexShrink: 0 }}>
                  <img src={s.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}/>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                  <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{s.role}</div>
                </div>
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 10.5,
                  color: s.online ? 'var(--triage-green)' : 'var(--text-faint)',
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                }}>
                  <span className={`triage-dot triage-${s.online ? 'green' : 'gray'}-dot`} />
                  {s.online ? 'online' : 'offline'}
                </span>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost" style={{ alignSelf: 'flex-start' }}>+ Invite clinician</button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <h3 className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 }}>Triage routing</h3>
          <p className="body" style={{ fontSize: 12.5 }}>How Cocuna escalates each level. Edit to match your clinic.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { tri: 'red',    text: 'Page on-call clinician \u00b7 SMS + phone \u00b7 patient notified' },
              { tri: 'orange', text: 'Same-day worklist \u00b7 SLA 4h \u00b7 video consult preferred' },
              { tri: 'yellow', text: 'Add to next visit \u00b7 educational handout \u00b7 reassess in 48h' },
              { tri: 'green',  text: 'Self-care content \u00b7 reflag if symptoms change' },
              { tri: 'gray',   text: 'Nurse outreach \u00b7 clarifying questions before triage' },
            ].map(r => (
              <div key={r.tri} style={{
                display: 'flex', gap: 12, alignItems: 'center',
                padding: '10px 12px', borderRadius: 10, background: 'var(--surface-soft)',
                borderLeft: `3px solid var(--triage-${r.tri})`,
              }}>
                <span className={`triage-pill ${r.tri}`} style={{ minWidth: 70, justifyContent: 'center' }}><span className="dot"></span>{D.TRIAGE[r.tri].short}</span>
                <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)' }}>{r.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="drawer-grid-2">
        <SettingsToggleGroup title="Notifications" rows={[
          { k: 'Red escalations \u2014 phone + SMS', on: true },
          { k: 'Orange \u2014 SMS', on: true },
          { k: 'Yellow \u2014 inbox only', on: true },
          { k: 'Mother replied to my message', on: true },
          { k: 'Daily morning brief at 7:30am', on: true },
        ]}/>
        <SettingsToggleGroup title="Privacy & data" rows={[
          { k: 'Patient consent gates all data sharing', on: true, locked: true },
          { k: 'Patient transcripts visible to nurses', on: false },
          { k: 'Use anonymized cohort for analytics', on: true },
          { k: 'Send data to clinic EHR (Epic)', on: true },
          { k: 'Allow Cocuna to suggest protocol updates', on: false },
        ]}/>
      </div>
    </div>
  );
};

const SettingsToggleGroup = ({ title, rows }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    <h3 className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 17, color: 'var(--text)', letterSpacing: '-0.01em', margin: 0 }}>{title}</h3>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {rows.map(r => (
        <div key={r.k} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 4px', borderBottom: '1px solid var(--hairline-soft)',
        }}>
          <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)' }}>{r.k}</span>
          <ToggleSwitch on={r.on} disabled={r.locked} />
        </div>
      ))}
    </div>
  </div>
);

const ToggleSwitch = ({ on, disabled }) => {
  const [state, setState] = useStateAux(on);
  return (
    <button onClick={() => !disabled && setState(s => !s)} style={{
      width: 38, height: 22, borderRadius: 999,
      background: state ? 'var(--accent-deep)' : 'var(--surface-sunk)',
      border: '1px solid ' + (state ? 'var(--accent-deep)' : 'var(--hairline)'),
      position: 'relative', transition: 'background 160ms',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.5 : 1,
    }}>
      <span style={{
        position: 'absolute', top: 2, left: state ? 18 : 2,
        width: 16, height: 16, borderRadius: '50%',
        background: 'white',
        transition: 'left 160ms',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </button>
  );
};

Object.assign(window, { LoginScreen, ScheduleScreen, SettingsScreen });
