/* global React */
/* Demo-specific screens & components:
   - Maria acute alert hero on home
   - Jane mental-health proactive card on home
   - Jane mental-health chat flow with consent + connection
   - Privacy disclosure panel (shared / not shared) */

const { useState: useStateD, useEffect: useEffectD, useRef: useRefD } = React;
const DD = () => window.COCUNA_DATA;

/* ============================================================
   ALERT HERO (Maria, acute)
   ============================================================ */
const MariaAcuteHero = ({ onOpenAsk }) => (
  <button onClick={onOpenAsk} style={{
    textAlign: 'left',
    background: 'linear-gradient(135deg, #FBEFEF 0%, #F4D6D6 100%)',
    border: '1px solid rgba(216, 82, 94, 0.20)',
    borderLeft: '4px solid var(--triage-red)',
    borderRadius: 18,
    padding: '16px 18px',
    cursor: 'pointer',
    display: 'flex', flexDirection: 'column', gap: 10,
    boxShadow: '0 8px 22px rgba(216, 82, 94, 0.10)',
    animation: 'gentle-pulse 2200ms ease-in-out infinite',
  }}>
    <div className="row center between">
      <div className="row center g-2">
        <span className="triage-dot triage-red" style={{ width: 9, height: 9 }} />
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--triage-red)', fontWeight: 700,
        }}>Action needed now</span>
      </div>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)',
        letterSpacing: '0.04em',
      }}>8:02 AM today</span>
    </div>
    <h3 className="serif" style={{
      fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 20,
      letterSpacing: '-0.014em', lineHeight: 1.18, margin: 0, color: 'var(--text)',
    }}>Your BP reading is severe.</h3>
    <p style={{
      fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.5, color: 'var(--text)',
      opacity: 0.85, margin: 0,
    }}>158 / 102 with headache and visual spots. Hera is ready to help.</p>
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, alignSelf: 'flex-start',
      padding: '7px 12px', borderRadius: 999,
      background: 'var(--triage-red)', color: '#FFFFFF',
      fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
      marginTop: 2,
    }}>
      Talk to Hera now
      <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
        <path d="M2 5.5 H9 M6 2.5 L9 5.5 L6 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </span>
  </button>
);

/* ============================================================
   PROACTIVE HERA CARD (Jane, mental health)
   ============================================================ */
const JaneQuietHero = ({ onOpenAsk }) => {
  const { JANE_MOOD_TREND } = DD();
  return (
    <button onClick={onOpenAsk} style={{
      textAlign: 'left',
      background: 'linear-gradient(135deg, #F1ECF6 0%, #E6D9EF 100%)',
      border: '1px solid rgba(124, 110, 174, 0.18)',
      borderRadius: 22,
      padding: '18px 20px',
      cursor: 'pointer',
      display: 'flex', flexDirection: 'column', gap: 14,
      boxShadow: '0 10px 26px rgba(124, 110, 174, 0.10)',
    }}>
      <div className="row center between">
        <div className="row center g-2">
          <HeraDot />
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.18em',
            textTransform: 'uppercase', color: 'var(--text)', fontWeight: 700,
          }}>Hera, this morning</span>
        </div>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)',
          letterSpacing: '0.04em',
        }}>Quiet for 4 days</span>
      </div>
      <p className="serif" style={{
        fontVariationSettings: '"opsz" 96', fontWeight: 500, fontSize: 19,
        letterSpacing: '-0.01em', lineHeight: 1.3, margin: 0, color: 'var(--text)',
      }}>
        Hi Jane. It{'\u2019'}s been a few quiet days. I just want to check on you.
        Would you like to talk?
      </p>
      <MoodTrendStrip data={JANE_MOOD_TREND} />
      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <span style={{
          padding: '7px 12px', borderRadius: 999,
          background: 'var(--text)', color: 'var(--bg)',
          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          Yes, let{'\u2019'}s talk
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M2 5.5 H9 M6 2.5 L9 5.5 L6 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </span>
        <span style={{
          padding: '7px 12px', borderRadius: 999,
          background: 'var(--surface)', color: 'var(--text)',
          border: '1px solid var(--hairline)',
          fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 500,
        }}>Not right now</span>
      </div>
    </button>
  );
};

const HeraDot = () => (
  <span style={{
    width: 10, height: 10, borderRadius: '50%',
    background:
      'radial-gradient(circle at 35% 30%, var(--accent-soft) 0%, var(--accent) 70%, var(--accent-mint) 100%)',
    animation: 'breathe-soft 2400ms ease-in-out infinite',
  }} />
);

/* Mood trend strip (7 day, simple bars + dots) */
const MoodTrendStrip = ({ data }) => {
  const max = 5;
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      height: 56, padding: '0 2px',
    }}>
      {data.map((d, i) => (
        <div key={i} style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
          flex: 1, height: '100%',
        }}>
          <div style={{
            flex: 1,
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
            width: '100%',
          }}>
            {d.logged ? (
              <div style={{
                width: 6,
                height: `${(d.mood / max) * 100}%`,
                background: d.mood <= 2 ? 'var(--triage-orange)' : 'var(--text-muted)',
                borderRadius: 3,
                opacity: 0.85,
              }} />
            ) : (
              <div style={{
                width: 6, height: 6, borderRadius: '50%',
                border: '1.4px dashed var(--text-faint)',
                opacity: 0.7,
              }} />
            )}
          </div>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 9, letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: d.logged ? 'var(--text)' : 'var(--text-faint)',
            fontWeight: d.logged ? 600 : 500,
          }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
};

/* ============================================================
   PRIVACY DISCLOSURE (used on all result cards)
   ============================================================ */
const PrivacyDisclosure = ({ privacy }) => (
  <div style={{
    background: 'var(--surface-sunk)',
    border: '1px solid var(--hairline-soft)',
    borderRadius: 14,
    padding: 14,
    display: 'flex', flexDirection: 'column', gap: 10,
  }}>
    <div className="row center g-2">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5 L 11.5 3.5 V 7 C 11.5 9.5 9.5 11.5 7 12.5 C 4.5 11.5 2.5 9.5 2.5 7 V 3.5 L 7 1.5 Z"
          stroke="var(--text)" strokeWidth="1.3" fill="none" />
        <path d="M5 7.2 L 6.4 8.6 L 9 6" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="label-cap">Privacy {'\u00B7'} who sees what</span>
    </div>

    {privacy.sharedWith.map((s, i) => (
      <div key={i} style={{
        display: 'flex', flexDirection: 'column', gap: 4,
        paddingLeft: 2,
      }}>
        <div className="row center between">
          <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 12.5, color: 'var(--text)' }}>{s.name}</span>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.06em',
            color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600,
          }}>Shared</span>
        </div>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{s.detail}</span>
        <ul style={{ margin: '4px 0 0', padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {s.items.map(it => (
            <li key={it} style={{
              fontFamily: 'var(--sans)', fontSize: 10.5,
              padding: '3px 8px',
              background: 'var(--surface)',
              border: '1px solid var(--hairline-soft)',
              borderRadius: 999,
              color: 'var(--text)',
            }}>{it}</li>
          ))}
        </ul>
      </div>
    ))}

    <div style={{
      paddingTop: 10, borderTop: '1px dashed var(--hairline)',
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.06em',
        color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600,
      }}>Never shared</span>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {privacy.notShared.map(it => (
          <li key={it} style={{
            fontFamily: 'var(--sans)', fontSize: 10.5,
            padding: '3px 8px',
            color: 'var(--text-muted)',
            border: '1px dashed var(--hairline)',
            borderRadius: 999,
          }}>{it}</li>
        ))}
      </ul>
    </div>
  </div>
);

/* ============================================================
   URGENT RESULT (Maria) — extended result with urgent site
   ============================================================ */
const UrgentResultCard = ({ payload, expert, urgentSite, onCarePlan, onOpenExpert }) => (
  <article style={{
    background: 'var(--surface)',
    border: '1px solid var(--hairline-soft)',
    borderRadius: 22,
    overflow: 'hidden',
  }}>
    <div className="bg-triage-red" style={{ height: 4 }} />
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row center between">
        <div className="row center g-2">
          <span className="triage-dot triage-red" />
          <span className="eyebrow" style={{ color: 'var(--text)' }}>{payload.level}</span>
          <span style={{ color: 'var(--text-faint)', fontSize: 10 }}>{'\u00B7'}</span>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.04em',
          }}>{payload.protocol}</span>
        </div>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500,
        }}>RAD v0.1</span>
      </div>

      <h3 className="serif" style={{
        fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
        lineHeight: 1.12, letterSpacing: '-0.018em', margin: 0, color: 'var(--text)',
      }}>{payload.headline}</h3>

      <p className="body">{payload.reason}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {payload.flags.map(f => (
          <span key={f} style={{
            fontFamily: 'var(--sans)', fontSize: 11,
            padding: '5px 10px',
            background: 'var(--surface-sunk)',
            border: '1px solid var(--hairline-soft)',
            borderRadius: 999, color: 'var(--text)',
          }}>{f}</span>
        ))}
      </div>

      <hr className="divider" />

      {/* Routed to: URGENT CARE (separate from clinic) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="label-cap">Routing you to urgent care</span>
        <div style={{
          padding: 14,
          background: 'linear-gradient(135deg, #FBEFEF 0%, #F8E2E2 100%)',
          borderRadius: 14,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <div className="row center between">
            <h4 style={{ fontFamily: 'var(--sans)', fontWeight: 700, fontSize: 14, color: 'var(--text)', margin: 0 }}>{urgentSite.name}</h4>
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 11, fontWeight: 600,
              color: 'var(--triage-red)',
            }}>{urgentSite.distance}</span>
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            {urgentSite.detail} {'\u00B7'} {urgentSite.address}
          </p>
          <div className="row g-2" style={{ marginTop: 4 }}>
            <button style={{
              flex: 1, padding: '10px 12px', borderRadius: 12,
              background: 'var(--triage-red)', color: '#FFFFFF',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M5.5 1 C 3.5 1 2 2.5 2 4.5 C 2 7 5.5 10 5.5 10 C 5.5 10 9 7 9 4.5 C 9 2.5 7.5 1 5.5 1 Z" stroke="currentColor" strokeWidth="1.1" fill="none"/>
                <circle cx="5.5" cy="4.5" r="1.2" fill="currentColor" />
              </svg>
              Directions
            </button>
            <button style={{
              flex: 1, padding: '10px 12px', borderRadius: 12,
              background: '#FFFFFF', color: 'var(--text)',
              fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600,
              border: '1px solid var(--hairline)', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            }}>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 1.5 Q 1.5 4 4 6.5 Q 6.5 9 8.5 8.5 L 9 7 L 7 6 L 6 7 Q 4.5 6 3.5 4.5 L 4.5 3.5 L 3.5 1.5 Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" fill="none"/>
              </svg>
              Call ER
            </button>
          </div>
        </div>
      </section>

      {/* Notified: clinic (separate from urgent care) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="label-cap">Your clinic, notified to follow up</span>
        <button onClick={onOpenExpert} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: 14,
          background: 'var(--surface-sunk)',
          borderRadius: 14, border: 'none', cursor: 'pointer', width: '100%',
        }}>
          <div className="expert-avatar">{expert.initials}</div>
          <div style={{ flex: 1, textAlign: 'left' }}>
            <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{expert.name}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{expert.cred} {'\u00B7'} Huntington-Hill Maternity Center</div>
          </div>
          <span style={{
            padding: '4px 9px', borderRadius: 999, background: 'var(--accent-mint-soft)',
            fontFamily: 'var(--sans)', fontSize: 10.5, fontWeight: 600, color: 'var(--text)',
            display: 'inline-flex', alignItems: 'center', gap: 5, whiteSpace: 'nowrap',
          }}>
            <span className="triage-dot triage-green" />
            Notified
          </span>
        </button>
      </section>

      {/* What to do */}
      <section>
        <p className="label-cap" style={{ marginBottom: 8 }}>What to do</p>
        <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {payload.actions.map((a, i) => (
            <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <span className="serif" style={{
                fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 14,
                width: 18, flexShrink: 0, color: 'var(--text-muted)',
              }}>{String(i + 1).padStart(2, '0')}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)' }}>{a}</span>
            </li>
          ))}
        </ol>
      </section>

      <PrivacyDisclosure privacy={payload.privacy} />

      <hr className="divider" />
      <div className="source-line" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Sources</span>
        {payload.sources.map(s => <span key={s.label}>{s.label} {'\u00B7'} {s.year}</span>)}
      </div>
    </div>
  </article>
);

/* ============================================================
   MENTAL HEALTH RESULT (Jane) — connect to psych w/ consent
   ============================================================ */
const MHResultCard = ({ payload, expert, onConsent, consentGiven, onOpenExpert }) => (
  <article style={{
    background: 'var(--surface)',
    border: '1px solid var(--hairline-soft)',
    borderRadius: 22,
    overflow: 'hidden',
  }}>
    <div className="bg-triage-yellow" style={{ height: 4 }} />
    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="row center between">
        <div className="row center g-2">
          <span className="triage-dot triage-yellow" />
          <span className="eyebrow" style={{ color: 'var(--text)' }}>{payload.level}</span>
          <span style={{ color: 'var(--text-faint)', fontSize: 10 }}>{'\u00B7'}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.04em' }}>
            {payload.protocol}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500,
        }}>RAD v0.1</span>
      </div>

      <h3 className="serif" style={{
        fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
        lineHeight: 1.12, letterSpacing: '-0.018em', margin: 0, color: 'var(--text)',
      }}>{payload.headline}</h3>

      <p className="body">{payload.reason}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {payload.flags.map(f => (
          <span key={f} style={{
            fontFamily: 'var(--sans)', fontSize: 11,
            padding: '5px 10px',
            background: 'var(--surface-sunk)',
            border: '1px solid var(--hairline-soft)',
            borderRadius: 999, color: 'var(--text)',
          }}>{f}</span>
        ))}
      </div>

      <hr className="divider" />

      {/* Match offered, with consent */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="label-cap">Match found {'\u00B7'} ready to talk now</span>
        <div style={{
          padding: 14,
          background: 'linear-gradient(135deg, #F1ECF6 0%, #E6D9EF 100%)',
          borderRadius: 14,
          display: 'flex', flexDirection: 'column', gap: 12,
        }}>
          <div className="row center g-3">
            <div className="expert-avatar">{expert.initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{expert.name}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{expert.cred}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--triage-green)', marginTop: 2, display: 'flex', alignItems: 'center', gap: 5 }}>
                <span className="triage-dot triage-green" /> online now {'\u00B7'} responds in ~3 min
              </div>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.5, color: 'var(--text)', opacity: 0.85, margin: 0 }}>
            With your permission, Hera will introduce you. You decide what we share. You can stop at any time.
          </p>
          {consentGiven ? (
            <button onClick={onOpenExpert} style={{
              padding: '12px 16px', borderRadius: 12,
              background: 'var(--text)', color: 'var(--bg)',
              fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 700,
              border: 'none', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span className="row center g-2">
                <span className="triage-dot triage-green" />
                Open chat with {expert.name.split(' ')[0]}
              </span>
              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                <path d="M2 5.5 H9 M6 2.5 L9 5.5 L6 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          ) : (
            <div className="row g-2">
              <button onClick={() => onConsent(true)} style={{
                flex: 1, padding: '10px 12px', borderRadius: 12,
                background: 'var(--text)', color: 'var(--bg)',
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 700,
                border: 'none', cursor: 'pointer',
              }}>Yes, connect me</button>
              <button onClick={() => onConsent(false)} style={{
                flex: 1, padding: '10px 12px', borderRadius: 12,
                background: '#FFFFFF', color: 'var(--text)',
                border: '1px solid var(--hairline)',
                fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              }}>Not right now</button>
            </div>
          )}
        </div>
      </section>

      {/* Soft clinic flag */}
      <div style={{
        padding: 12,
        background: 'var(--surface-sunk)',
        borderRadius: 12,
        display: 'flex', gap: 10, alignItems: 'flex-start',
      }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
          <path d="M3 1 V13 M3 2 H10 L8 4.5 L10 7 H3"
            stroke="var(--text-muted)" strokeWidth="1.3" strokeLinejoin="round" fill="none" />
        </svg>
        <div>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 2 }}>
            A soft flag to your clinic
          </div>
          <p style={{ fontFamily: 'var(--sans)', fontSize: 12, lineHeight: 1.5, color: 'var(--text-muted)', margin: 0 }}>
            Dr. Patel will see only that you might appreciate extra support, never our conversation. You can turn this off in Settings.
          </p>
        </div>
      </div>

      <PrivacyDisclosure privacy={payload.privacy} />

      <hr className="divider" />
      <div className="source-line" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
        <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Sources</span>
        {payload.sources.map(s => <span key={s.label}>{s.label} {'\u00B7'} {s.year}</span>)}
      </div>
    </div>
  </article>
);

window.MariaAcuteHero = MariaAcuteHero;
window.JaneQuietHero  = JaneQuietHero;
window.PrivacyDisclosure = PrivacyDisclosure;
window.UrgentResultCard = UrgentResultCard;
window.MHResultCard     = MHResultCard;
window.MoodTrendStrip   = MoodTrendStrip;
window.HeraDot          = HeraDot;
