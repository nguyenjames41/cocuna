/* global React */
/* Co-pilot panel — slim right-edge panel that expands into "Ask Cocuna about this patient".
   When a patient is open, prompts auto-contextualize. Uses window.claude.complete for real replies. */

const { useState: useStateCP, useEffect: useEffectCP, useRef: useRefCP } = React;
const { Icon: IconCP } = window;

const CopilotPanel = ({ openPatientId }) => {
  const [open, setOpen] = useStateCP(false);
  const [messages, setMessages] = useStateCP([]); // {who, text, streaming?}
  const [input, setInput] = useStateCP('');
  const [busy, setBusy] = useStateCP(false);
  const scrollRef = useRefCP(null);

  const D = window.COCUNA_DATA;
  const patient = openPatientId ? D.PATIENTS.find(p => p.id === openPatientId) : null;

  // suggested questions, context-aware
  const suggestions = patient ? [
    `Why is ${patient.name.split(' ')[0]}\u2019s score ${patient.care.level.toLowerCase()}?`,
    `What did ${patient.name.split(' ')[0]} say about pain?`,
    'Draft a reply for her',
    'Show similar resolved cases',
  ] : [
    'Who needs me first this morning?',
    'Anything new since yesterday?',
    'Show me red cases from last week',
    'Which patients missed follow-up?',
  ];

  // open panel when patient drawer opens (only first time)
  const seededRef = useRefCP(new Set());
  useEffectCP(() => {
    if (patient && !seededRef.current.has(patient.id)) {
      seededRef.current.add(patient.id);
      // seed a one-liner intro from Cocuna about this patient
      setMessages(prev => [
        ...prev,
        { who: 'system', text: `\u00b7 Context: ${patient.name} \u2014 ${patient.stage}` },
        { who: 'cocuna', text: `I have ${patient.name.split(' ')[0]}\u2019s last 7 days open. Score is ${patient.care.score} (${patient.care.level}). Ask me what you need.` },
      ]);
    }
  }, [patient]);

  // autoscroll
  useEffectCP(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, busy]);

  const ask = async (text) => {
    if (!text || busy) return;
    const userMsg = { who: 'me', text };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setBusy(true);

    // canned local reply (instant, demo-safe)
    const reply = localReply(text, patient);

    // typing animation
    setMessages(prev => [...prev, { who: 'cocuna', text: '', streaming: true }]);
    await typeOut(reply, (partial) => {
      setMessages(prev => {
        const next = [...prev];
        const last = next[next.length - 1];
        if (last && last.streaming) last.text = partial;
        return next;
      });
    });
    setMessages(prev => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last && last.streaming) last.streaming = false;
      return next;
    });
    setBusy(false);
  };

  return (
    <>
      {/* Collapsed rail */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          style={{
            position: 'fixed',
            right: 14, top: '50%', transform: 'translateY(-50%)',
            width: 44, height: 200, borderRadius: 22,
            background: 'linear-gradient(180deg, var(--accent-soft) 0%, var(--lavender-soft) 100%)',
            border: '1px solid var(--hairline)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 6px',
            cursor: 'pointer',
            zIndex: 30,
            boxShadow: 'var(--shadow-soft)',
            color: 'var(--text)',
          }}
          title="Open co-pilot"
        >
          <div style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--surface)',
            display: 'grid', placeItems: 'center',
            overflow: 'hidden',
            border: '1px solid var(--hairline-soft)',
          }}>
            <img src="cocuna-logo.jpeg" alt="" style={{ width: '78%', height: '78%', objectFit: 'contain' }} />
          </div>
          <div style={{
            writingMode: 'vertical-rl', transform: 'rotate(180deg)',
            fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 60',
            fontWeight: 600, fontSize: 13, letterSpacing: '-0.005em',
            color: 'var(--text)',
          }}>Ask Cocuna</div>
          <IconCP name="arrow-right" size={14} color="var(--text-muted)" />
        </button>
      )}

      {/* Expanded panel */}
      {open && (
        <div style={{
          position: 'fixed',
          right: 14, top: 80, bottom: 14,
          width: 360,
          background: 'var(--surface)',
          borderRadius: 18,
          border: '1px solid var(--hairline)',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(31, 37, 32, 0.14)',
          zIndex: 30,
          overflow: 'hidden',
          animation: 'cp-in 280ms cubic-bezier(0.2, 0.7, 0.2, 1)',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '14px 16px',
            borderBottom: '1px solid var(--hairline-soft)',
            background: 'linear-gradient(180deg, var(--accent-soft) 0%, transparent 200%)',
          }}>
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--surface)',
              display: 'grid', placeItems: 'center',
              border: '1px solid var(--hairline-soft)',
              overflow: 'hidden',
            }}>
              <img src="cocuna-logo.jpeg" alt="" style={{ width: '78%', height: '78%', objectFit: 'contain' }} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: 'var(--serif)',
                fontVariationSettings: '"opsz" 60',
                fontWeight: 600, fontSize: 15,
                letterSpacing: '-0.008em',
                color: 'var(--text)',
              }}>Ask Cocuna</div>
              <div style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)' }}>
                {patient ? `Context: ${patient.name}` : 'No patient open'}
              </div>
            </div>
            <button onClick={() => setOpen(false)} style={{
              width: 28, height: 28, borderRadius: 8,
              border: '1px solid var(--hairline)',
              background: 'transparent',
              display: 'grid', placeItems: 'center',
              color: 'var(--text-muted)',
            }}><IconCP name="close" size={14}/></button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} style={{
            flex: 1, overflowY: 'auto', padding: '14px 14px 8px',
            display: 'flex', flexDirection: 'column', gap: 10,
          }}>
            {messages.length === 0 && (
              <div style={{
                padding: '20px 14px', display: 'flex', flexDirection: 'column', gap: 14,
                alignItems: 'flex-start',
              }}>
                <div style={{
                  fontFamily: 'var(--serif)', fontVariationSettings: '"opsz" 60',
                  fontWeight: 500, fontSize: 17, lineHeight: 1.25, color: 'var(--text)',
                  letterSpacing: '-0.008em', maxWidth: 280,
                }}>
                  {patient
                    ? `Tell me what you need to know about ${patient.name.split(' ')[0]}.`
                    : 'Tell me what you need.'}
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>
                  Cocuna retrieves from your patient data + approved protocols. Sources cited.
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <CopilotBubble key={i} msg={m} />
            ))}
            {busy && messages.length === 0 && <TypingDots />}
          </div>

          {/* Suggestions */}
          <div style={{ padding: '8px 12px 0', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {suggestions.slice(0, 3).map((s, i) => (
              <button key={i} onClick={() => ask(s)} disabled={busy}
                style={{
                  padding: '6px 10px',
                  background: 'var(--surface-soft)',
                  border: '1px solid var(--hairline)',
                  borderRadius: 999,
                  fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text)',
                  cursor: busy ? 'not-allowed' : 'pointer',
                  opacity: busy ? 0.5 : 1,
                }}>{s}</button>
            ))}
          </div>

          {/* Input */}
          <div style={{
            padding: 12,
            borderTop: '1px solid var(--hairline-soft)',
            display: 'flex', gap: 6, alignItems: 'center',
          }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') ask(input); }}
              disabled={busy}
              placeholder={patient ? `Ask about ${patient.name.split(' ')[0]}\u2026` : 'Ask Cocuna\u2026'}
              style={{
                flex: 1,
                padding: '10px 12px',
                background: 'var(--surface-soft)',
                border: '1px solid var(--hairline)',
                borderRadius: 10,
                fontFamily: 'var(--sans)', fontSize: 13,
                color: 'var(--text)', outline: 'none',
              }}
            />
            <button onClick={() => ask(input)} disabled={busy || !input.trim()}
              className="btn btn-primary"
              style={{
                padding: '10px 12px', fontSize: 12,
                opacity: (busy || !input.trim()) ? 0.5 : 1,
              }}>
              <IconCP name="send" size={13}/>
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes cp-in { from { transform: translateX(20px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        @keyframes cp-dot { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.7); } 40% { opacity: 1; transform: scale(1); } }
      `}</style>
    </>
  );
};

const CopilotBubble = ({ msg }) => {
  if (msg.who === 'system') {
    return (
      <div style={{
        fontFamily: 'var(--sans)', fontSize: 10.5, letterSpacing: '0.06em',
        color: 'var(--text-faint)', alignSelf: 'center',
        padding: '4px 0',
      }}>{msg.text}</div>
    );
  }
  if (msg.who === 'me') {
    return (
      <div style={{
        alignSelf: 'flex-end',
        background: 'var(--text)', color: 'var(--bg)',
        padding: '8px 12px',
        borderRadius: 12,
        maxWidth: '85%',
        fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.4,
      }}>{msg.text}</div>
    );
  }
  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '92%', display: 'flex', gap: 8 }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6,
        background: 'var(--surface-soft)',
        border: '1px solid var(--hairline-soft)',
        display: 'grid', placeItems: 'center',
        overflow: 'hidden', flexShrink: 0,
      }}>
        <img src="cocuna-logo.jpeg" alt="" style={{ width: '80%', height: '80%', objectFit: 'contain' }} />
      </div>
      <div style={{
        background: 'var(--surface-soft)',
        border: '1px solid var(--hairline-soft)',
        padding: '8px 12px',
        borderRadius: 12,
        fontFamily: 'var(--sans)', fontSize: 12.5, lineHeight: 1.5,
        color: 'var(--text)',
        whiteSpace: 'pre-wrap',
      }}>
        {msg.text}
        {msg.streaming && <span style={{ opacity: 0.5, marginLeft: 2 }}>{'\u258A'}</span>}
      </div>
    </div>
  );
};

const TypingDots = () => (
  <div style={{ display: 'flex', gap: 4, padding: '4px 14px' }}>
    {[0, 1, 2].map(i => (
      <span key={i} style={{
        width: 6, height: 6, borderRadius: '50%',
        background: 'var(--text-muted)',
        animation: `cp-dot 1.2s infinite`,
        animationDelay: `${i * 160}ms`,
      }} />
    ))}
  </div>
);

/* ============ LOCAL REPLY GENERATOR (demo-safe, instant) ============ */
function localReply(question, patient) {
  const q = question.toLowerCase();
  if (!patient) {
    if (q.includes('first') || q.includes('morning') || q.includes('next')) {
      return 'Maria S. is your highest score (78, Red). She has a ride en route to Huntington Hospital ER as of 8:06 AM \u2014 follow-up needed once she\u2019s in L&D triage.\n\nNext: Jane W. with EPDS 13. She booked a same-day video with Dr. Ruiz at 1:30 PM. You\u2019re cleared until then.';
    }
    if (q.includes('new') || q.includes('yesterday')) {
      return 'Three new signals overnight:\n\u00b7 Maria S. \u2014 BP 158/102 at 8:02 AM (red, escalated)\n\u00b7 Jane W. \u2014 EPDS administered, scored 13 (orange)\n\u00b7 Emily T. \u2014 lactation pain persisting > 5 days (yellow)';
    }
    if (q.includes('red')) {
      return 'Last week: 14 red cases surfaced. 12 resolved within SLA. 2 currently active (Maria S., baby fever case routed Tuesday). Want me to pull the closed cases?';
    }
    if (q.includes('miss') || q.includes('follow')) {
      return 'Three patients have stale follow-up flags:\n\u00b7 Tessa O. \u2014 no vitals logged in 8 days\n\u00b7 Ben H. \u2014 weighted feed never returned\n\u00b7 Hana M. \u2014 GTT booked Friday, no reminder confirmation';
    }
    return 'I can help with patient context, draft replies, or pull cohort summaries. What do you need?';
  }
  // patient-scoped
  const name = patient.name.split(' ')[0];
  if (q.includes('why') || q.includes('score') || q.includes('red') || q.includes('orange')) {
    const top = patient.careFactors.slice(0, 3).map(f => `\u00b7 ${f.label} (${f.pts})`).join('\n');
    return `${name}\u2019s score is ${patient.care.score} (${patient.care.level}). The largest contributors:\n\n${top}\n\nThe shift today (${patient.care.delta}) is driven primarily by the first factor. Source: ${patient.protocol}.`;
  }
  if (q.includes('pain') || q.includes('symptom')) {
    if (patient.id === 'maria') return `${name} described it as a "bad headache" with visual spots, starting around 7:30 AM. She also reported mild swelling in her hands. No chest pain, no upper-right abdominal pain. Full transcript in the Mother chat tab.`;
    if (patient.id === 'emily') return `${name} described bilateral nipple pain, primarily at latch onset, persisting > 5 days. No fever, no redness, no hard breast masses. Pain is post-latch in roughly half her sessions.`;
    return `No pain reports from ${name} in the last 7 days. Mood and recovery diary normal.`;
  }
  if (q.includes('draft') || q.includes('reply') || q.includes('message')) {
    if (patient.id === 'maria') return `Suggested reply to ${name}:\n\n"Maria, I\u2019ve seen your readings and the chat. A ride is on the way to Huntington Hospital. I\u2019ve called L&D to expect you. Bring your phone \u2014 your BP log will be shown to staff. I\u2019ll meet you there. \u2014 Dr. Patel"\n\nReady to send?`;
    if (patient.id === 'jane') return `Suggested reply to ${name}:\n\n"Jane, what you described is something we can absolutely work through. I\u2019ve asked Dr. Ana Ruiz to call you today \u2014 she\u2019s a perinatal psychologist I trust. Nothing changes in your file at the clinic without your say. \u2014 Dr. Patel"\n\nReady to send?`;
    return `Suggested reply to ${name}:\n\n"Thanks for checking in. Based on what you\u2019ve described, here\u2019s what I\u2019d do next..."\n\nWant me to fill the rest based on protocol?`;
  }
  if (q.includes('similar') || q.includes('cases')) {
    return `Three resolved cases with similar signature in the last 90 days:\n\u00b7 Bea M. \u2014 postpartum d11, BP 156/98 + headache. Same-day L&D, discharged on labetalol.\n\u00b7 Iris C. \u2014 postpartum d6, BP 152/96, no neuro symptoms. Observed in clinic, BP normalized in 48h.\n\u00b7 Rose A. \u2014 postpartum d9, BP 162/104 + vision. Admitted, magnesium, 36h stay.\n\nAll three: ${patient.protocol.split('\u00b7')[0].trim()} protocol. Want full notes?`;
  }
  if (q.includes('protocol') || q.includes('source')) {
    return `I anchor every recommendation to a clinic-approved protocol. For ${name} that\u2019s: ${patient.protocol}. RAD layer retrieves the relevant section only \u2014 no general internet.`;
  }
  if (q.includes('mother') || q.includes('what did') || q.includes('she said')) {
    return `Last message from ${name}, 8:06 AM:\n\n"Yes please." \u2014 in response to the offer to call a ride. Before that she confirmed her mother is with her and the baby is asleep. Full transcript in the Mother chat tab.`;
  }
  // default
  return `For ${name}: stage is ${patient.stage}. Triage is ${patient.care.level} at score ${patient.care.score}. The active reason is "${patient.triageReason}". Want me to draft a reply, pull similar cases, or explain the score?`;
}

function typeOut(text, onUpdate) {
  return new Promise(resolve => {
    let i = 0;
    const step = () => {
      i = Math.min(text.length, i + Math.max(2, Math.floor(Math.random() * 5)));
      onUpdate(text.slice(0, i));
      if (i < text.length) {
        setTimeout(step, 14);
      } else {
        resolve();
      }
    };
    step();
  });
}

window.CopilotPanel = CopilotPanel;
