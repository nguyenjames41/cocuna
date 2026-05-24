/* global React */
/* Screens: Ask (chat, voice, transparency note), Care Plan (persona aware), BP Log */

const { useState: useStateAsk, useEffect, useRef } = React;
const useRefD = useRef;
const useEffectD = useEffect;
const DA = () => window.COCUNA_DATA;
const { Motif, MotifGlyph, SheetHeader, ArrowGlyph, UrgentResultCard, MHResultCard, MoodTrendStrip } = window;

/* ============================================================
   ASK / CHAT
   ============================================================ */
const ScreenAsk = ({ direction, persona, onClose, onOpenCarePlan, onOpenClinic }) => {
  const data = DA();
  const isAcute = persona === 'maria';
  const isMH    = persona === 'jane';

  const initialThread = isAcute
    ? [
        { who: 'hera', text: 'Maria, I saw your morning reading. 158 over 102 with a headache. How are you feeling right now?' },
      ]
    : isMH
    ? [
        { who: 'hera', text: 'Hi Jane. I\u2019m glad you tapped. It\u2019s been quiet for a few days. Can you tell me a little about how things have been?' },
      ]
    : data.CHAT_INIT;

  const [thread, setThread] = useStateAsk(initialThread);
  const [stage, setStage]   = useStateAsk(isAcute || isMH ? 'walking' : 'start');
  const [draft, setDraft]   = useStateAsk('');
  const [recording, setRecording] = useStateAsk(false);
  const [showSummary, setShowSummary] = useStateAsk(false);
  const [consentGiven, setConsentGiven] = useStateAsk(false);
  const scrollRef = useRefD();

  useEffectD(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, stage]);

  const runAcute = () => {
    setThread(t => [...t, { who: 'mom', text: 'My head still hurts and I\u2019m seeing spots. I\u2019m scared.' }]);
    setStage('thinking');
    setTimeout(() => {
      setThread(t => [...t, {
        who: 'hera',
        text: 'Thank you for telling me. These together are urgent. Let me get you the right help.',
      }]);
      setStage('result-acute');
      setShowSummary(true);
    }, 1200);
  };

  const runMH = () => {
    setThread(t => [...t, { who: 'mom', text: 'I\u2019m exhausted. I cry without warning. I don\u2019t feel like myself.' }]);
    setStage('thinking');
    setTimeout(() => {
      setThread(t => [...t, {
        who: 'hera',
        text: 'Thank you for trusting me with that. What you\u2019re describing is common, and treatable. With your permission, I\u2019d like to introduce you to someone who can help.',
      }]);
      setStage('result-mh');
      setShowSummary(true);
    }, 1400);
  };

  const triggerScenario = (text) => {
    setThread(t => [...t, { who: 'mom', text }]);
    setStage('thinking');
    setTimeout(() => {
      setThread(t => [...t, {
        who: 'hera',
        text: 'Thank you for telling me. These symptoms together are urgent.',
      }]);
      setStage('result-acute');
      setShowSummary(true);
    }, 1100);
  };

  const sendDraft = () => {
    if (!draft.trim()) return;
    if (isAcute) runAcute();
    else if (isMH) runMH();
    else triggerScenario(draft.trim());
    setDraft('');
  };

  const toggleRecord = () => {
    if (recording) {
      setRecording(false);
      setTimeout(() => {
        if (isAcute) runAcute();
        else if (isMH) runMH();
        else triggerScenario('I am 6 weeks postpartum with a bad headache and visual spots, BP 158 over 102.');
      }, 200);
    } else {
      setRecording(true);
    }
  };

  return (
    <>
      <SheetHeader title="Ask Hera" onClose={onClose} direction={direction} />
      <TransparencyBanner showSummary={showSummary} mode={isAcute ? 'acute' : isMH ? 'mh' : 'general'} />

      <div className="screen-body" ref={scrollRef}>
        <div style={{ padding: '16px 22px 8px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {thread.map((m, i) => m.who === 'hera'
            ? <HeraMsg key={i} direction={direction} text={m.text} />
            : <MomBubble key={i} text={m.text} />
          )}

          {stage === 'thinking' && <HeraMsg direction={direction} text={<TypingDots />} />}

          {stage === 'result-acute' && (
            <div className="slide-up">
              <UrgentResultCard
                payload={data.RESULT_PAYLOAD}
                expert={data.EXPERTS.find(e => e.id === 'patel')}
                urgentSite={data.URGENT_SITES.hospital}
                onCarePlan={onOpenCarePlan}
                onOpenExpert={onOpenClinic}
              />
            </div>
          )}

          {stage === 'result-mh' && (
            <div className="slide-up">
              <MHResultCard
                payload={data.MH_RESULT_PAYLOAD}
                expert={data.EXPERTS.find(e => e.id === 'ruiz')}
                onConsent={(yes) => setConsentGiven(yes)}
                consentGiven={consentGiven}
                onOpenExpert={() => onOpenClinic('ruiz')}
              />
            </div>
          )}

          {stage === 'walking' && (isAcute || isMH) && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
              {(isAcute ? [
                'My head still hurts',
                'I\u2019m seeing spots',
                'My BP is still high',
              ] : [
                'I haven\u2019t been sleeping',
                'I cry without warning',
                'I don\u2019t feel like myself',
              ]).map(q => (
                <button key={q} className="chip" onClick={() => {
                  setThread(t => [...t, { who: 'mom', text: q }]);
                  isAcute ? runAcute() : runMH();
                }}>{q}</button>
              ))}
            </div>
          )}

          {stage === 'start' && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, paddingTop: 4 }}>
              {data.QUICK_STARTS.map(q => (
                <button key={q} className="chip" onClick={() => triggerScenario(q)}>{q}</button>
              ))}
            </div>
          )}
        </div>
      </div>

      {recording && <VoiceRecordingOverlay onStop={toggleRecord} />}

      <div style={{
        display: 'flex', alignItems: 'flex-end', gap: 10, padding: '10px 18px 18px',
        borderTop: '1px solid var(--hairline-soft)', flexShrink: 0, background: 'var(--bg)',
      }}>
        <input
          className="input"
          style={{ flex: 1, padding: '12px 16px', fontSize: 14, borderRadius: 16 }}
          placeholder="Tell Hera what is happening"
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendDraft()}
        />
        {draft.trim() ? (
          <button onClick={sendDraft} style={sendButtonStyle}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 13 V3 M4 7 L8 3 L12 7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        ) : (
          <button onClick={toggleRecord} style={{
            ...sendButtonStyle,
            background: recording ? 'var(--triage-red)' : 'var(--text)',
          }} title="Voice">
            <MicGlyph />
          </button>
        )}
      </div>
    </>
  );
};

const sendButtonStyle = {
  width: 44, height: 44, borderRadius: '50%',
  background: 'var(--text)', color: 'var(--bg)',
  display: 'grid', placeItems: 'center',
  flexShrink: 0, cursor: 'pointer',
  border: 'none', transition: 'background 200ms',
};

const MicGlyph = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 18 18" fill="none">
    <rect x="6.5" y="2" width="5" height="9" rx="2.5" fill="currentColor" />
    <path d="M3.5 8 V9 A 5.5 5.5 0 0 0 14.5 9 V8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" fill="none" />
    <line x1="9" y1="14.5" x2="9" y2="16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

/* Transparency banner */
const TransparencyBanner = ({ showSummary, mode = 'general' }) => {
  const summary = mode === 'acute' ? {
    badge: 'red',
    text: 'Routed to urgent care \u00B7 clinic notified',
  } : mode === 'mh' ? {
    badge: 'yellow',
    text: 'Match drafted \u00B7 not sent without your yes',
  } : {
    badge: 'red',
    text: 'Sent to Dr. Patel \u00B7 summary \u00B7 4 key facts',
  };
  return (
    <div style={{
      padding: '10px 22px 12px',
      background: 'var(--surface-sunk)',
      borderBottom: '1px solid var(--hairline-soft)',
      flexShrink: 0,
      display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
          <path d="M7 1.5 L 11.5 3.5 V 7 C 11.5 9.5 9.5 11.5 7 12.5 C 4.5 11.5 2.5 9.5 2.5 7 V 3.5 L 7 1.5 Z"
            stroke="var(--accent-mint)" strokeWidth="1.3" fill="none" />
          <path d="M5 7.2 L 6.4 8.6 L 9 6" stroke="var(--accent-mint)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <p style={{
          fontFamily: 'var(--sans)', fontSize: 11.5, lineHeight: 1.5,
          color: 'var(--text-muted)', margin: 0, flex: 1,
        }}>
          Hera replies only from your care team{'\u2019'}s clinical playbook and your clinicians. No general internet sources. Your conversation is recorded and summarised in real time, only with the people you choose.
        </p>
      </div>
      {showSummary && (
        <div style={{
          marginLeft: 24,
          padding: '8px 10px',
          background: 'var(--surface)',
          border: '1px solid var(--hairline-soft)',
          borderRadius: 8,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span className={`triage-dot triage-${summary.badge}`} />
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text)',
          }}>{summary.text}</span>
        </div>
      )}
    </div>
  );
};

/* Voice recording overlay (bottom sheet, peeking from above composer) */
const VoiceRecordingOverlay = ({ onStop }) => (
  <div style={{
    position: 'absolute', left: 16, right: 16, bottom: 96,
    background: 'var(--text)', color: 'var(--bg)',
    borderRadius: 20, padding: '16px 18px',
    display: 'flex', alignItems: 'center', gap: 14,
    boxShadow: '0 16px 40px rgba(42, 39, 35, 0.25)',
    zIndex: 30,
    animation: 'slide-up 320ms cubic-bezier(0.2, 0.7, 0.2, 1)',
  }}>
    <div style={{
      width: 38, height: 38, borderRadius: '50%',
      background: 'var(--triage-red)', display: 'grid', placeItems: 'center',
      animation: 'breathe-soft 1100ms ease-in-out infinite', flexShrink: 0,
    }}>
      <span style={{ width: 10, height: 10, background: '#FFFFFF', borderRadius: 2, display: 'block' }} />
    </div>
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{
        fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.18em',
        textTransform: 'uppercase', opacity: 0.6,
      }}>Recording</span>
      <Waveform />
    </div>
    <button onClick={onStop} style={{
      padding: '8px 14px', borderRadius: 999, background: 'var(--bg)', color: 'var(--text)',
      fontFamily: 'var(--sans)', fontSize: 12, fontWeight: 600, border: 'none', cursor: 'pointer',
    }}>Stop</button>
  </div>
);

const Waveform = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 22 }}>
    {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19].map(i => (
      <span key={i} style={{
        width: 2,
        background: 'currentColor',
        opacity: 0.9,
        borderRadius: 1,
        height: 4 + (i % 4) * 4,
        animation: `wave-bar 900ms ease-in-out ${i * 50}ms infinite alternate`,
      }} />
    ))}
  </div>
);

const HeraMsg = ({ direction, text }) => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', paddingRight: 48 }}>
    <MotifGlyph direction={direction} size={20} />
    <div style={{
      fontFamily: 'var(--sans)',
      fontSize: 14.5, lineHeight: 1.5, color: 'var(--text)',
      paddingTop: 1,
    }}>{text}</div>
  </div>
);

const MomBubble = ({ text }) => (
  <div style={{ display: 'flex', justifyContent: 'flex-end', paddingLeft: 48 }}>
    <div style={{
      maxWidth: '100%',
      background: 'var(--surface)',
      border: '1px solid var(--hairline-soft)',
      borderRadius: 16,
      borderBottomRightRadius: 4,
      padding: '10px 14px',
      fontFamily: 'var(--sans)',
      fontSize: 14, lineHeight: 1.45, color: 'var(--text)',
    }}>{text}</div>
  </div>
);

const TypingDots = () => (
  <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center', paddingTop: 4 }}>
    {[0, 1, 2].map(i => (
      <span key={i} style={{
        width: 5, height: 5, borderRadius: '50%', background: 'var(--text-muted)',
        animation: 'breathe-soft 900ms ease-in-out infinite',
        animationDelay: `${i * 180}ms`,
      }} />
    ))}
  </span>
);

/* ============================================================
   RESULT CARD
   ============================================================ */
const ResultCard = ({ direction, payload, expert, onCarePlan, onOpenExpert }) => {
  const triageClass = `triage-${payload.triage}`;
  return (
    <article style={{
      background: 'var(--surface)',
      border: '1px solid var(--hairline-soft)',
      borderRadius: 22,
      overflow: 'hidden',
    }}>
      <div className={`bg-${triageClass}`} style={{ height: 4 }} />

      <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div className="row center between">
          <div className="row center g-2">
            <span className={`triage-dot ${triageClass}`} />
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
              borderRadius: 999,
              color: 'var(--text)',
            }}>{f}</span>
          ))}
        </div>

        <hr className="divider" />

        <section>
          <p className="label-cap" style={{ marginBottom: 8 }}>What to do</p>
          <ol style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
            {payload.actions.map((a, i) => (
              <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span className="serif" style={{
                  fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 14,
                  width: 18, flexShrink: 0, color: 'var(--text-muted)',
                }}>{String(i + 1).padStart(2, '0')}</span>
                <span style={{
                  fontFamily: 'var(--sans)', fontSize: 13.5, lineHeight: 1.5, color: 'var(--text)',
                }}>{a}</span>
              </li>
            ))}
          </ol>
        </section>

        <div style={{
          padding: 14,
          background: 'var(--surface-sunk)',
          borderRadius: 16,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          <span className="label-cap">Your clinician, notified</span>
          <button onClick={onOpenExpert} style={{
            display: 'flex', alignItems: 'center', gap: 12,
            background: 'none', border: 'none', padding: 0, cursor: 'pointer',
          }}>
            <div className="expert-avatar">{expert.initials}</div>
            <div style={{ flex: 1, textAlign: 'left' }}>
              <div style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{expert.name}</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{expert.cred}</div>
            </div>
            <div style={{
              padding: '5px 10px', border: '1px solid var(--hairline)', borderRadius: 999,
              fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
              display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
            }}>
              <span className="triage-dot triage-green" />
              {expert.responds}
            </div>
          </button>
        </div>

        <button onClick={onCarePlan} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px',
          borderRadius: 14,
          background: 'var(--accent-soft)',
          fontFamily: 'var(--sans)', fontSize: 13.5, fontWeight: 600,
          color: 'var(--text)', cursor: 'pointer', border: 'none',
        }}>
          Open today{'\u2019'}s care plan
          {ArrowGlyph}
        </button>

        <hr className="divider" />
        <div className="source-line" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
          <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Sources</span>
          {payload.sources.map(s => (
            <span key={s.label}>{s.label} {'\u00B7'} {s.year}</span>
          ))}
        </div>
      </div>
    </article>
  );
};

/* ============================================================
   CARE PLAN (persona aware, no schedule BP)
   ============================================================ */
const ScreenCarePlan = ({ direction, persona, onClose }) => {
  const data = DA();
  const plan = data.CARE_PLANS[persona];
  const p = data.PERSONAS[persona];

  return (
    <>
      <SheetHeader title="Care plan" onClose={onClose} direction={direction} />
      <div className="screen-body fade-in" key={persona}>
        <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 26 }}>

          <header style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span className="eyebrow">{p.stageLabel} {'\u00B7'} {p.stageDetail}</span>
            <h2 className="serif" style={{
              fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 26,
              lineHeight: 1.18, letterSpacing: '-0.02em', margin: 0,
            }}>What care looks like today.</h2>
            <p className="body">Small, doable steps tuned to where you are this week. Skip what doesn{'\u2019'}t fit.</p>
          </header>

          {/* Today's actions */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">For today</span>
            {plan.today.map(item => (
              <CareItem key={item.title} direction={direction} item={item} />
            ))}
          </section>

          {/* Warning signs */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="row center between">
              <span className="eyebrow">Warning signs</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--triage-red)', letterSpacing: '0.06em',
              }}>Call your clinic or 911</span>
            </div>
            <div className="card">
              {plan.warnings.map((w, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 10, alignItems: 'flex-start',
                  padding: '8px 0',
                  borderBottom: i < plan.warnings.length - 1 ? '1px solid var(--hairline-soft)' : 'none',
                }}>
                  <span className="triage-dot triage-red" style={{ marginTop: 7, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--sans)', fontSize: 14, lineHeight: 1.45, color: 'var(--text)' }}>{w}</span>
                </div>
              ))}
            </div>
          </section>

          <div className="source-line" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 4 }}>
            <span style={{ letterSpacing: '0.18em', textTransform: 'uppercase', fontSize: 9.5, fontWeight: 500 }}>Protocols</span>
            {plan.sources.map(s => <span key={s}>{s}</span>)}
          </div>

          {/* Talk to a doctor right now */}
          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">Do you want to book a call right now?</span>
            <p className="body-tight" style={{ margin: 0, marginBottom: 2 }}>
              These clinicians are available to take you within minutes. Pick whoever feels right.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {DA().EXPERTS.map(e => <BookCallRow key={e.id} expert={e} />)}
            </div>
            <p style={{
              fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)',
              textAlign: 'center', margin: 0, marginTop: 4, letterSpacing: '0.02em',
            }}>
              Visits are recorded and added to your file at Huntington-Hill Maternity Center.
            </p>
          </section>

        </div>
      </div>
    </>
  );
};

const CareItem = ({ direction, item }) => (
  <div className="card" style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
    <CareIcon name={item.icon} accent={item.accent} />
    <div style={{ flex: 1 }}>
      <h4 style={{
        fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14,
        color: 'var(--text)', margin: '0 0 4px',
      }}>{item.title}</h4>
      <p style={{
        fontFamily: 'var(--sans)', fontSize: 13, lineHeight: 1.5,
        color: 'var(--text-muted)', margin: 0,
      }}>{item.body}</p>
    </div>
    <button style={{
      width: 28, height: 28, borderRadius: '50%',
      border: '1px solid var(--hairline)', background: 'var(--surface)',
      display: 'grid', placeItems: 'center', cursor: 'pointer', flexShrink: 0,
    }}>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2.5 6.5 L5 9 L9.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.5"/>
      </svg>
    </button>
  </div>
);

const CareIcon = ({ name, accent }) => {
  const accentBg = {
    rose:     'var(--accent-rose)',
    lavender: 'var(--accent-soft)',
    mint:     'var(--accent-mint-soft)',
    peach:    'var(--accent-peach)',
    butter:   'var(--accent-butter)',
  }[accent] || 'var(--accent-soft)';

  const s = 32;
  const wrap = (children) => (
    <div style={{
      width: s, height: s, borderRadius: 10, background: accentBg,
      display: 'grid', placeItems: 'center', flexShrink: 0,
    }}>{children}</div>
  );

  if (name === 'drop') return wrap(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M8 2 C 5 6 4 8.5 4 10.5 A 4 4 0 0 0 12 10.5 C 12 8.5 11 6 8 2 Z" stroke="var(--text)" strokeWidth="1.3" fill="none"/>
    </svg>
  );
  if (name === 'breath') return wrap(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="var(--text)" strokeWidth="1.3" />
      <circle cx="8" cy="8" r="6" stroke="var(--text)" strokeWidth="1.3" opacity="0.4" />
    </svg>
  );
  if (name === 'foot') return wrap(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M4 11 Q 4 6, 7 6 Q 10 6, 10 9 Q 10 12, 7 13 Q 4 13, 4 11 Z" stroke="var(--text)" strokeWidth="1.3" fill="none" />
      <circle cx="11" cy="5" r="0.8" fill="var(--text)" />
      <circle cx="12.5" cy="6.5" r="0.7" fill="var(--text)" />
      <circle cx="12" cy="8" r="0.7" fill="var(--text)" />
    </svg>
  );
  if (name === 'sun') return wrap(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="2.5" stroke="var(--text)" strokeWidth="1.3" />
      <path d="M8 1 V3 M8 13 V15 M1 8 H3 M13 8 H15 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3"
        stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
  if (name === 'baby') return wrap(
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="6" r="3" stroke="var(--text)" strokeWidth="1.3" />
      <path d="M5 11 Q 8 13 11 11" stroke="var(--text)" strokeWidth="1.3" strokeLinecap="round" fill="none" />
      <circle cx="7" cy="6" r="0.5" fill="var(--text)" />
      <circle cx="9" cy="6" r="0.5" fill="var(--text)" />
    </svg>
  );
  return wrap(<span />);
};

/* ============================================================
   BP LOG
   ============================================================ */
const ScreenBPLog = ({ direction, onClose }) => {
  const data = DA();
  const readings = data.BP_READINGS;
  return (
    <>
      <SheetHeader title="Blood pressure" onClose={onClose} direction={direction} />
      <div className="screen-body fade-in">
        <div style={{ padding: '20px 24px 32px', display: 'flex', flexDirection: 'column', gap: 22 }}>

          <header>
            <span className="eyebrow">Latest reading</span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 14, marginTop: 6 }}>
              <span className="serif" style={{
                fontVariationSettings: '"opsz" 144', fontWeight: 600, fontSize: 64,
                lineHeight: 1, letterSpacing: '-0.034em', color: 'var(--triage-red)',
              }}>158</span>
              <span className="serif" style={{
                fontVariationSettings: '"opsz" 96', fontWeight: 500, fontSize: 38,
                lineHeight: 1, color: 'var(--text-muted)',
              }}>/ 102</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
                letterSpacing: '0.04em', marginLeft: 'auto',
              }}>Today, 8:02 AM</span>
            </div>
            <div className="row center g-2" style={{ marginTop: 10 }}>
              <span className="triage-dot triage-red" />
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--triage-red)', fontWeight: 600 }}>Severe</span>
              <span style={{ color: 'var(--text-faint)' }}>{'\u00B7'}</span>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>Headache and visual spots reported</span>
            </div>
          </header>

          <div className="card" style={{ padding: 18 }}>
            <div className="row center between" style={{ marginBottom: 16 }}>
              <span className="eyebrow">Past 7 days</span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)', letterSpacing: '0.04em',
              }}>Systolic / Diastolic</span>
            </div>
            <BPChart readings={readings} />
            <div className="row center between" style={{ marginTop: 12 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
                Avg 138 / 89 across 7 days
              </span>
              <span style={{
                fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--triage-red)', fontWeight: 600,
              }}>{'\u2197'} 11 over yesterday</span>
            </div>
          </div>

          <button className="btn-primary">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2 V12 M2 7 H12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
            </svg>
            Log a new reading
          </button>

          <section style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span className="eyebrow">All readings</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {readings.map((r, i) => (
                <div key={i} className="card" style={{
                  padding: '12px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <span className={`triage-dot triage-${r.triage}`} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)', fontWeight: 500,
                    }}>{r.sys} / {r.dia}</div>
                    <div style={{
                      fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)',
                      whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>{r.date}{r.note ? ` ${'\u00B7'} ${r.note}` : ''}</div>
                  </div>
                  <span style={{
                    fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.06em',
                    textTransform: 'uppercase', color: `var(--triage-${r.triage})`, fontWeight: 600,
                  }}>{r.triage}</span>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

const BPChart = ({ readings }) => {
  const rev = [...readings].reverse();
  const W = 320, H = 110, P = 8;
  const all = rev.flatMap(r => [r.sys, r.dia]);
  const min = Math.min(...all) - 10, max = Math.max(...all) + 10;
  const x = i => P + (i * (W - P * 2)) / (rev.length - 1);
  const y = v => H - P - ((v - min) / (max - min)) * (H - P * 2);

  const sysPath = rev.map((r, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(r.sys)}`).join(' ');
  const diaPath = rev.map((r, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(r.dia)}`).join(' ');

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: H, display: 'block' }}>
      <rect x={0} y={y(140)} width={W} height={y(min) - y(140)} fill="var(--triage-red)" opacity="0.04" />
      <path d={sysPath} stroke="var(--triage-red)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d={diaPath} stroke="var(--text-muted)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
      {rev.map((r, i) => (
        <g key={i}>
          <circle cx={x(i)} cy={y(r.sys)} r={i === rev.length - 1 ? 4 : 2.5} fill={`var(--triage-${r.triage})`} />
          <circle cx={x(i)} cy={y(r.dia)} r={2} fill="var(--text-muted)" opacity="0.5" />
        </g>
      ))}
      <text x={x(rev.length - 1) - 6} y={y(rev[rev.length - 1].sys) - 8}
        fontFamily="var(--sans)" fontSize="10" fill="var(--triage-red)" fontWeight="600" textAnchor="end">
        158
      </text>
    </svg>
  );
};

Object.assign(window, { ScreenAsk, ScreenCarePlan, ScreenBPLog, ResultCard });

/* Doctor row used in Care plan "Book a call now" */
const BookCallRow = ({ expert }) => {
  const Avatar = window.ExpertAvatar;
  const slot = expert.online ? 'Now \u00B7 2 min' : 'Today \u00B7 1 hr';
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: 12,
      background: 'var(--surface)',
      border: '1px solid var(--hairline-soft)',
      borderRadius: 16,
    }}>
      <Avatar expert={expert} size={48} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="row center g-2">
          <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 13.5, color: 'var(--text)' }}>{expert.name}</span>
          {expert.online && (
            <span style={{
              fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--triage-green)', fontWeight: 600,
              display: 'inline-flex', alignItems: 'center', gap: 4,
            }}>
              <span className="triage-dot triage-green" /> online
            </span>
          )}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>
          {expert.cred}
        </div>
        <div style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)', marginTop: 2 }}>
          Next opening {'\u00B7'} {slot}
        </div>
      </div>
      <button style={{
        padding: '8px 14px',
        borderRadius: 999,
        background: expert.online ? 'var(--text)' : 'transparent',
        color: expert.online ? 'var(--bg)' : 'var(--text)',
        border: expert.online ? 'none' : '1px solid var(--hairline)',
        fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 600,
        cursor: 'pointer', whiteSpace: 'nowrap',
      }}>
        {expert.online ? 'Book' : 'Later'}
      </button>
    </div>
  );
};
window.BookCallRow = BookCallRow;
