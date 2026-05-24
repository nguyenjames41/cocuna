/* global React */
/* PhoneApp: shell with state machine, persona switch, sheets, voice */

const { useState: useStateA } = React;
const {
  StatusBar, BottomNav,
  ScreenOnboarding, ScreenHome,
  ScreenAsk, ScreenCarePlan, ScreenBPLog,
  ScreenSummary, ScreenMeetings,
  ScreenCompanion, ScreenInbox, ScreenProfile, ScreenClinic, ScreenExpert, ScreenSettings,
} = window;

const PhoneApp = ({ direction }) => {
  const [view, setView]       = useStateA('onboarding'); // onboarding | home | companion | inbox
  const [sheet, setSheet]     = useStateA(null);
  const [expertId, setExpert] = useStateA(null);
  const [persona, setPersona] = useStateA('maria');      // maria | jane
  const [name, setName]       = useStateA('Maria');
  const [checkin, setCheckin] = useStateA({ mood: 2, energy: 2, pain: null });

  const handleOnboard = (n) => {
    setName(n);
    setView('home');
  };

  const openSheet  = (s) => setSheet(s);
  const closeSheet = ()  => { setSheet(null); setExpert(null); };

  const openExpert = (id) => {
    setExpert(id);
    setSheet('expert');
  };

  const switchPersona = () => {
    setPersona(p => p === 'maria' ? 'jane' : 'maria');
    setCheckin({ mood: null, energy: null, pain: null });
  };

  const navigateTo = (target) => {
    if (target === 'ask')        { openSheet('ask'); return; }
    if (target === 'bp-log')     { openSheet('summary'); return; }
    if (target === 'summary')    { openSheet('summary'); return; }
    if (target === 'clinic')     { openSheet('clinic'); return; }
    if (target === 'settings')   { openSheet('settings'); return; }
    if (target === 'care-plan')  { openSheet('care-plan'); return; }
    if (target === 'home')       { setView('home'); closeSheet(); return; }
    if (target === 'companion')  { setView('companion'); closeSheet(); return; }
    if (target === 'meetings')   { setView('meetings'); closeSheet(); return; }
    if (target === 'inbox')      { setView('meetings'); closeSheet(); return; }
  };

  const showNav = view !== 'onboarding' && sheet !== 'ask';
  const navCurrent = sheet === 'care-plan' ? 'care-plan' :
                     sheet ? 'home' : view;

  const renderView = () => {
    if (view === 'onboarding') {
      return <ScreenOnboarding direction={direction} onContinue={handleOnboard} />;
    }
    if (view === 'home') {
      return (
        <ScreenHome
          direction={direction}
          persona={persona}
          onNavigate={navigateTo}
          checkin={checkin}
          setCheckin={setCheckin}
          onSwitchPersona={switchPersona}
          displayName={name}
        />
      );
    }
    if (view === 'companion') {
      return <ScreenCompanion direction={direction} persona={persona} />;
    }
    if (view === 'meetings') {
      return <ScreenMeetings direction={direction} persona={persona} onOpenExpert={openExpert} />;
    }
    if (view === 'inbox') {
      return (
        <ScreenInbox
          direction={direction}
          onOpenAsk={() => openSheet('ask')}
          onOpenExpert={openExpert}
        />
      );
    }
    return null;
  };

  const renderSheet = () => {
    if (sheet === 'ask') {
      return (
        <ScreenAsk
          direction={direction}
          persona={persona}
          onClose={closeSheet}
          onOpenCarePlan={() => { closeSheet(); setTimeout(() => openSheet('care-plan'), 50); }}
          onOpenClinic={(id) => openExpert(id || (persona === 'jane' ? 'ruiz' : 'patel'))}
        />
      );
    }
    if (sheet === 'care-plan') return <ScreenCarePlan direction={direction} persona={persona} onClose={closeSheet} />;
    if (sheet === 'clinic')    return <ScreenClinic    direction={direction} onClose={closeSheet} onOpenExpert={openExpert} />;
    if (sheet === 'bp-log')    return <ScreenSummary   direction={direction} persona={persona} onClose={closeSheet} />;
    if (sheet === 'summary')   return <ScreenSummary   direction={direction} persona={persona} onClose={closeSheet} />;
    if (sheet === 'settings')  return <ScreenSettings  direction={direction} onClose={closeSheet} />;
    if (sheet === 'expert')    return <ScreenExpert    direction={direction} expertId={expertId} onBack={() => setSheet(view === 'inbox' ? null : 'clinic')} />;
    return null;
  };

  return (
    <div className={`phone-frame dir-${direction}`}>
      <div className="phone-notch" />
      <div className="phone-screen">
        <StatusBar />

          {view === 'home' && !sheet && (
          <div style={{
            position: 'absolute', top: 14, right: 18, zIndex: 20,
            display: 'flex', gap: 12, alignItems: 'center',
          }}>
            <button
              onClick={() => navigateTo('bp-log')}
              title="BP log"
              style={iconBtn}
            >
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M1.5 8 H4 L6 4 L9 12 L11 8 H14.5" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
              </svg>
            </button>
            <button onClick={() => navigateTo('settings')} title="Settings" style={iconBtn}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="2" stroke="var(--text)" strokeWidth="1.4" />
                <path d="M8 1 V3 M8 13 V15 M1 8 H3 M13 8 H15 M3 3 L4.5 4.5 M11.5 11.5 L13 13 M3 13 L4.5 11.5 M11.5 4.5 L13 3" stroke="var(--text)" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        )}

        {sheet ? renderSheet() : renderView()}

        {showNav && (
          <BottomNav current={navCurrent} onNavigate={navigateTo} direction={direction} />
        )}
      </div>
    </div>
  );
};

const iconBtn = {
  width: 32, height: 32, borderRadius: '50%',
  background: 'var(--surface)',
  border: '1px solid var(--hairline-soft)',
  display: 'grid', placeItems: 'center', cursor: 'pointer',
};

window.PhoneApp = PhoneApp;
