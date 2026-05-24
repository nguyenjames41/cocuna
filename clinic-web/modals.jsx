/* global React */
/* Modals + toast system: Call now, Generate summary typing, Copy-to-chart toast. */

const { useState: useStateM, useEffect: useEffectM } = React;
const { Icon: IconM } = window;

/* ============ TOAST SYSTEM ============ */
const ToastContext = React.createContext(() => {});

const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useStateM([]);
  const push = (msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setToasts(prev => [...prev, { id, msg, ...opts }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), opts.duration || 2600);
  };
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div style={{
        position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column-reverse', gap: 10,
        zIndex: 200, pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{
            padding: '12px 18px',
            background: t.tone === 'red' ? 'var(--triage-red)' : 'var(--surface)',
            color: t.tone === 'red' ? 'white' : 'var(--text)',
            border: t.tone === 'red' ? 'none' : '1px solid var(--hairline)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', gap: 10,
            boxShadow: '0 24px 60px rgba(31, 37, 32, 0.18)',
            fontFamily: 'var(--sans)', fontSize: 13, fontWeight: 500,
            animation: 'toast-in 280ms cubic-bezier(0.2, 0.7, 0.2, 1)',
            pointerEvents: 'auto',
            minWidth: 220,
          }}>
            <div style={{
              width: 26, height: 26, borderRadius: '50%',
              background: t.tone === 'red' ? 'rgba(255,255,255,0.18)' : 'var(--triage-green-soft)',
              display: 'grid', placeItems: 'center',
              color: t.tone === 'red' ? 'white' : 'var(--triage-green)',
              flexShrink: 0,
            }}>
              <IconM name={t.icon || 'check'} size={14} stroke={2.2} color="currentColor" />
            </div>
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
      <style>{`@keyframes toast-in { from { transform: translateY(10px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }`}</style>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

/* ============ CALL MODAL ============ */
const CallModal = ({ patient, onClose }) => {
  const [phase, setPhase] = useStateM('ringing'); // ringing -> connected -> ended
  const [seconds, setSeconds] = useStateM(0);
  const me = window.COCUNA_DATA.CLINICIAN_ME;

  useEffectM(() => {
    if (phase !== 'ringing') return;
    const t = setTimeout(() => setPhase('connected'), 2400);
    return () => clearTimeout(t);
  }, [phase]);

  useEffectM(() => {
    if (phase !== 'connected') return;
    const i = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(i);
  }, [phase]);

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: 'rgba(20, 17, 14, 0.5)',
      backdropFilter: 'blur(8px)',
      display: 'grid', placeItems: 'center',
      animation: 'cm-fade 240ms ease-out',
    }}>
      <div style={{
        width: 360, padding: '32px 28px',
        background: 'var(--surface)',
        borderRadius: 24,
        boxShadow: '0 40px 80px rgba(0, 0, 0, 0.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18,
        animation: 'cm-pop 360ms cubic-bezier(0.2, 0.7, 0.2, 1)',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -40, left: -40, right: -40, height: 200,
          background: 'radial-gradient(circle at center, var(--triage-red-soft), transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', display: 'grid', placeItems: 'center' }}>
          {phase === 'ringing' && [0, 1, 2].map(i => (
            <span key={i} style={{
              position: 'absolute',
              width: 120, height: 120, borderRadius: '50%',
              border: '2px solid var(--triage-red)',
              opacity: 0,
              animation: `cm-pulse 2000ms ease-out infinite`,
              animationDelay: `${i * 600}ms`,
            }} />
          ))}
          <div style={{
            width: 88, height: 88, borderRadius: '50%',
            background: 'var(--lavender-soft)',
            display: 'grid', placeItems: 'center',
            fontFamily: 'var(--serif)', fontWeight: 600, fontSize: 30,
            color: 'var(--text)',
            position: 'relative', zIndex: 1,
          }}>{patient.avatar.initials}</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <span className="serif" style={{
            fontVariationSettings: '"opsz" 96', fontWeight: 600, fontSize: 24,
            letterSpacing: '-0.018em', color: 'var(--text)',
          }}>{patient.name}</span>
          <span style={{ fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text-muted)' }}>
            {phase === 'ringing'   && 'Calling\u2026'}
            {phase === 'connected' && `Connected \u00b7 ${mm}:${ss}`}
            {phase === 'ended'     && 'Call ended'}
          </span>
        </div>

        <div style={{
          padding: '10px 14px', background: 'var(--surface-soft)', borderRadius: 12,
          fontFamily: 'var(--sans)', fontSize: 12, color: 'var(--text)',
          textAlign: 'center', maxWidth: 280, lineHeight: 1.5,
        }}>
          <div style={{ fontFamily: 'var(--sans)', fontSize: 9.5, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'var(--text-faint)', fontWeight: 600, marginBottom: 4 }}>
            From {me.name}
          </div>
          {patient.id === 'maria' && '"Maria, I\u2019m calling from Huntington-Hill. Your readings look serious. We have a ride coming \u2014 don\u2019t drive yourself."'}
          {patient.id === 'jane'  && '"Jane, thank you for reaching out. Let\u2019s talk \u2014 I have time right now."'}
          {patient.id === 'emily' && '"Emily, I read the chat. Naomi has time at 4pm \u2014 want me to book it?"'}
          {!['maria','jane','emily'].includes(patient.id) && '"Hi, I\u2019m calling about what you logged this morning."'}
        </div>

        <div style={{ display: 'flex', gap: 12, marginTop: 4 }}>
          <button onClick={() => { setPhase('ended'); setTimeout(onClose, 400); }} style={{
            width: 60, height: 60, borderRadius: '50%',
            background: 'var(--triage-red)', color: 'white',
            display: 'grid', placeItems: 'center',
            boxShadow: '0 10px 24px rgba(216, 82, 94, 0.32)',
            cursor: 'pointer',
          }}>
            <IconM name="phone" size={22} color="white" stroke={2.2} />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes cm-fade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes cm-pop  { from { transform: scale(0.92); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes cm-pulse {
          0%   { opacity: 0.5; transform: scale(0.8); }
          70%  { opacity: 0;   transform: scale(1.5); }
          100% { opacity: 0;   transform: scale(1.5); }
        }
      `}</style>
    </div>
  );
};

window.ToastProvider = ToastProvider;
window.useToast      = useToast;
window.CallModal     = CallModal;
