/* global React */
/* Triage Queue: filter bar + table. */

const { useState: useStateQ, useMemo: useMemoQ } = React;
const { Icon: IconQ } = window;

const TRIAGE_ORDER = ['red', 'orange', 'yellow', 'green', 'gray'];

const QueueScreen = ({ initialTriage, layout, onOpenPatient, queueTab, setQueueTab }) => {
  const D = window.COCUNA_DATA;
  const [role, setRole] = useStateQ('all');           // OB / Pedi / MH / Lactation / all
  const [triage, setTriage] = useStateQ(initialTriage || 'all');
  const [sort, setSort] = useStateQ('score');         // score / wait
  const [showScoreNum, setShowScoreNum] = useStateQ(true);

  const patients = D.PATIENTS;

  const filtered = useMemoQ(() => {
    let arr = [...patients];
    if (triage !== 'all') arr = arr.filter(p => p.triage === triage);
    if (role !== 'all')   arr = arr.filter(p => roleMatches(p, role));
    arr.sort((a, b) => {
      const ai = TRIAGE_ORDER.indexOf(a.triage);
      const bi = TRIAGE_ORDER.indexOf(b.triage);
      if (ai !== bi) return ai - bi;
      if (sort === 'wait') return b.waitedMin - a.waitedMin;
      return b.care.score - a.care.score;
    });
    return arr;
  }, [patients, triage, role, sort]);

  const counts = useMemoQ(() => {
    const c = { red: 0, orange: 0, yellow: 0, green: 0, gray: 0, all: patients.length };
    patients.forEach(p => { c[p.triage] = (c[p.triage] || 0) + 1; });
    return c;
  }, [patients]);

  const stripMetrics = [
    { label: 'Urgent now', value: counts.red, tint: 'red', sub: 'Awaiting clinician' },
    { label: 'Same-day', value: counts.orange, tint: 'orange', sub: 'Within 4 hours' },
    { label: 'For review', value: counts.yellow, tint: 'yellow', sub: '24–72 hr SLA' },
    { label: 'Saved time today', value: '6h 12m', tint: null, sub: 'vs. inbox baseline' },
  ];

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Top intent block — stack of context-specific alerts */}
      <AlertStack patients={patients} onOpenPatient={onOpenPatient} />

      {/* Metric strip */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {stripMetrics.map(m => (
          <div key={m.label} className="metric-card">
            <span className="metric-eyebrow">{m.label}</span>
            <span className="metric-value num">
              {m.value}
              {typeof m.value === 'number' && m.tint && (
                <span className={`triage-dot triage-${m.tint}-dot`} style={{ marginLeft: 10, width: 10, height: 10, verticalAlign: 'middle' }} />
              )}
            </span>
            <span className="metric-trend">{m.sub}</span>
          </div>
        ))}
      </div>

      {/* Queue table */}
      <div className="queue-shell">
        <div className="queue-header">
          <span className="title">Triage queue</span>
          <span className="meta">{filtered.length} of {patients.length} patients {'\u00B7'} sorted by {sort === 'score' ? 'Care Attention Score' : 'wait time'}</span>
          <div className="queue-tabs">
            {[
              { id: 'table',  label: 'Table'  },
              { id: 'cards',  label: 'Cards'  },
              { id: 'kanban', label: 'Kanban' },
            ].map(t => (
              <button
                key={t.id}
                className={`queue-tab ${queueTab === t.id ? 'active' : ''}`}
                onClick={() => setQueueTab(t.id)}
              >{t.label}</button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <span className="filter-label">Triage</span>
          <button className={`chip-btn ${triage === 'all' ? 'active' : ''}`} onClick={() => setTriage('all')}>All <span className="num" style={{opacity: 0.6, marginLeft: 4}}>{counts.all}</span></button>
          {TRIAGE_ORDER.map(t => (
            <button key={t} className={`chip-btn ${triage === t ? 'active' : ''}`} onClick={() => setTriage(t)}>
              <span className={`triage-dot triage-${t}-dot`} />
              {D.TRIAGE[t].short}
              <span className="num" style={{ opacity: 0.6, marginLeft: 4 }}>{counts[t]}</span>
            </button>
          ))}
          <div style={{ width: 12 }} />
          <span className="filter-label">Role</span>
          {[
            { id: 'all',       label: 'All' },
            { id: 'ob',        label: 'OB' },
            { id: 'pedi',      label: 'Pediatric' },
            { id: 'mh',        label: 'Behavioral' },
            { id: 'lactation', label: 'Lactation' },
          ].map(r => (
            <button key={r.id} className={`chip-btn ${role === r.id ? 'active' : ''}`} onClick={() => setRole(r.id)}>{r.label}</button>
          ))}
          <span style={{ flex: 1 }}></span>
          <button className={`chip-btn ${sort === 'score' ? 'active' : ''}`} onClick={() => setSort('score')}>Sort by score</button>
          <button className={`chip-btn ${sort === 'wait' ? 'active' : ''}`} onClick={() => setSort('wait')}>Sort by wait</button>
        </div>

        {queueTab === 'table' && (
          <>
            <div className="queue-grid row-header">
              <span></span>
              <span style={{ paddingLeft: 18 }}>Patient</span>
              <span>Stage</span>
              <span>Triage</span>
              <span>Reason</span>
              <span>Needed action</span>
              <span style={{ textAlign: 'right' }}>Score</span>
            </div>
            {filtered.map(p => (
              <QueueRowTable key={p.id} patient={p} onOpen={() => onOpenPatient(p.id)} />
            ))}
          </>
        )}

        {queueTab === 'cards' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, padding: 16 }}>
            {filtered.map(p => (
              <PatientCard key={p.id} patient={p} onOpen={() => onOpenPatient(p.id)} />
            ))}
          </div>
        )}

        {queueTab === 'kanban' && (
          <KanbanView patients={filtered.length ? filtered : patients} onOpen={onOpenPatient} />
        )}
      </div>
    </div>
  );
};

function roleMatches(p, role) {
  if (role === 'ob')        return /Postpartum|Pregnant/.test(p.stage);
  if (role === 'pedi')      return /Baby/.test(p.stage) || (p.baby && p.baby.triage === 'red');
  if (role === 'mh')        return /PHQ|EPDS/.test(p.triageReason) || (p.mood && p.mood.epds >= 10);
  if (role === 'lactation') return /[Ll]actation|[Ff]eeding|[Bb]reastfeeding|latch|supply/.test(p.triageReason + ' ' + (p.action || ''));
  return true;
}

/* ============ TABLE ROW ============ */
const QueueRowTable = ({ patient: p, onOpen }) => {
  return (
    <div className="queue-grid queue-row" onClick={onOpen}>
      <span className={`triage-bar ${p.triage}`}></span>
      <div className="name-cell">
        <PatientAvatar p={p} size={36} />
        <div className="who">
          <span className="name">
            {p.name}
            {p.stage.startsWith('Baby') && <span className="baby-tag">Baby</span>}
          </span>
          <span className="stage">{p.dob} {p.riskFactors && p.riskFactors.length > 0 ? ' \u00B7 ' + p.riskFactors[0] : ''}</span>
        </div>
      </div>
      <div className="stage-cell">
        <div className="stage-line">{p.stage}</div>
      </div>
      <div>
        <span className={`triage-pill ${p.triage}`}><span className="dot"></span>{window.COCUNA_DATA.TRIAGE[p.triage].short}</span>
      </div>
      <div className="reason-cell">
        {p.triageReason}
        <div className="reason-flags">
          {p.flags.slice(0, 4).map(f => <span key={f} className="flag">{f}</span>)}
        </div>
      </div>
      <div className="action-cell">
        <div>{p.action}</div>
        <div style={{ fontSize: 10.5, color: 'var(--text-faint)', letterSpacing: '0.04em', marginTop: 4 }}>
          {p.sla} {p.waitedMin ? ' \u00B7 waited ' + p.waitedMin + 'm' : ''}
        </div>
      </div>
      <div className="score-cell">
        <span className="score-num num" style={{ color: p.triage === 'red' || p.triage === 'orange' ? 'var(--triage-' + p.triage + ')' : 'var(--text)' }}>{p.care.score}</span>
        <div className="score-arrow"><IconQ name="arrow-right" size={14} /></div>
      </div>
    </div>
  );
};

/* ============ CARD VIEW ============ */
const PatientCard = ({ patient: p, onOpen }) => (
  <button onClick={onOpen} className="card" style={{
    textAlign: 'left', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 12, padding: 18,
    border: '1px solid var(--hairline-soft)',
    position: 'relative', overflow: 'hidden',
  }}>
    <span className={`triage-bar ${p.triage}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, height: 'auto', width: 4 }} />
    <div className="row" style={{ display: 'flex', gap: 12, alignItems: 'center', paddingLeft: 6 }}>
      <PatientAvatar p={p} size={40} />
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)' }}>{p.name}</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)' }}>{p.stage}</span>
      </div>
      <span className={`triage-pill ${p.triage}`}><span className="dot"></span>{window.COCUNA_DATA.TRIAGE[p.triage].short}</span>
    </div>
    <div style={{ paddingLeft: 6, fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)', lineHeight: 1.45 }}>
      {p.triageReason}
    </div>
    <div style={{ paddingLeft: 6, display: 'flex', flexWrap: 'wrap', gap: 4 }}>
      {p.flags.map(f => <span key={f} className="flag" style={{ fontFamily: 'var(--sans)', fontSize: 10, padding: '2px 7px', background: 'var(--surface-sunk)', color: 'var(--text-muted)', borderRadius: 4 }}>{f}</span>)}
    </div>
    <div style={{ paddingLeft: 6, display: 'flex', alignItems: 'center', borderTop: '1px solid var(--hairline-soft)', paddingTop: 12 }}>
      <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>{p.action}</span>
      <span style={{ marginLeft: 'auto', display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <span className="num" style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 22, color: 'var(--text)', letterSpacing: '-0.02em' }}>{p.care.score}</span>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--text-faint)' }}>score</span>
      </span>
    </div>
  </button>
);

/* ============ KANBAN ============ */
const KanbanView = ({ patients, onOpen }) => {
  const D = window.COCUNA_DATA;
  const columns = TRIAGE_ORDER.map(t => ({ id: t, label: D.TRIAGE[t].label, patients: patients.filter(p => p.triage === t) }));
  return (
    <div style={{ padding: 16, display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
      {columns.map(col => (
        <div key={col.id} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px' }}>
            <span className={`triage-dot triage-${col.id}-dot`} />
            <span style={{ fontFamily: 'var(--sans)', fontSize: 11.5, fontWeight: 600, color: 'var(--text)' }}>{col.label}</span>
            <span style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-faint)', marginLeft: 'auto' }}>{col.patients.length}</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {col.patients.map(p => (
              <button key={p.id} onClick={() => onOpen(p.id)} className="card" style={{
                textAlign: 'left', cursor: 'pointer', padding: 12, display: 'flex', flexDirection: 'column', gap: 8, position: 'relative', overflow: 'hidden',
              }}>
                <span className={`triage-bar ${p.triage}`} style={{ position: 'absolute', left: 0, top: 0, bottom: 0, height: 'auto', width: 3 }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 4 }}>
                  <PatientAvatar p={p} size={26} />
                  <span style={{ fontFamily: 'var(--sans)', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>{p.name}</span>
                  <span className="num" style={{ marginLeft: 'auto', fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 15, color: 'var(--text)' }}>{p.care.score}</span>
                </div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)', paddingLeft: 4 }}>{p.stage}</div>
                <div style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text)', lineHeight: 1.4, paddingLeft: 4 }}>{p.triageReason}</div>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============ AVATAR ============ */
const PatientAvatar = ({ p, size = 36 }) => {
  const tints = {
    rose:     'var(--accent-rose)',
    lavender: 'var(--accent-soft)',
    mint:     'var(--accent-mint-soft)',
    butter:   'var(--accent-butter)',
    peach:    'var(--accent-peach)',
  };
  const bg = tints[p.avatar.tint] || 'var(--accent-soft)';
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg,
      display: 'grid', placeItems: 'center',
      flexShrink: 0,
      fontFamily: 'var(--serif)',
      fontWeight: 600,
      fontSize: Math.round(size * 0.36),
      color: 'var(--text)',
      letterSpacing: '-0.01em',
    }}>{p.avatar.initials}</div>
  );
};

/* ============ ALERT STACK (top of queue) ============ */
const AlertStack = ({ patients, onOpenPatient }) => {
  const find = (id) => patients.find(p => p.id === id);
  const alerts = [
    {
      patient: find('maria'),
      kind: 'red',
      eyebrow: 'En route to ER',
      cta: 'Track Maria',
      icon: 'pulse',
      note: 'Ride dispatched 8:06 AM · ETA L&D 8:18 AM',
    },
    {
      patient: find('jane'),
      kind: 'orange',
      eyebrow: 'Mental health flag',
      cta: 'Open case',
      icon: 'brain',
      note: 'EPDS 13 · trending down 3 weeks · no SI/HI',
    },
    {
      patient: find('emily'),
      kind: 'yellow',
      eyebrow: 'Lactation review',
      cta: 'Route to Naomi',
      icon: 'drop',
      note: 'Bilateral latch pain · supply concern · video booked',
    },
  ].filter(a => a.patient);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {alerts.map(a => <AlertCard key={a.patient.id} alert={a} onOpen={() => onOpenPatient(a.patient.id)} />)}
    </div>
  );
};

const AlertCard = ({ alert, onOpen }) => {
  const p = alert.patient;
  const tones = {
    red:    { bg: 'linear-gradient(125deg, var(--triage-red-soft) 0%, var(--bg) 75%)',    border: 'rgba(216, 82, 94, 0.22)',  color: 'var(--triage-red)',    shadow: '0 12px 28px rgba(216, 82, 94, 0.18)' },
    orange: { bg: 'linear-gradient(125deg, var(--triage-orange-soft) 0%, var(--bg) 75%)', border: 'rgba(232, 145, 70, 0.22)', color: 'var(--triage-orange)', shadow: '0 12px 28px rgba(232, 145, 70, 0.16)' },
    yellow: { bg: 'linear-gradient(125deg, var(--triage-yellow-soft) 0%, var(--bg) 75%)', border: 'rgba(191, 164, 73, 0.22)', color: 'var(--triage-yellow)', shadow: '0 12px 28px rgba(191, 164, 73, 0.14)' },
  };
  const t = tones[alert.kind];
  return (
    <div style={{
      background: t.bg,
      border: `1px solid ${t.border}`,
      borderRadius: 'var(--radius-card)',
      padding: '18px 20px',
      display: 'flex', flexDirection: 'column', gap: 12,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: t.color,
          display: 'grid', placeItems: 'center',
          color: 'white',
          boxShadow: t.shadow,
          flexShrink: 0,
        }}>
          <IconQ name={alert.icon} size={17} stroke={2} color="white" />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, minWidth: 0, flex: 1 }}>
          <span style={{
            fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.22em',
            textTransform: 'uppercase', color: t.color, fontWeight: 600,
          }}>{alert.eyebrow}</span>
          <span className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 20,
            letterSpacing: '-0.018em', color: 'var(--text)', lineHeight: 1.1,
          }}>{p.name}</span>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)', lineHeight: 1.45 }}>
        {alert.note}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
        <span style={{ fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
          {p.stage}
        </span>
        <span style={{ flex: 1 }} />
        <button onClick={onOpen} className="btn" style={{
          background: t.color, color: 'white', padding: '8px 14px', fontSize: 12,
        }}>
          {alert.cta}
          <IconQ name="arrow-right" size={13} color="white" />
        </button>
      </div>
    </div>
  );
};

/* legacy single banner (kept for ref) */
const UrgentBanner = ({ patient: p, onOpen }) => {
  if (!p) return null;
  return (
    <div style={{
      background: 'linear-gradient(115deg, var(--triage-red-soft) 0%, var(--bg) 70%)',
      border: '1px solid rgba(216, 82, 94, 0.22)',
      borderRadius: 'var(--radius-card)',
      padding: '20px 24px',
      display: 'flex', alignItems: 'center', gap: 20,
      position: 'relative', overflow: 'hidden',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: '50%',
        background: 'var(--triage-red)',
        display: 'grid', placeItems: 'center',
        color: 'white',
        boxShadow: '0 12px 28px rgba(216, 82, 94, 0.30)',
        flexShrink: 0,
      }}>
        <IconQ name="flag" size={22} stroke={2} color="white" />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: 'var(--sans)', fontSize: 10, letterSpacing: '0.22em',
          textTransform: 'uppercase', color: 'var(--triage-red)', fontWeight: 600,
        }}>Cocuna recommends action now</div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginTop: 4, flexWrap: 'wrap' }}>
          <span className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 22,
            letterSpacing: '-0.018em', color: 'var(--text)',
          }}>{p.name}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>{p.stage} {'\u00B7 '} {p.triageReason}</span>
        </div>
        <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap' }}>
          {p.flags.map(f => (
            <span key={f} style={{
              fontFamily: 'var(--sans)', fontSize: 11,
              padding: '3px 9px', background: 'rgba(255,255,255,0.7)', borderRadius: 999,
              color: 'var(--text)', border: '1px solid rgba(216,82,94,0.18)',
            }}>{f}</span>
          ))}
        </div>
      </div>
      <button onClick={onOpen} className="btn btn-urgent" style={{ padding: '12px 18px', fontSize: 13 }}>
        Open case <IconQ name="arrow-right" size={14} color="white" />
      </button>
    </div>
  );
};

window.QueueScreen   = QueueScreen;
window.PatientAvatar = PatientAvatar;
