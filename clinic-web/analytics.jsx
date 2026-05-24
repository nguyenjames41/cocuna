/* global React */
/* Analytics screen — pilot metrics that match the PDF "what to brag about" list. */

const { Icon: IconA } = window;

const AnalyticsScreen = () => {
  const A = window.COCUNA_DATA.ANALYTICS;

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        <BigMetric eyebrow="Safely handled · Green" value={`${A.green}%`} trend="vs. 28% last quarter" />
        <BigMetric eyebrow="Routed to nurse / lactation" value={`${A.routedNonPhysician}%`} trend="off physician load" />
        <BigMetric eyebrow="Urgent cases surfaced" value={A.urgentSurfaced} trend="this week" tint="red" />
        <BigMetric eyebrow="Chart-prep time" value={`${A.chartPrepAfter}m`} sub={`from ${A.chartPrepBefore}m`} trend="−81%" tint="green" />
      </div>

      <div className="drawer-grid-2">
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <IconA name="analytics" size={16} color="var(--accent-deep)" />
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16 }}>Triage distribution {'\u00B7'} this week</span>
            <span style={{ flex: 1 }} />
            <span className="body-sm">{A.weekly.length} days</span>
          </div>
          <WeeklyBarChart weekly={A.weekly} />
          <div style={{ display: 'flex', gap: 14, marginTop: 12, flexWrap: 'wrap' }}>
            <Legend tint="red"    label="Urgent" />
            <Legend tint="orange" label="Same-day" />
            <Legend tint="yellow" label="Review" />
            <Legend tint="green"  label="Self-care" />
            <Legend tint="gray"   label="Human review" />
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <IconA name="sparkles" size={16} color="var(--accent-deep)" />
            <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16 }}>What changed in the inbox</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <ChangeRow before="Inbox messages requiring physician triage" beforeVal="142 / day" afterVal="38 / day" />
            <ChangeRow before="Average minutes per case before visit" beforeVal="8.0 min" afterVal="1.5 min" />
            <ChangeRow before="Patients with stale follow-up flag" beforeVal="14" afterVal="3" />
            <ChangeRow before="After-hours questions handled to green" beforeVal="—" afterVal="41% of inbound" />
          </div>
          <p className="body" style={{ marginTop: 14, fontSize: 11.5, color: 'var(--text-faint)' }}>
            Pilot targets {'\u00B7'} not validated outcomes. Population: 312 mothers, 8 weeks.
          </p>
        </div>
      </div>

      <div className="card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <IconA name="brain" size={16} color="var(--accent-deep)" />
          <span style={{ fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 16 }}>Top reasons mothers reached out</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
          {[
            { topic: 'Breastfeeding pain / latch',     count: 88, pct: 22, color: 'var(--accent-mint)' },
            { topic: 'Sleep deprivation / mood',       count: 71, pct: 18, color: 'var(--accent)' },
            { topic: 'Postpartum bleeding questions',  count: 62, pct: 15, color: 'var(--accent-rose)' },
            { topic: 'Baby fever / illness',           count: 54, pct: 13, color: 'var(--triage-red)' },
            { topic: 'Baby feeding & spit-up',         count: 49, pct: 12, color: 'var(--accent-butter)' },
            { topic: 'BP / cardiovascular',            count: 31, pct: 8,  color: 'var(--triage-orange)' },
          ].map(t => (
            <div key={t.topic} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)', flex: 1, minWidth: 0 }}>{t.topic}</span>
              <div style={{ flex: 2, height: 8, background: 'var(--surface-sunk)', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${t.pct * 4.2}%`, background: t.color, borderRadius: 4 }} />
              </div>
              <span className="num" style={{ fontFamily: 'var(--sans)', fontSize: 11.5, color: 'var(--text-muted)', minWidth: 50, textAlign: 'right' }}>
                {t.count} <span style={{ color: 'var(--text-faint)' }}>{'\u00B7'} {t.pct}%</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const BigMetric = ({ eyebrow, value, trend, sub, tint }) => (
  <div className="metric-card">
    <span className="metric-eyebrow">{eyebrow}</span>
    <span className="metric-value num" style={tint ? { color: `var(--triage-${tint})` } : {}}>
      {value}
      {sub && <span className="unit"> from {sub}</span>}
    </span>
    <span className="metric-trend">
      <span className={'delta ' + (tint === 'green' ? 'down' : 'up')}>{trend.startsWith('-') || trend.startsWith('\u2212') ? trend : trend}</span>
    </span>
  </div>
);

const WeeklyBarChart = ({ weekly }) => {
  const max = Math.max(...weekly.map(d => d.red + d.orange + d.yellow + d.green + d.gray));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, height: 160, padding: '0 4px' }}>
      {weekly.map(d => {
        const total = d.red + d.orange + d.yellow + d.green + d.gray;
        return (
          <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column-reverse', borderRadius: 6, overflow: 'hidden', minHeight: 12 }}>
              {['green', 'yellow', 'orange', 'red', 'gray'].map(t => {
                const v = d[t];
                if (!v) return null;
                return (
                  <div key={t} title={`${t}: ${v}`} style={{
                    height: `${(v / max) * 140}px`,
                    background: `var(--triage-${t})`,
                    opacity: 0.9,
                  }} />
                );
              })}
            </div>
            <div style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 10.5, color: 'var(--text-muted)', letterSpacing: '0.06em' }}>{d.day}</div>
            <div className="num" style={{ textAlign: 'center', fontFamily: 'var(--sans)', fontSize: 10, color: 'var(--text-faint)' }}>{total}</div>
          </div>
        );
      })}
    </div>
  );
};

const Legend = ({ tint, label }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontFamily: 'var(--sans)', fontSize: 11, color: 'var(--text-muted)' }}>
    <span className={`triage-dot triage-${tint}-dot`} /> {label}
  </span>
);

const ChangeRow = ({ before, beforeVal, afterVal }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
    <span style={{ flex: 1, fontFamily: 'var(--sans)', fontSize: 12.5, color: 'var(--text)' }}>{before}</span>
    <span className="num" style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)', textDecoration: 'line-through', minWidth: 70, textAlign: 'right' }}>{beforeVal}</span>
    <IconA name="arrow-right" size={13} color="var(--text-faint)" />
    <span className="num" style={{
      fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 17, color: 'var(--triage-green)',
      minWidth: 80, textAlign: 'right', letterSpacing: '-0.01em',
    }}>{afterVal}</span>
  </div>
);

window.AnalyticsScreen = AnalyticsScreen;
