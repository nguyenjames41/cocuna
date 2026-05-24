/* global React */
/* Small auxiliary screens: Mother-app preview and Protocols library. */

const { Icon: IconE } = window;

/* ===== Mother-app preview (a frame showing the patient's experience) ===== */
const MotherViewScreen = () => {
  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <IconE name="phone" size={18} color="var(--accent-deep)" />
          <div>
            <div className="eyebrow">Bridge</div>
            <div className="serif" style={{ fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 22, letterSpacing: '-0.018em', color: 'var(--text)' }}>
              What your patient sees right now
            </div>
            <p className="body" style={{ marginTop: 4, maxWidth: 600 }}>
              When you act in the clinic, Maria sees a corresponding update on her phone. No surprise messages, no chaotic threads — one continuity layer.
            </p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 20, alignItems: 'start' }}>
        <PhoneFrame>
          <div style={{ padding: '22px 22px 30px', height: '100%', display: 'flex', flexDirection: 'column', gap: 18, background: '#F5F4F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
              <span>9:14</span>
              <span>{'\u2022\u2022\u2022'}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <span className="eyebrow">Right now</span>
              <span className="serif" style={{ fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 30, letterSpacing: '-0.022em', lineHeight: 1.05, color: 'var(--text)' }}>Maria.</span>
              <p className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 500, fontSize: 17, color: 'var(--text)', lineHeight: 1.25, margin: 0 }}>
                You{'\u2019'}re 8 days postpartum.
              </p>
            </div>

            <div style={{
              padding: '18px 18px 16px', background: 'rgba(216,82,94,0.10)',
              border: '1px solid rgba(216,82,94,0.20)',
              borderRadius: 18,
              display: 'flex', flexDirection: 'column', gap: 10,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span className="triage-pill red"><span className="dot"></span>Urgent</span>
                <span style={{ flex: 1 }} />
                <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--triage-red)', fontWeight: 600 }}>RIDE ARRIVES 6 MIN</span>
              </div>
              <div className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.012em', lineHeight: 1.2 }}>
                Go to Huntington Hospital ER now.
              </div>
              <p className="body" style={{ fontSize: 12.5 }}>Dr. Patel is notified. Bring your phone — we{'\u2019'}ll show staff your BP log on arrival.</p>
              <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
                <button className="btn btn-urgent" style={{ flex: 1, fontSize: 12 }}>Track ride</button>
                <button className="btn btn-ghost" style={{ flex: 1, fontSize: 12 }}>Call clinic</button>
              </div>
            </div>

            <div style={{
              padding: 14, background: 'rgba(196, 166, 214, 0.18)', borderRadius: 16,
              display: 'flex', alignItems: 'center', gap: 12,
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'white', display: 'grid', placeItems: 'center', overflow: 'hidden' }}>
                <img src="doctor-patel.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>Dr. Sarah Patel saw your update</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>online {'\u00B7'} replying now</div>
              </div>
              <span className="triage-dot triage-green-dot" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 'auto' }}>
              <span className="eyebrow">A small check-in can wait</span>
              <span className="body" style={{ fontSize: 12.5 }}>We won{'\u2019'}t ask you for mood or pain right now. We{'\u2019'}ll check back tonight.</span>
            </div>
          </div>
        </PhoneFrame>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Live continuity</span>
            <span className="serif" style={{ fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 18, color: 'var(--text)', letterSpacing: '-0.012em' }}>
              What you do in the clinic, Maria sees in her hand.
            </span>
            <p className="body">Triage outcome → her screen. Booked visit → her calendar. Soft mental-health flag → never visible to her, only to you.</p>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">Privacy contract</span>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                'Triage outcome (Red) {\u2192} clinic + receiving ED.',
                'BP log + symptoms {\u2192} clinic + receiving ED.',
                'Mother-Hera transcript {\u2192} clinic, but not ED unless mother consents.',
                'Mood history & EPDS verbatim {\u2192} kept private.',
              ].map((line, i) => (
                <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)' }}>
                  <span className="triage-dot" style={{ background: 'var(--accent)', marginTop: 7 }} />
                  <span>{line.replace('{\u2192}', '\u2192')}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Mother-side metrics, today</span>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <MiniStat label="Open conversations" value="11" />
              <MiniStat label="Awaiting mother reply" value="4" />
              <MiniStat label="Visit confirmations sent" value="9" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MiniStat = ({ label, value }) => (
  <div style={{ padding: '10px 12px', background: 'var(--surface-soft)', borderRadius: 10, display: 'flex', flexDirection: 'column', gap: 4 }}>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500 }}>{label}</span>
    <span className="num" style={{ fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.012em' }}>{value}</span>
  </div>
);

const PhoneFrame = ({ children }) => (
  <div style={{
    width: '100%', height: 720, maxWidth: 420,
    background: '#F5F4F0',
    borderRadius: 42,
    padding: 8,
    boxShadow: '0 24px 60px rgba(42,39,35,0.18), inset 0 0 0 1px rgba(42,39,35,0.10)',
    position: 'relative', overflow: 'hidden',
    border: '1px solid var(--hairline-strong)',
  }}>
    <div style={{
      position: 'absolute', top: 12, left: '50%', transform: 'translateX(-50%)',
      width: 100, height: 24, background: '#0F0D0B', borderRadius: 16, zIndex: 2,
    }} />
    <div style={{ width: '100%', height: '100%', borderRadius: 36, overflow: 'hidden', background: '#F5F4F0' }}>
      {children}
    </div>
  </div>
);

/* ===== Protocols library ===== */
const ProtocolsScreen = () => {
  const protocols = [
    {
      family: 'Maternal · severe',
      items: [
        { title: 'Severe Hypertension in Pregnancy', source: 'ACOG · 2025', triage: 'red',
          summary: 'BP ≥160/110 at any point antepartum or postpartum requires urgent evaluation. Postpartum HTN can occur up to 6 weeks post-delivery.' },
        { title: 'Postpartum hemorrhage', source: 'ACOG · 2024', triage: 'red',
          summary: 'Bleeding > one pad per hour, dizziness, light-headedness: ED triage.' },
        { title: 'Pre-eclampsia red flags', source: 'AHA Maternal · 2025', triage: 'red',
          summary: 'Severe persistent headache, vision changes, RUQ pain, swelling face/hands, BP ≥140/90.' },
      ],
    },
    {
      family: 'Maternal · mental health',
      items: [
        { title: 'EPDS — Edinburgh Postnatal', source: 'Cox JL · re-validated 2024', triage: 'orange',
          summary: '10 items. ≥13 suggests probable depression. Q10 = self-harm screen.' },
        { title: 'PHQ-9 in pregnancy', source: 'ACOG Perinatal MH · 2023', triage: 'orange',
          summary: 'Pregnancy-validated. Question 9 mandates safety follow-up if positive.' },
      ],
    },
    {
      family: 'Pediatric',
      items: [
        { title: 'Febrile infant under 3 months', source: 'AAP · 2024 update', triage: 'red',
          summary: 'Rectal temp ≥38°C / 100.4°F under 3 months requires prompt evaluation.' },
        { title: 'Newborn feeding & weight gain', source: 'AAP Bright Futures · 2024', triage: 'yellow',
          summary: 'Birth weight regained by day 14. <20g/day weight gain after 2 weeks warrants review.' },
      ],
    },
    {
      family: 'Lactation',
      items: [
        { title: 'Mastitis', source: 'ABM #36 · 2024', triage: 'orange',
          summary: 'Pain + fever + redness + chills. Antibiotic-considered if symptoms persist >24h.' },
        { title: 'Latch and supply', source: 'ABM #26 · 2024', triage: 'yellow',
          summary: '7+ wet diapers and weight gain >20g/day usually indicate adequate supply.' },
      ],
    },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <IconE name="protocols" size={20} color="var(--accent-deep)" />
        <div>
          <div className="eyebrow">Library</div>
          <div className="serif" style={{ fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 22, letterSpacing: '-0.018em', color: 'var(--text)' }}>
            Protocols Cocuna routes against
          </div>
          <p className="body" style={{ marginTop: 4 }}>Every triage outcome is anchored to a citable source. RAD = Retrieval-Augmented Decisioning.</p>
        </div>
        <span style={{ flex: 1 }} />
        <button className="btn btn-ghost">+ Add clinic-specific protocol</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {protocols.map(group => (
          <div key={group.family} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">{group.family}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {group.items.map(item => (
                <div key={item.title} style={{
                  padding: 14,
                  background: 'var(--surface-soft)',
                  borderRadius: 12,
                  borderLeft: `3px solid var(--triage-${item.triage})`,
                  display: 'flex', flexDirection: 'column', gap: 6,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{item.title}</span>
                    <span style={{ flex: 1 }} />
                    <span className={`triage-pill ${item.triage}`}><span className="dot"></span>{window.COCUNA_DATA.TRIAGE[item.triage].short}</span>
                  </div>
                  <p className="body" style={{ fontSize: 12 }}>{item.summary}</p>
                  <span className="protocol-tag" style={{ alignSelf: 'flex-start' }}><IconE name="shield" size={10}/> {item.source}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

window.MotherViewScreen = MotherViewScreen;
window.ProtocolsScreen  = ProtocolsScreen;
