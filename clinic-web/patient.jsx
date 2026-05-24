/* global React */
/* Patient profile drawer: vitals chart, Care Attention Score breakdown,
   AI summary card, mother chat replay, suggested action. */

const { useState: useStateP } = React;
const { Icon: IconP, PatientAvatar: PAv } = window;

const PatientDrawer = ({ patientId, onClose }) => {
  const D = window.COCUNA_DATA;
  const p = D.PATIENTS.find(x => x.id === patientId);
  const [tab, setTab] = useStateP('overview'); // overview / thread / timeline / summary
  const [summaryShown, setSummaryShown] = useStateP(false);
  const [callOpen, setCallOpen] = useStateP(false);
  const toast = window.useToast();

  if (!p) return null;

  const handleSuggestedAction = () => {
    const sa = p.suggestedAction;
    if (sa.urgent) {
      // urgent: open call modal
      setCallOpen(true);
    } else {
      toast(sa.title + ' · action confirmed');
    }
  };

  return (
    <>
      {callOpen && <window.CallModal patient={p} onClose={() => setCallOpen(false)} />}
      <div className="drawer-backdrop" onClick={onClose} />
      <div className="drawer">
        <div className="drawer-header">
          <PAv p={p} size={56} />
          <div className="name-block">
            <span className="eyebrow">{p.dob}</span>
            <span className="name">{p.name}</span>
            <span className="stage-line">
              <span>{p.stage}</span>
              <span className="sep">{'\u00B7'}</span>
              <span>{p.delivery}</span>
              {p.riskFactors && p.riskFactors.map(r => (
                <React.Fragment key={r}>
                  <span className="sep">{'\u00B7'}</span>
                  <span>{r}</span>
                </React.Fragment>
              ))}
            </span>
          </div>
          <span className={`triage-pill ${p.triage}`}><span className="dot"></span>{D.TRIAGE[p.triage].label}</span>
          <button onClick={onClose} className="close"><IconP name="close" size={16}/></button>
        </div>

        {/* Tab strip */}
        <div style={{
          display: 'flex', gap: 6, padding: '12px 32px',
          borderBottom: '1px solid var(--hairline-soft)',
          background: 'var(--bg)', position: 'sticky', top: 96, zIndex: 1,
        }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'thread',   label: 'Mother chat' },
            { id: 'timeline', label: 'Timeline' },
            { id: 'summary',  label: 'AI summary' },
          ].map(t => (
            <button key={t.id}
              onClick={() => setTab(t.id)}
              className="chip-btn"
              style={tab === t.id ? { background: 'var(--text)', color: 'var(--bg)', borderColor: 'var(--text)' } : {}}
            >{t.label}</button>
          ))}
          <span style={{ flex: 1 }} />
          {p.suggestedAction && (
            <button
              className={p.suggestedAction.urgent ? 'btn btn-urgent' : 'btn btn-primary'}
              onClick={handleSuggestedAction}
            >
              {p.suggestedAction.urgent ? <IconP name="phone" size={14} color="white"/> : <IconP name="check" size={14}/>}
              {p.suggestedAction.urgent ? 'Call now' : p.suggestedAction.title}
            </button>
          )}
        </div>

        <div className="drawer-body">
          {tab === 'overview'  && <OverviewTab p={p} onJumpThread={() => setTab('thread')} onJumpSummary={() => setTab('summary')} onCall={() => setCallOpen(true)} />}
          {tab === 'thread'    && <ThreadTab p={p} />}
          {tab === 'timeline'  && <TimelineTab p={p} />}
          {tab === 'summary'   && <SummaryTab p={p} shown={summaryShown} setShown={setSummaryShown} />}
        </div>
      </div>
    </>
  );
};

/* ============================================================
   OVERVIEW
   ============================================================ */
const OverviewTab = ({ p, onJumpThread, onJumpSummary, onCall }) => {
  return (
    <>
      {/* Score + suggested action */}
      <div className="drawer-grid-2">
        <ScoreBlock p={p} />
        <SuggestedActionCard p={p} onJumpThread={onJumpThread} onJumpSummary={onJumpSummary} onCall={onCall} />
      </div>

      {/* Vitals + baby */}
      <div className="drawer-grid-2">
        <VitalsCard p={p} />
        <SideStack p={p} />
      </div>

      {/* AI summary preview */}
      <AISummaryPreview p={p} onOpen={onJumpSummary} />
    </>
  );
};

/* ============ SCORE BLOCK ============ */
const ScoreBlock = ({ p }) => {
  const score = p.care.score;
  const isUrgent = p.triage === 'red';
  const ringColor = `var(--triage-${p.triage})`;
  return (
    <div className={`score-block ${isUrgent ? 'urgent' : ''}`}>
      <div className="score-head">
        <div className="score-ring" style={{
          background: `conic-gradient(${ringColor} 0% ${score}%, var(--surface-sunk) ${score}% 100%)`,
        }}>
          <span className="num">{score}</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="eyebrow">Care Attention Score</div>
          <div className="score-title">{p.care.level} {'\u00B7'} {p.triageReason}</div>
          <div className="score-sub">{p.care.delta} {'\u00B7'} explainable layer over noisy daily signals</div>
        </div>
      </div>

      <div className="score-formula">
        <span className="formula-line">
          score = maternal_rf + baby_rf + mental_health_risk + vital_deviation + missed_followup + uncertainty
        </span>
        <div className="factors">
          {p.careFactors.map((f, i) => (
            <div key={i} className="factor">
              <span style={{
                width: 8, height: 8, borderRadius: '50%',
                background: f.pts !== '0' && f.pts !== '+0' ? `var(--triage-${p.triage})` : 'var(--text-faint)',
                opacity: f.pts === '0' || f.pts === '+0' ? 0.45 : 1,
              }} />
              <span>{f.label}</span>
              <span className={'pts ' + (f.pts !== '0' && f.pts !== '+0' ? 'add' : 'neutral')}>{f.pts}</span>
            </div>
          ))}
        </div>
      </div>

      <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-faint)', display: 'flex', alignItems: 'center', gap: 8 }}>
        <IconP name="shield" size={13} />
        Source: {p.protocol}
      </div>
    </div>
  );
};

/* ============ SUGGESTED ACTION CARD ============ */
const SuggestedActionCard = ({ p, onJumpThread, onJumpSummary, onCall }) => {
  const sa = p.suggestedAction;
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14, height: '100%' }}>
      <span className="eyebrow">Suggested next step</span>
      <div className="serif" style={{
        fontVariationSettings: '"opsz" 60', fontWeight: 600, fontSize: 22,
        letterSpacing: '-0.014em', color: 'var(--text)', lineHeight: 1.18,
      }}>{sa.title}</div>
      <p className="body">{sa.body}</p>

      <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
        <button className={sa.urgent ? 'btn btn-urgent' : 'btn btn-primary'} style={{ flex: 1 }}
          onClick={() => sa.urgent ? onCall() : window.useToast && null}>
          {sa.urgent ? <><IconP name="phone" size={13} color="white"/> Call now</> : 'Confirm action'}
        </button>
        <button className="btn btn-ghost" onClick={onJumpThread} title="Open mother chat">
          <IconP name="thread" size={14}/> Chat
        </button>
        <button className="btn btn-ghost" onClick={onJumpSummary} title="Generate summary">
          <IconP name="sparkles" size={14}/> Summary
        </button>
      </div>

      <div className="divider" />

      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap' }}>
        <ProtoBit label="Stage" value={p.stage} />
        <ProtoBit label="Next visit" value={p.nextVisit.when} />
        <ProtoBit label="Mood" value={p.mood && p.mood.epds != null ? `EPDS ${p.mood.epds}` : (p.mood && p.mood.note) || '—'} />
      </div>
    </div>
  );
};

const ProtoBit = ({ label, value }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 100 }}>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500 }}>{label}</span>
    <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)', fontWeight: 500 }}>{value}</span>
  </div>
);

/* ============ VITALS CHART ============ */
const VitalsCard = ({ p }) => {
  const isMaria = p.id === 'maria';
  const readings = isMaria ? window.COCUNA_DATA.MARIA_BP : null;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconP name="pulse" size={16} color="var(--accent-deep)" />
        <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16, letterSpacing: '-0.01em', color: 'var(--text)' }}>Vital signs</span>
        <span style={{ flex: 1 }} />
        {readings && (
          <span className="num" style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
            {readings[0].sys}/{readings[0].dia} <span style={{ color: 'var(--text-faint)' }}>{'\u00B7'} latest</span>
          </span>
        )}
      </div>

      {readings ? (
        <BPChart readings={readings} />
      ) : (
        <div style={{
          padding: '20px 14px', background: 'var(--surface-soft)', borderRadius: 12,
          fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text-muted)',
          display: 'flex', flexDirection: 'column', gap: 8,
        }}>
          {p.id === 'tessa' ? 'No vitals on file. Nurse outreach requested.' : 'Vital logs sparse for this case.'}
          {!p.flags.some(f => /BP/.test(f)) && p.stage.includes('Baby') && (
            <span>Latest temperature: {p.flags.find(f => /Temp|temp/.test(f)) || 'Not logged'}</span>
          )}
        </div>
      )}

      {readings && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {[
            { label: 'Systolic 7d high', value: '158', tint: 'red' },
            { label: 'Diastolic 7d high', value: '102', tint: 'red' },
            { label: 'BP delta 24h', value: '+24', tint: 'orange' },
            { label: 'Mood (EPDS)', value: p.mood && p.mood.epds != null ? p.mood.epds : '—', tint: null },
          ].map(s => (
            <div key={s.label} style={{
              padding: '10px 12px', borderRadius: 10, background: 'var(--surface-soft)',
              display: 'flex', flexDirection: 'column', gap: 4,
            }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 500 }}>{s.label}</span>
              <span className="num" style={{
                fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 19,
                color: s.tint ? `var(--triage-${s.tint})` : 'var(--text)',
                letterSpacing: '-0.01em',
              }}>{s.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const BPChart = ({ readings }) => {
  const points = [...readings].reverse(); // oldest → newest
  const W = 560, H = 160, padL = 38, padR = 12, padT = 14, padB = 28;
  const minY = 70, maxY = 170;
  const innerW = W - padL - padR;
  const innerH = H - padT - padB;
  const x = (i) => padL + (innerW * (i / Math.max(1, points.length - 1)));
  const y = (val) => padT + innerH - ((val - minY) / (maxY - minY)) * innerH;
  const sysPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.sys)}`).join(' ');
  const diaPath = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(i)} ${y(p.dia)}`).join(' ');

  return (
    <div className="vitals-chart">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" width="100%" height="100%">
        {/* danger zone (systolic ≥ 140) */}
        <rect x={padL} y={y(160)} width={innerW} height={y(140) - y(160)} fill="rgba(216, 82, 94, 0.10)" />
        <rect x={padL} y={y(140)} width={innerW} height={y(120) - y(140)} fill="rgba(232, 145, 70, 0.07)" />
        {/* y grid */}
        {[80, 100, 120, 140, 160].map(g => (
          <g key={g}>
            <line x1={padL} x2={W-padR} y1={y(g)} y2={y(g)} stroke="var(--hairline)" strokeDasharray="2 4" />
            <text x={padL-8} y={y(g)+3} fontSize="9" textAnchor="end" fontFamily="DM Sans" fill="var(--text-faint)">{g}</text>
          </g>
        ))}
        {/* lines */}
        <path d={sysPath} stroke="var(--triage-red)" strokeWidth="2" fill="none" />
        <path d={diaPath} stroke="var(--accent-deep)" strokeWidth="2" fill="none" />
        {/* points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(p.sys)} r="3" fill="white" stroke="var(--triage-red)" strokeWidth="1.5" />
            <circle cx={x(i)} cy={y(p.dia)} r="2.5" fill="white" stroke="var(--accent-deep)" strokeWidth="1.5" />
          </g>
        ))}
        {/* x labels */}
        {points.map((p, i) => (
          (i === 0 || i === points.length - 1 || i === Math.floor(points.length / 2)) && (
            <text key={i} x={x(i)} y={H - 10} fontSize="9.5" textAnchor="middle" fontFamily="DM Sans" fill="var(--text-faint)">
              {p.date.split(',')[0]}
            </text>
          )
        ))}
        {/* legend */}
        <g transform={`translate(${padL+8}, ${padT+6})`}>
          <circle cx="0" cy="0" r="3" fill="var(--triage-red)" />
          <text x="8" y="3" fontSize="10" fontFamily="DM Sans" fill="var(--text)">Systolic</text>
          <circle cx="64" cy="0" r="3" fill="var(--accent-deep)" />
          <text x="72" y="3" fontSize="10" fontFamily="DM Sans" fill="var(--text)">Diastolic</text>
        </g>
      </svg>
    </div>
  );
};

/* ============ SIDE STACK (Baby, Mood, Next visit) ============ */
const SideStack = ({ p }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
    {p.baby && <BabyCard baby={p.baby} />}
    <MoodCard p={p} />
    <NextVisitCardClinic visit={p.nextVisit} />
    {p.medications && p.medications.length > 0 && <MedicationsCard p={p} />}
  </div>
);

const MedicationsCard = ({ p }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconP name="pill" size={16} color="var(--accent-deep)" />
      <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Active medications</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)' }}>{p.medications.length} active</span>
    </div>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {p.medications.map((m, i) => (
        <div key={i} style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto',
          gap: 4,
          padding: '8px 10px',
          background: 'var(--surface-soft)',
          borderRadius: 10,
          borderLeft: m.flag ? '2px solid var(--triage-orange)' : '2px solid transparent',
        }}>
          <div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{m.name}</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{m.dose} {'·'} {m.class}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>since</div>
            <div style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{m.since}</div>
          </div>
          {m.flag && (
            <div style={{ gridColumn: '1 / -1', fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--triage-orange)', display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <IconP name="flag" size={11} color="var(--triage-orange)" /> {m.flag}
            </div>
          )}
        </div>
      ))}
    </div>
    {p.allergies && p.allergies.length > 0 && (
      <div style={{
        padding: '8px 10px', background: 'var(--triage-red-soft)', borderRadius: 8,
        fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontWeight: 600, color: 'var(--triage-red)' }}>Allergies:</span>
        <span>{p.allergies.join(', ')}</span>
      </div>
    )}
  </div>
);

const BabyCard = ({ baby }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconP name="baby" size={16} color="var(--accent-mint)" />
      <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Baby {baby.name}</span>
      <span style={{ flex: 1 }} />
      <span className={`triage-pill ${baby.triage}`}><span className="dot"></span>{baby.triage}</span>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
      <ProtoBit label="Age" value={baby.age} />
      <ProtoBit label="Feeding" value={baby.feeding} />
    </div>
  </div>
);

const MoodCard = ({ p }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconP name="brain" size={16} color="var(--accent-deep)" />
      <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Mood & mental health</span>
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)', lineHeight: 1.5 }}>
      {p.mood && p.mood.epds != null && <div>EPDS: <strong className="num">{p.mood.epds}</strong> / 30</div>}
      <div style={{ color: 'var(--text-muted)' }}>{(p.mood && p.mood.note) || '—'}</div>
    </div>
  </div>
);

const NextVisitCardClinic = ({ visit }) => (
  <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconP name="calendar" size={16} color="var(--accent-deep)" />
      <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>Next visit</span>
    </div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{visit.kind}</div>
    <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{visit.when} {'\u00B7'} {visit.visitType}</div>
  </div>
);

/* ============ AI SUMMARY ============ */
const AISummaryPreview = ({ p, onOpen }) => (
  <button onClick={onOpen} className="summary-card" style={{ textAlign: 'left', cursor: 'pointer' }}>
    <span className="sparkle"></span>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <IconP name="sparkles" size={16} color="var(--accent-deep)" />
      <span className="eyebrow" style={{ color: 'var(--accent-deep)' }}>One-click clinician summary</span>
      <span style={{ flex: 1 }} />
      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>generated from {p.id === 'maria' ? '12' : '4'} signals</span>
    </div>
    <pre>{p.aiSummary}</pre>
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 4 }}>
      <span className="protocol-tag"><IconP name="shield" size={11} /> {p.protocol}</span>
      <span style={{ flex: 1 }} />
      <span className="body-sm" style={{ color: 'var(--accent-deep)', fontWeight: 600 }}>Open & edit {'\u2192'}</span>
    </div>
  </button>
);

/* ============================================================
   THREAD TAB — mother chat replay
   ============================================================ */
const ThreadTab = ({ p }) => {
  const thread = p.threadKey ? window.COCUNA_DATA.THREADS[p.threadKey] : null;
  if (!thread) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
        <IconP name="thread" size={22} color="var(--text-faint)" />
        <p className="body" style={{ marginTop: 10 }}>No mother chat for this case.<br/>Symptoms were logged directly.</p>
      </div>
    );
  }
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconP name="thread" size={16} color="var(--accent-deep)" />
        <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>Mother{'\u2192'}Cocuna conversation</span>
        <span style={{ flex: 1 }} />
        <span className="protocol-tag"><IconP name="shield" size={11}/> {p.protocol}</span>
      </div>
      <div className="thread">
        {thread.map((m, i) => {
          if (m.who === 'system') {
            return (
              <div key={i} className="msg system">
                <div className="bubble system">{m.text}</div>
              </div>
            );
          }
          return (
            <div key={i} className={`msg ${m.who}`}>
              <div className="avatar">
                {m.who === 'hera' ? <img src="logo-symbol.png" alt="" /> : <span>{p.avatar.initials.charAt(0)}</span>}
              </div>
              <div className="bubble">
                {m.text.split('\n').map((line, j) => <div key={j}>{line || <br/>}</div>)}
                {m.meta && <span className="meta">{m.meta}</span>}
              </div>
            </div>
          );
        })}
      </div>
      <div style={{
        display: 'flex', gap: 8, alignItems: 'center', padding: 10,
        background: 'var(--surface-soft)', borderRadius: 12,
        border: '1px dashed var(--hairline)',
      }}>
        <input placeholder="Send a private message to the mother\u2026" style={{
          flex: 1, background: 'transparent', border: 'none', outline: 'none',
          fontFamily: 'var(--sans)', fontSize: 13, color: 'var(--text)',
        }} />
        <button className="btn btn-primary" style={{ padding: '8px 14px' }}>
          <IconP name="send" size={13}/> Reply
        </button>
      </div>
    </div>
  );
};

/* ============================================================
   TIMELINE TAB
   ============================================================ */
const TimelineTab = ({ p }) => {
  const events = p.id === 'maria' ? window.COCUNA_DATA.MARIA_TIMELINE : null;
  if (!events) {
    return (
      <div className="card" style={{ padding: 28, textAlign: 'center', color: 'var(--text-muted)' }}>
        <IconP name="calendar" size={22} color="var(--text-faint)" />
        <p className="body" style={{ marginTop: 10 }}>Building timeline for this case{'\u2026'}</p>
      </div>
    );
  }
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconP name="calendar" size={16} color="var(--accent-deep)" />
        <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>Patient timeline</span>
        <span style={{ flex: 1 }} />
        <span className="body-sm">{events.length} events</span>
      </div>
      <div className="timeline">
        {events.map((e, i) => (
          <div key={i} className={`timeline-item ${e.triage}`}>
            <div className="dot" />
            <div className="when">{e.when}</div>
            <div className="what">{e.what}</div>
            <div className="detail">{e.detail}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ============================================================
   SUMMARY TAB
   ============================================================ */
const SummaryTab = ({ p, shown, setShown }) => {
  const [text, setText] = useStateP('');
  const [generating, setGenerating] = useStateP(false);
  const toast = window.useToast();

  const start = () => {
    setShown(true);
    setText('');
    setGenerating(true);
    const full = p.aiSummary;
    let i = 0;
    const step = () => {
      i = Math.min(full.length, i + Math.max(2, Math.floor(Math.random() * 4)));
      setText(full.slice(0, i));
      if (i < full.length) {
        setTimeout(step, 12);
      } else {
        setGenerating(false);
      }
    };
    step();
  };

  const copy = () => {
    if (navigator.clipboard) navigator.clipboard.writeText(p.aiSummary).catch(() => {});
    toast && toast('Copied to chart', { icon: 'check' });
  };

  const save = () => {
    toast && toast('Saved to ' + p.name + '’s chart', { icon: 'check' });
  };

  if (!shown) {
    return (
      <div className="card" style={{
        padding: 36, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center',
        background: 'linear-gradient(180deg, var(--surface), var(--accent-soft))',
      }}>
        <div style={{
          width: 60, height: 60, borderRadius: 16,
          background: 'var(--surface)', display: 'grid', placeItems: 'center',
          border: '1px solid var(--hairline-soft)',
        }}>
          <IconP name="sparkles" size={26} color="var(--accent-deep)" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <span className="eyebrow">Generate clinician summary</span>
          <span className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
            letterSpacing: '-0.018em', color: 'var(--text)',
          }}>Understand {p.name.split(' ')[0]} in 30 seconds.</span>
          <p className="body" style={{ maxWidth: 460, margin: '0 auto' }}>
            Cocuna structures her last 7 days into a visit-ready summary. You can review, edit, and copy to your EHR.
          </p>
        </div>
        <button className="btn btn-primary" style={{ padding: '14px 22px', fontSize: 14 }} onClick={start}>
          <IconP name="sparkles" size={14} color="currentColor"/> Generate summary
        </button>
      </div>
    );
  }
  return (
    <div className="summary-card">
      <span className="sparkle"></span>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <IconP name="sparkles" size={16} color="var(--accent-deep)"/>
        <span className="eyebrow" style={{ color: 'var(--accent-deep)' }}>
          Clinician summary {'·'} {p.id === 'maria' ? 'OB' : 'OB / care'}
          {generating && <span style={{ marginLeft: 8, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 'normal' }}>{'— generating…'}</span>}
        </span>
        <span style={{ flex: 1 }} />
        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 11 }} onClick={copy} disabled={generating}>
          <IconP name="check" size={12}/> Copy
        </button>
      </div>
      <pre style={{ minHeight: 120 }}>
        {text}
        {generating && <span style={{ opacity: 0.5, marginLeft: 2, animation: 'sb-blink 1s infinite' }}>{'▊'}</span>}
      </pre>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingTop: 6, borderTop: '1px solid var(--hairline-soft)' }}>
        <span className="protocol-tag"><IconP name="shield" size={11}/> {p.protocol}</span>
        <span style={{ flex: 1 }} />
        <button className="btn btn-ghost" style={{ padding: '8px 12px' }} onClick={() => { setShown(false); }}>Regenerate</button>
        <button className="btn btn-primary" style={{ padding: '8px 14px' }} onClick={save} disabled={generating}>Save to chart</button>
      </div>
      <style>{`@keyframes sb-blink { 0%,100% { opacity: 0.3; } 50% { opacity: 1; } }`}</style>
    </div>
  );
};

window.PatientDrawer = PatientDrawer;
