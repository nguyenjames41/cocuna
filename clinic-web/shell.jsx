/* global React */
/* Shell: sidebar + topbar. Surrounds all views inside the browser-window. */

const { useState: useStateShell } = React;
const { Icon: IconS } = window;

const Sidebar = ({ current, onNavigate, queueCounts }) => {
  const me = window.COCUNA_DATA.CLINICIAN_ME;
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark"><img src="cocuna-logo.jpeg" alt="" /></div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span className="brand-name">cocuna</span>
          <span className="brand-sub">Clinic</span>
        </div>
      </div>

      <div className="nav-group">
        <span className="nav-group-title">Today</span>
        <div className={`nav-item ${current === 'queue' ? 'active' : ''}`} onClick={() => onNavigate('queue')}>
          <IconS name="queue" size={16} />
          <span>Triage queue</span>
          <span className="count">{queueCounts.open}</span>
        </div>
        <div className={`nav-item ${current === 'schedule' ? 'active' : ''}`} onClick={() => onNavigate('schedule')}>
          <IconS name="calendar" size={16} />
          <span>Schedule</span>
          <span className="count">9</span>
        </div>
        <div className={`nav-item ${current === 'analytics' ? 'active' : ''}`} onClick={() => onNavigate('analytics')}>
          <IconS name="analytics" size={16} />
          <span>Analytics</span>
        </div>
      </div>

      <div className="nav-group">
        <span className="nav-group-title">By triage</span>
        <div className="nav-item" onClick={() => onNavigate('queue', { triage: 'red' })}>
          <span className="triage-marker" style={{ background: 'var(--triage-red)' }}></span>
          <span>Urgent</span>
          <span className="count">{queueCounts.red}</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('queue', { triage: 'orange' })}>
          <span className="triage-marker" style={{ background: 'var(--triage-orange)' }}></span>
          <span>Same-day</span>
          <span className="count">{queueCounts.orange}</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('queue', { triage: 'yellow' })}>
          <span className="triage-marker" style={{ background: 'var(--triage-yellow)' }}></span>
          <span>Review</span>
          <span className="count">{queueCounts.yellow}</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('queue', { triage: 'green' })}>
          <span className="triage-marker" style={{ background: 'var(--triage-green)' }}></span>
          <span>Self-care</span>
          <span className="count">{queueCounts.green}</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('queue', { triage: 'gray' })}>
          <span className="triage-marker" style={{ background: 'var(--triage-gray)' }}></span>
          <span>Human review</span>
          <span className="count">{queueCounts.gray}</span>
        </div>
      </div>

      <div className="nav-group">
        <span className="nav-group-title">Library</span>
        <div className="nav-item" onClick={() => onNavigate('protocols')}>
          <IconS name="protocols" size={16} />
          <span>Protocols</span>
        </div>
        <div className="nav-item" onClick={() => onNavigate('mother-view')}>
          <IconS name="phone" size={16} />
          <span>Mother app preview</span>
        </div>
        <div className={`nav-item ${current === 'settings' ? 'active' : ''}`} onClick={() => onNavigate('settings')}>
          <IconS name="settings" size={16} />
          <span>Settings</span>
        </div>
      </div>

      <div className="sidebar-clinician">
        <div className="avatar"><img src={me.photo} alt="" /></div>
        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <span className="name">{me.name}</span>
          <span className="role">{me.role} {'·'} on call</span>
        </div>
      </div>
    </aside>
  );
};

const TopBar = ({ crumb, title, onOpenNotifications, onSignOut }) => {
  return (
    <div className="topbar">
      <div className="topbar-title">
        <span className="crumb">{crumb}</span>
        <span className="name">{title}</span>
      </div>
      <div className="topbar-search">
        <IconS name="search" size={15} />
        <input placeholder={'Search patient, MRN, symptom…'} />
        <span className="kbd">{'⌘K'}</span>
      </div>
      <div className="topbar-actions">
        <button className="topbar-icon-btn" onClick={onOpenNotifications} title="Notifications">
          <IconS name="bell" size={15} />
          <span className="pip"></span>
        </button>
        <button className="topbar-icon-btn" title="Sign out" onClick={onSignOut}>
          <IconS name="close" size={14} />
        </button>
      </div>
    </div>
  );
};

window.Sidebar = Sidebar;
window.TopBar  = TopBar;
