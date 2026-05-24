/* global React */
/* Clinical iconography — thin, calm line glyphs. No emojis. */

const Icon = ({ name, size = 16, stroke = 1.6, color = 'currentColor' }) => {
  const s = stroke;
  switch (name) {
    case 'queue':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16M4 12h10M4 17h16"/></svg>);
    case 'patients':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5"/><circle cx="17" cy="9" r="2.2"/><path d="M14 20c0-2 1.5-3 3-3s3 1 3 3"/></svg>);
    case 'thread':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M4 6h16v10H8l-4 4V6z"/></svg>);
    case 'analytics':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M22 20H2"/></svg>);
    case 'protocols':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M5 4h14v16H5z"/><path d="M8 8h8M8 12h8M8 16h5"/></svg>);
    case 'sparkles':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M16 16l2 2M16 8l2-2M6 18l2-2"/></svg>);
    case 'phone':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M5 4c0 10 5 15 15 15l-3-4-3 1c-3-1-5-3-6-6l1-3-4-3z"/></svg>);
    case 'search':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>);
    case 'bell':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M6 10a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6z"/><path d="M10 20a2 2 0 0 0 4 0"/></svg>);
    case 'settings':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1A2 2 0 0 1 4.4 17l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1A2 2 0 1 1 7 4.4l.1.1a1.7 1.7 0 0 0 1.8.3h0a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1A2 2 0 1 1 19.6 7l-.1.1a1.7 1.7 0 0 0-.3 1.8v0a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>);
    case 'arrow-right':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 5l7 7-7 7"/></svg>);
    case 'arrow-up-right':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M7 17 17 7M9 7h8v8"/></svg>);
    case 'close':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6L6 18"/></svg>);
    case 'pulse':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12h4l3-7 6 14 3-7h4"/></svg>);
    case 'pill':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="9" width="18" height="6" rx="3"/><path d="M12 9v6"/></svg>);
    case 'baby':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="9" r="5"/><path d="M9 8c.5.5 1 .5 1.5 0M13.5 8c.5.5 1 .5 1.5 0M10 11c1 .5 3 .5 4 0"/><path d="M6 16l-2 5M18 16l2 5M9 14l-2 8M15 14l2 8"/></svg>);
    case 'video':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-2v8l-5-2"/></svg>);
    case 'send':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="m4 4 17 8-17 8 3-8z"/></svg>);
    case 'check':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="m5 12 5 5 9-11"/></svg>);
    case 'calendar':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></svg>);
    case 'shield':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6l-8-3z"/></svg>);
    case 'flag':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M5 4v17M5 4h12l-3 5 3 5H5"/></svg>);
    case 'eye':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>);
    case 'brain':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a3 3 0 0 0-3 3 3 3 0 0 0-3 5 3 3 0 0 0 2 5 3 3 0 0 0 4 3 3 3 0 0 0 4-3 3 3 0 0 0 2-5 3 3 0 0 0-3-5 3 3 0 0 0-3-3z"/></svg>);
    case 'drop':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M12 3c0 7 6 8 6 13a6 6 0 1 1-12 0c0-5 6-6 6-13z"/></svg>);
    case 'moon':
      return (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={s} strokeLinecap="round" strokeLinejoin="round"><path d="M21 13A9 9 0 1 1 11 3a7 7 0 0 0 10 10z"/></svg>);
    case 'cocuna':
      return (<svg width={size} height={size} viewBox="0 0 64 64" fill="none"><defs><linearGradient id="cg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#C4A6D6"/><stop offset="1" stopColor="#9FC9B2"/></linearGradient></defs><path d="M22 12c-8 0-12 8-12 18s4 22 12 22c4 0 7-3 7-7l-2-2c-1 0-2 1-3 2-1 1-2 1-3 0-2-2-3-7-3-15s1-13 3-15c1-1 2-1 3 0l3 3a4 4 0 0 1 1 3c0 5 4 9 9 9s9-4 9-9-4-9-9-9c-2 0-3 1-4 1-3-1-7-1-11-1z" fill="url(#cg)"/><circle cx="42" cy="28" r="3" fill="#B7D0E2"/></svg>);
    default:
      return null;
  }
};

window.Icon = Icon;
