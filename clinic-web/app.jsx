/* global React, ReactDOM */
/* Cocuna Clinic Dashboard — root */

const { useState, useMemo, useEffect, useRef } = React;
const {
  Sidebar, TopBar,
  QueueScreen, PatientDrawer,
  AnalyticsScreen,
  MotherViewScreen, ProtocolsScreen,
  LoginScreen, ScheduleScreen, SettingsScreen,
  CopilotPanel, ToastProvider, useToast, CallModal,
  TweaksPanel, useTweaks,
  TweakSection, TweakRadio, TweakColor, TweakToggle, TweakSelect,
} = window;

/* Tweakable defaults — host rewrites this block when the user changes a control. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "queueView": "table",
  "showScoreNum": true,
  "queueDensity": "medium",
  "role": "ob",
  "tone": "warm",
  "accent": "#7FAE92"
}/*EDITMODE-END*/;

const AppShell = () => {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [signedIn, setSignedIn] = useState(false);
  const [route, setRoute] = useState({ name: 'queue', triage: 'all' });
  const [openPatient, setOpenPatient] = useState(null);
  const [queueTab, setQueueTab] = useState('table');

  // sync queue view tweak with queue tab state
  useEffect(() => { setQueueTab(t.queueView); }, [t.queueView]);
  useEffect(() => {
    if (queueTab !== t.queueView) setTweak('queueView', queueTab);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueTab]);

  // apply theme + accent
  useEffect(() => {
    document.documentElement.classList.toggle('theme-dark', t.theme === 'dark');
    document.documentElement.classList.toggle('theme-light', t.theme !== 'dark');
    if (t.accent) document.documentElement.style.setProperty('--accent', t.accent);
  }, [t.theme, t.accent]);

  if (!signedIn) {
    return <LoginScreen onSignIn={() => setSignedIn(true)} />;
  }

  return (
    <Dashboard
      t={t} setTweak={setTweak}
      route={route} setRoute={setRoute}
      openPatient={openPatient} setOpenPatient={setOpenPatient}
      queueTab={queueTab} setQueueTab={setQueueTab}
      onSignOut={() => setSignedIn(false)}
    />
  );
};

const Dashboard = ({
  t, setTweak,
  route, setRoute,
  openPatient, setOpenPatient,
  queueTab, setQueueTab,
  onSignOut,
}) => {
  const D = window.COCUNA_DATA;

  const queueCounts = useMemo(() => {
    const c = { red: 0, orange: 0, yellow: 0, green: 0, gray: 0, open: 0 };
    D.PATIENTS.forEach(p => {
      c[p.triage]++;
      if (p.triage !== 'green') c.open++;
    });
    return c;
  }, []);

  const navigate = (name, params = {}) => setRoute({ name, ...params });
  const onOpenPatient = (id) => setOpenPatient(id);
  const onCloseDrawer = () => setOpenPatient(null);

  const crumbs = {
    queue:         { crumb: D.CLINIC.name, title: 'Triage queue' },
    schedule:      { crumb: D.CLINIC.name, title: 'Schedule' },
    analytics:     { crumb: D.CLINIC.name, title: 'Analytics' },
    protocols:     { crumb: D.CLINIC.name, title: 'Protocols' },
    'mother-view': { crumb: D.CLINIC.name, title: 'Mother app preview' },
    settings:      { crumb: D.CLINIC.name, title: 'Settings' },
  };
  const c = crumbs[route.name] || crumbs.queue;

  return (
    <div className="app-shell" style={{ height: '100%' }}>
      <Sidebar current={route.name} onNavigate={navigate} queueCounts={queueCounts} />
      <div className="workspace">
        <TopBar
          crumb={c.crumb}
          title={c.title}
          onOpenNotifications={() => setOpenPatient('maria')}
          onSignOut={onSignOut}
        />
        <div className="workspace-body">
          {route.name === 'queue'        && <QueueScreen initialTriage={route.triage} onOpenPatient={onOpenPatient} queueTab={queueTab} setQueueTab={setQueueTab} />}
          {route.name === 'schedule'     && <ScheduleScreen onOpenPatient={onOpenPatient} />}
          {route.name === 'analytics'    && <AnalyticsScreen />}
          {route.name === 'protocols'    && <ProtocolsScreen />}
          {route.name === 'mother-view'  && <MotherViewScreen />}
          {route.name === 'settings'     && <SettingsScreen />}
        </div>
      </div>

      {openPatient && (
        <PatientDrawer patientId={openPatient} onClose={onCloseDrawer} />
      )}

      {/* Right-edge co-pilot */}
      <CopilotPanel openPatientId={openPatient} />

      {/* Tweaks */}
      <ClinicTweaks t={t} setTweak={setTweak} />
    </div>
  );
};

const ClinicTweaks = ({ t, setTweak }) => {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Visual" />
      <TweakRadio
        label="Theme"
        value={t.theme}
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark',  label: 'Dark'  },
        ]}
        onChange={v => setTweak('theme', v)}
      />
      <TweakColor
        label="Accent"
        value={t.accent}
        options={['#7FAE92', '#C4A6D6', '#9FC9B2', '#B7D0E2', '#1F1B16']}
        onChange={v => setTweak('accent', v)}
      />
      <TweakSection label="Queue" />
      <TweakRadio
        label="Layout"
        value={t.queueView}
        options={[
          { value: 'table',  label: 'Table'  },
          { value: 'cards',  label: 'Cards'  },
          { value: 'kanban', label: 'Kanban' },
        ]}
        onChange={v => setTweak('queueView', v)}
      />
      <TweakSection label="Clinician" />
      <TweakSelect
        label="Role"
        value={t.role}
        options={[
          { value: 'ob',         label: 'OB / Maternal-fetal' },
          { value: 'pedi',       label: 'Pediatric' },
          { value: 'mh',         label: 'Behavioral health' },
          { value: 'lactation',  label: 'Lactation' },
          { value: 'nurse',      label: 'On-call nurse' },
        ]}
        onChange={v => setTweak('role', v)}
      />
    </TweaksPanel>
  );
};

const App = () => (
  <ToastProvider>
    <AppShell />
  </ToastProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
