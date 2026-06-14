// ide-shell.jsx — IDE mode: titlebar, file tree, tabs, editor, terminal.

const FILES = [
  { id: 'home',     path: 'home.tsx',    kind: 'tsx',  group: 'about'    },
  { id: 'about',    path: 'about.html',  kind: 'html', group: 'about'    },
  { id: 'projects', path: 'projects.js', kind: 'js',   group: 'projects' },
  { id: 'contact',  path: 'contact.css', kind: 'css',  group: 'root'     },
  { id: 'skills',   path: 'skills.json', kind: 'json', group: 'root'     },
  { id: 'resume',   path: 'resume.pdf',  kind: 'pdf',  group: 'root'     },
];

// ── File type icons ────────────────────────────────────────────────────────

function FileIcon({ kind, size = 14 }) {
  const s = { fontSize: size - 1, fontWeight: 700, fontFamily: 'monospace', lineHeight: 1, display: 'inline-block' };
  switch (kind) {
    case 'tsx':  return <span style={{ ...s, color: '#61dafb' }}>⚛</span>;
    case 'html': return <span style={{ ...s, color: '#e44d26' }}>{'</>'}</span>;
    case 'js':   return <span style={{ ...s, color: '#f7df1e' }}>JS</span>;
    case 'css':  return <span style={{ ...s, color: '#6470ec' }}>CS</span>;
    case 'json': return <span style={{ ...s, color: '#c9a86b' }}>{'{}'}</span>;
    case 'pdf':  return <span style={{ ...s, color: '#c46a5a' }}>PD</span>;
    case 'md':   return <span style={{ ...s, color: '#7aa9d8' }}>MD</span>;
    default:     return <span style={{ ...s, opacity: .4 }}>·</span>;
  }
}

// ── Syntax helpers ─────────────────────────────────────────────────────────

const Kw   = ({ c }) => <span style={{ color: c || '#569cd6' }}>{c ? null : null}</span>; // unused; direct spans below
const Str  = ({ s }) => <span style={{ color: '#ce9178' }}>"{s}"</span>;
const Num  = ({ n }) => <span style={{ color: '#b5cea8' }}>{n}</span>;
const Cmt  = ({ c }) => <span style={{ color: '#6a9955' }}>{c}</span>;
const Prop = ({ p }) => <span style={{ color: '#9cdcfe' }}>{p}</span>;

// ── Shared markdown helpers ────────────────────────────────────────────────

const Md  = ({ children, style }) => <div style={{ lineHeight: 1.7, fontSize: 14, overflowWrap: 'break-word', wordBreak: 'break-word', ...style }}>{children}</div>;
const H1  = ({ children }) => <div style={{ color: '#9aaec9', fontSize: 18, marginBottom: 4 }}># {children}</div>;
const H2  = ({ children }) => <div style={{ color: '#9aaec9', marginTop: 14, marginBottom: 4 }}>## {children}</div>;
const Tag = ({ children }) => (
  <span style={{
    display: 'inline-block', padding: '0 7px', margin: '0 4px 4px 0',
    border: '1px solid currentColor', borderRadius: 3, fontSize: 12, opacity: .8,
  }}>{children}</span>
);

// ── File renderers ─────────────────────────────────────────────────────────

function FileHome() {
  const V = window.VINOD;
  const isMobile = window.innerWidth < 640;
  return (
    <div style={{ padding: isMobile ? '24px 20px' : '52px 48px', maxWidth: 740 }}>
      <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 11 : 13, color: 'rgba(212,210,203,.38)', marginBottom: 22 }}>
        {'// portfolio / home.tsx'}
      </div>
      <div style={{ fontSize: isMobile ? 12 : 14, color: 'rgba(212,210,203,.55)', marginBottom: 10, fontFamily: "'Inter',sans-serif" }}>Hi all. I am</div>
      <h1 style={{ margin: '0 0 8px', fontSize: isMobile ? 32 : 52, fontWeight: 700, color: '#d4d2cb', letterSpacing: '-.02em', lineHeight: 1.05, fontFamily: "'Inter',sans-serif" }}>
        {V.name}
      </h1>
      <div style={{ fontSize: isMobile ? 18 : 26, color: 'var(--acc)', marginBottom: 36, fontFamily: "'JetBrains Mono',monospace" }}>
        &gt; {V.role}
      </div>

      {/* code block */}
      <div style={{
        fontFamily: "'JetBrains Mono',monospace", fontSize: 13.5, lineHeight: 1.85,
        background: 'rgba(255,255,255,.03)', borderRadius: 6, padding: '18px 22px',
        borderLeft: '3px solid var(--acc)', marginBottom: 40, color: '#d4d2cb',
      }}>
        <div><span style={{ color: '#569cd6' }}>const</span> {' '}<Prop p="engineer" /> <span style={{ color: '#d4d4d4' }}>=</span> {'{'}</div>
        <div style={{ paddingLeft: 22 }}><Prop p="company" /><span style={{ color: '#d4d4d4' }}>:</span> <Str s="Moody's" /><span style={{ color: '#d4d4d4' }}>,</span></div>
        <div style={{ paddingLeft: 22 }}><Prop p="experience" /><span style={{ color: '#d4d4d4' }}>:</span> <Num n={7} /> <Cmt c="// years" /><span style={{ color: '#d4d4d4' }}>,</span></div>
        <div style={{ paddingLeft: 22 }}><Prop p="stack" /><span style={{ color: '#d4d4d4' }}>:</span> <Str s="React · Vue · Node · TypeScript" /><span style={{ color: '#d4d4d4' }}>,</span></div>
        <div style={{ paddingLeft: 22 }}><Prop p="location" /><span style={{ color: '#d4d4d4' }}>:</span> <Str s="Hyderabad, IN" /><span style={{ color: '#d4d4d4' }}>,</span></div>
        <div>{'}'}<span style={{ color: '#d4d4d4' }}>;</span></div>
      </div>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button onClick={() => window._ideOpenFile && window._ideOpenFile('projects')}
          style={{
            padding: '10px 28px', background: 'var(--acc)', color: '#0a0c0f',
            border: 0, borderRadius: 4, cursor: 'pointer', fontWeight: 600,
            fontSize: 13, fontFamily: "'Inter',sans-serif", transition: 'filter .12s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.filter = 'brightness(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.filter = ''}>
          view projects
        </button>
        <button onClick={() => window._ideOpenFile && window._ideOpenFile('contact')}
          style={{
            padding: '10px 28px', background: 'transparent', color: 'var(--acc)',
            border: '1px solid var(--acc)', borderRadius: 4, cursor: 'pointer',
            fontSize: 13, fontFamily: "'Inter',sans-serif",
          }}>
          contact me
        </button>
      </div>
    </div>
  );
}

function FileAbout() {
  const V = window.VINOD;
  const isMobile = window.innerWidth < 640;
  return (
    <Md style={isMobile ? { fontSize: 13, paddingRight: 8 } : {}}>
      <H1>About</H1>
      <div style={{ opacity: .7, marginBottom: 10 }}>&gt; {V.role} · {V.location} · {V.yearsExp} yrs</div>
      <p style={{ margin: '0 0 16px', maxWidth: '70ch', wordBreak: 'break-word' }}>{V.summary}</p>
      <H2>links</H2>
      <div style={{ marginBottom: 12 }}>
        · <a href={`mailto:${V.email}`} style={{ color: 'var(--acc)' }}>{V.email}</a><br />
        · <a href={`https://${V.site}`} target="_blank" style={{ color: 'var(--acc)' }}>{V.site}</a><br />
        · {V.location}
      </div>
      <H2>experience</H2>
      {window.EXPERIENCE.map((e) => (
        <div key={e.company} style={{ marginBottom: 16 }}>
          <div><span style={{ color: e.color }}>●</span> <b>{e.company}</b>
            <span style={{ opacity: .6 }}> — {e.role} · {e.range}</span>
            {e.current && <span style={{ color: 'var(--acc)' }}> · current</span>}
          </div>
          <ul style={{ margin: '4px 0 6px 16px', padding: 0, listStyle: 'none', opacity: .85 }}>
            {e.bullets.map((b, i) => <li key={i} style={{ marginBottom: 2 }}>– {b}</li>)}
          </ul>
          <div style={{ paddingLeft: 16 }}>{e.stack.map((s) => <Tag key={s}>{s}</Tag>)}</div>
          {e.awards && <div style={{ paddingLeft: 16, marginTop: 4 }}>
            {e.awards.map((a) => <div key={a}><span style={{ color: '#ffb000' }}>★</span> <span style={{ opacity: .7 }}>{a}</span></div>)}
          </div>}
        </div>
      ))}
      <H2>education</H2>
      <div><b>{window.EDUCATION.degree}</b> · {window.EDUCATION.school}</div>
      <div style={{ opacity: .6 }}>{window.EDUCATION.range} · {window.EDUCATION.location}</div>
    </Md>
  );
}

// projects.js — rendered as syntax-highlighted JS
function FileProjects() {
  const PJ = window.PROJECTS;
  const L = ({ indent = 0, children }) => (
    <div style={{ paddingLeft: indent * 20 }}>{children}</div>
  );
  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, color: '#d4d2cb' }}>
      <L><Cmt c="/** projects.js — selected work */" /></L>
      <L><br /></L>
      <L>
        <span style={{ color: '#569cd6' }}>const</span>{' '}
        <Prop p="projects" />{' '}
        <span style={{ color: '#d4d4d4' }}>= [</span>
      </L>
      {PJ.map((p, pi) => (
        <React.Fragment key={p.name}>
          <L indent={1}><span style={{ color: '#d4d4d4' }}>{'{'}</span></L>
          <L indent={2}><Prop p="name" /><span style={{ color: '#d4d4d4' }}>: </span><Str s={p.name} /><span style={{ color: '#d4d4d4' }}>,</span></L>
          <L indent={2}><Prop p="company" /><span style={{ color: '#d4d4d4' }}>: </span><Str s={p.where} /><span style={{ color: '#d4d4d4' }}>,</span></L>
          <L indent={2}><Prop p="year" /><span style={{ color: '#d4d4d4' }}>: </span><Num n={p.year} /><span style={{ color: '#d4d4d4' }}>,</span></L>
          <L indent={2}>
            <Prop p="stack" /><span style={{ color: '#d4d4d4' }}>: [</span>
            {p.stack.map((s, i) => (
              <span key={s}><Str s={s} />{i < p.stack.length - 1 && <span style={{ color: '#d4d4d4' }}>, </span>}</span>
            ))}
            <span style={{ color: '#d4d4d4' }}>],</span>
          </L>
          <L indent={2}><Prop p="description" /><span style={{ color: '#d4d4d4' }}>: </span><Str s={p.blurb} /><span style={{ color: '#d4d4d4' }}>,</span></L>
          <L indent={1}><span style={{ color: '#d4d4d4' }}>{'}'}{pi < PJ.length - 1 ? ',' : ''}</span></L>
          {pi < PJ.length - 1 && <L><br /></L>}
        </React.Fragment>
      ))}
      <L><span style={{ color: '#d4d4d4' }}>];</span></L>
    </div>
  );
}

// contact.css — rendered as CSS
function FileContact() {
  const V = window.VINOD;
  const rule = (sel, props) => (
    <div style={{ marginBottom: 16 }}>
      <span style={{ color: '#d7ba7d' }}>{sel}</span>
      <span style={{ color: '#d4d4d4' }}> {'{'}</span>{'\n'}
      {props.map(([k, v, isLink]) => (
        <div key={k} style={{ paddingLeft: 22 }}>
          <span style={{ color: '#9cdcfe' }}>{k}</span>
          <span style={{ color: '#d4d4d4' }}>: </span>
          {isLink
            ? <a href={isLink} target={isLink.startsWith('http') ? '_blank' : undefined}
                 style={{ color: '#ce9178', textDecoration: 'none' }}>"{v}"</a>
            : <span style={{ color: '#ce9178' }}>"{v}"</span>}
          <span style={{ color: '#d4d4d4' }}>;</span>
        </div>
      ))}
      <span style={{ color: '#d4d4d4' }}>{'}'}</span>
    </div>
  );
  return (
    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.8, color: '#d4d2cb' }}>
      <Cmt c={`/* contact.css — let's work together */`} />{'\n\n'}
      {rule('.contact', [
        ['email',     V.email,    `mailto:${V.email}`],
        ['phone',     V.phone,    null],
        ['location',  V.location, null],
        ['website',   V.site,     `https://${V.site}`],
      ])}
      {rule('.availability', [
        ['status',    'open to opportunities', null],
        ['roles',     'senior-IC, tech-lead',  null],
        ['domains',   'React · Vue · Node · TypeScript', null],
      ])}
      {rule('.socials', [
        ['github',    V.github,   `https://${V.github}`],
        ['linkedin',  V.linkedin, `https://${V.linkedin}`],
      ])}
    </div>
  );
}

function FileSkills() {
  const SK = window.SKILLS;
  return (
    <pre style={{ margin: 0, fontFamily: "'JetBrains Mono',monospace", fontSize: 13, lineHeight: 1.7, color: '#d4d2cb' }}>
      <span style={{ color: 'rgba(212,210,203,.5)' }}>{'{'}</span>{'\n'}
      {SK.map((s, i) => (
        <span key={s.name}>
          {'  '}<span style={{ color: '#7aa9d8' }}>"{s.name}"</span>
          <span style={{ color: 'rgba(212,210,203,.5)' }}>: {'{ '}</span>
          <span style={{ color: '#9cdcfe' }}>"pct"</span><span style={{ color: 'rgba(212,210,203,.5)' }}>: </span>
          <span style={{ color: 'var(--acc)' }}>{s.pct}</span>
          <span style={{ color: 'rgba(212,210,203,.5)' }}>, </span>
          <span style={{ color: '#9cdcfe' }}>"years"</span><span style={{ color: 'rgba(212,210,203,.5)' }}>: </span>
          <span style={{ color: 'var(--acc)' }}>{s.years}</span>
          <span style={{ color: 'rgba(212,210,203,.5)' }}>{' }'}</span>
          {i < SK.length - 1 ? ',' : ''}{'\n'}
        </span>
      ))}
      <span style={{ color: 'rgba(212,210,203,.5)' }}>{'}'}</span>
    </pre>
  );
}

function FileResume() {
  return (
    <Md>
      <H1>resume.pdf</H1>
      <p>Binary file — preview not available in editor.</p>
      <a href="uploads/Vinod_V_Resume_2026.pdf" target="_blank"
         style={{ color: 'var(--acc)', textDecoration: 'underline' }}>↗ open in new tab</a>
    </Md>
  );
}

function renderFile(id) {
  switch (id) {
    case 'home':     return <FileHome />;
    case 'about':    return <FileAbout />;
    case 'projects': return <FileProjects />;
    case 'contact':  return <FileContact />;
    case 'skills':   return <FileSkills />;
    case 'resume':   return <FileResume />;
    default:         return <Md>404 — file not found</Md>;
  }
}

const FILE_BY_ID = Object.fromEntries(FILES.map((f) => [f.id, f]));

// ── Explorer helpers ───────────────────────────────────────────────────────

function FolderRow({ name, open, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 4,
      padding: '3px 8px', cursor: 'pointer', fontSize: 13,
      color: '#d4d2cb', userSelect: 'none',
    }}>
      <span style={{ width: 10, fontSize: 9, opacity: .55 }}>{open ? '▾' : '▸'}</span>
      <span style={{ width: 16, fontSize: 13 }}>📁</span>
      <span>{name}</span>
    </div>
  );
}

function FileRow({ f, depth, active, acc, onOpen }) {
  return (
    <div onClick={() => onOpen(f.id)} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      padding: '3px 8px', paddingLeft: 8 + depth * 16,
      background: active ? 'rgba(255,255,255,.07)' : 'transparent',
      borderLeft: active ? `2px solid ${acc}` : '2px solid transparent',
      color: active ? '#fff' : 'rgba(212,210,203,.75)',
      cursor: 'pointer', fontSize: 13,
    }}
    onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
    onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
      <span style={{ width: 10 }} />
      <span style={{ width: 16, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
        <FileIcon kind={f.kind} size={13} />
      </span>
      <span>{f.path.split('/').pop()}</span>
    </div>
  );
}

// ── Titlebar ───────────────────────────────────────────────────────────────

function Titlebar({ activeId, isMobile }) {
  const f = FILE_BY_ID[activeId];
  const title = f ? `${f.path} — vinod@dev` : 'vinod@dev';
  const menus = isMobile ? ['File', 'Help'] : ['File', 'Edit', 'Selection', 'View', 'Go', 'Run', 'Terminal', 'Help'];
  return (
    <div style={{
      gridRow: 1, gridColumn: '1 / -1',
      background: '#1f2428',
      display: 'flex', alignItems: 'center',
      fontSize: isMobile ? 11 : 12, color: 'rgba(212,210,203,.7)',
      userSelect: 'none', zIndex: 10, flexShrink: 0,
    }}>
      <div style={{ display: 'flex', flexShrink: 0 }}>
        {menus.map((m) => (
          <div key={m}
            style={{ padding: isMobile ? '0 6px' : '0 10px', height: isMobile ? 28 : 30, display: 'flex', alignItems: 'center', cursor: 'default' }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,.08)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
            {m}
          </div>
        ))}
      </div>
      {!isMobile && (
        <div style={{
          position: 'absolute', left: '50%', transform: 'translateX(-50%)',
          color: 'rgba(212,210,203,.45)', fontSize: 12, pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>{title}</div>
      )}
    </div>
  );
}

// ── Main IDE component ─────────────────────────────────────────────────────

function IdeShell({ theme, density, crt, cli, onExit }) {
  const [openTabs, setOpenTabs]         = React.useState(['home']);
  const [activeId, setActiveId]         = React.useState('home');
  const [folders, setFolders]           = React.useState({ about: true, projects: true });
  const [termOpen, setTermOpen]         = React.useState(false);
  const [termHeight, setTermHeight]     = React.useState(220);
  const [palette, setPalette]           = React.useState(false);
  const [palQuery, setPalQuery]         = React.useState('');
  const [palIdx, setPalIdx]             = React.useState(0);
  const [chatOpen, setChatOpen] = React.useState(false);
  const [explorerOpen, setExplorerOpen] = React.useState(true);
  const [sidebarOpen, setSidebarOpen]   = React.useState(false); // mobile sidebar overlay

  // expose openFile for home-page buttons
  React.useEffect(() => {
    window._ideOpenFile = openFile;
    return () => { delete window._ideOpenFile; };
  });

  const openFile = (id) => {
    setOpenTabs((t) => (t.includes(id) ? t : [...t, id]));
    setActiveId(id);
  };
  const closeTab = (id) => {
    setOpenTabs((t) => {
      const next = t.filter((x) => x !== id);
      if (id === activeId) setActiveId(next[Math.max(0, t.indexOf(id) - 1)] || next[0] || null);
      return next;
    });
  };

  const onResizeStart = (e) => {
    e.preventDefault();
    const startY = e.clientY, startH = termHeight;
    const onMove = (ev) => setTermHeight(Math.max(80, Math.min(600, startH + (startY - ev.clientY))));
    const onUp   = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
  };

  React.useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'p') {
        e.preventDefault(); setPalette((p) => !p); setPalQuery(''); setPalIdx(0);
      } else if (e.ctrlKey && e.key === '`') {
        e.preventDefault(); setTermOpen((o) => !o);
      } else if (e.key === 'Escape' && palette) {
        setPalette(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [palette]);

  const palMatches = palQuery
    ? FILES.filter((f) => f.path.toLowerCase().includes(palQuery.toLowerCase()))
    : FILES;

  const acc = theme.acc;
  const fg  = '#d4d2cb';
  const dim = 'rgba(212,210,203,.55)';

  const activeFile = FILE_BY_ID[activeId];
  const isMobile = window.innerWidth < 768;

  return (
    <div className={isMobile ? 'ide-stack-mobile' : ''} style={{
      position: 'relative', width: '100%', height: '100%',
      background: '#1a1c20', color: fg, overflow: 'hidden',
      fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 12 : 13,
      display: 'grid',
      gridTemplateColumns: isMobile
        ? `36px ${explorerOpen && sidebarOpen ? '200px' : '0px'} 1fr${chatOpen ? ' 100%' : ''}`
        : `44px ${explorerOpen ? '240px' : '0px'} 1fr${chatOpen ? ' 280px' : ''}`,
      gridTemplateRows: isMobile ? '28px 28px 1fr 20px' : '30px 32px 1fr 22px',
    }}>

      {/* ── Titlebar ── */}
      <Titlebar activeId={activeId} isMobile={isMobile} />

      {/* ── Activity bar ── */}
      <div style={{
        gridRow: '2 / 4', gridColumn: 1,
        background: '#15171a', borderRight: '1px solid rgba(0,0,0,.4)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: isMobile ? '4px 0' : '10px 0', gap: isMobile ? 2 : 6, color: dim,
      }}>
        {[
          { icon: 'codicon-files',          label: 'Explorer',       sel: false,      onClick: () => { if (isMobile) { setSidebarOpen(s => !s); } else { setExplorerOpen(e => !e); } } },
          { icon: 'codicon-search',         label: 'Search',         sel: false,     onClick: null               },
          { icon: 'codicon-source-control', label: 'Source Control', sel: false,     onClick: null               },
          { icon: 'codicon-extensions',     label: 'Extensions',     sel: false,     onClick: null               },
          { icon: 'codicon-comment-discussion', label: 'Copilot Chat', sel: chatOpen, onClick: () => setChatOpen(o => !o) },
        ].map(({ icon, label, sel, onClick }) => (
          <div key={label} title={label} onClick={onClick || undefined}
            style={{
              width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, display: 'grid', placeItems: 'center',
              borderLeft: sel ? `2px solid ${acc}` : '2px solid transparent',
              color: sel ? fg : dim, cursor: onClick ? 'pointer' : 'default',
            }}
            onMouseEnter={e => { if (onClick && !sel) e.currentTarget.style.color = 'rgba(212,210,203,.85)'; }}
            onMouseLeave={e => { if (!sel) e.currentTarget.style.color = dim; }}>
            <i className={`codicon ${icon}`} style={{ fontSize: isMobile ? 18 : 22 }} />
          </div>
        ))}
        <div style={{ flex: 1 }} />
        <div onClick={onExit} title="$ vinod@dev  (secret terminal)" style={{
          width: isMobile ? 36 : 44, height: isMobile ? 36 : 44, display: 'grid', placeItems: 'center',
          color: dim, cursor: 'pointer',
        }}>
          <i className="codicon codicon-terminal" style={{ fontSize: isMobile ? 18 : 22 }} />
        </div>
      </div>

      {/* ── Explorer sidebar ── */}
      {isMobile && sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 90 }} />
      )}
      <div className={!explorerOpen ? 'ide-hide-mobile' : ''} style={{
        gridRow: '2 / 4', gridColumn: 2,
        background: '#1e2024', borderRight: '1px solid rgba(0,0,0,.4)',
        display: 'flex', flexDirection: 'column', minHeight: 0,
        ...(isMobile && sidebarOpen ? { position: 'fixed', left: 36, top: 0, bottom: 0, width: 220, zIndex: 91, borderLeft: '1px solid rgba(0,0,0,.4)' } : {}),
        ...(isMobile && !sidebarOpen ? { display: 'none' } : {}),
      }}>
        <div style={{
          padding: '8px 14px', fontSize: 10.5,
          letterSpacing: '.12em', color: dim, textTransform: 'uppercase',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span>Explorer</span>
          {isMobile && (
            <span onClick={() => setSidebarOpen(false)} style={{ cursor: 'pointer', opacity: .6, fontSize: 14 }}>✕</span>
          )}
        </div>
        <div className="ide-scroll" style={{ padding: '0 0 12px', overflowY: 'auto', flex: 1 }}>
          <div style={{ padding: '2px 8px', fontSize: 11, color: dim, textTransform: 'uppercase', letterSpacing: '.08em' }}>
            ▾ vinod-portfolio
          </div>
          <FolderRow name="about" open={folders.about}
            onClick={() => setFolders((f) => ({ ...f, about: !f.about }))} />
          {folders.about && FILES.filter((f) => f.group === 'about').map((f) => (
            <FileRow key={f.id} f={f} depth={1} active={f.id === activeId} acc={acc} onOpen={(id) => { openFile(id); if (isMobile) setSidebarOpen(false); }} />
          ))}
          <FolderRow name="projects" open={folders.projects}
            onClick={() => setFolders((f) => ({ ...f, projects: !f.projects }))} />
          {folders.projects && FILES.filter((f) => f.group === 'projects').map((f) => (
            <FileRow key={f.id} f={f} depth={1} active={f.id === activeId} acc={acc} onOpen={(id) => { openFile(id); if (isMobile) setSidebarOpen(false); }} />
          ))}
          {FILES.filter((f) => f.group === 'root').map((f) => (
            <FileRow key={f.id} f={f} depth={0} active={f.id === activeId} acc={acc} onOpen={(id) => { openFile(id); if (isMobile) setSidebarOpen(false); }} />
          ))}
        </div>
      </div>

      {/* ── Tab bar ── */}
      <div className="ide-scroll" style={{
        gridRow: 2, gridColumn: 3,
        background: '#15171a', borderBottom: '1px solid rgba(0,0,0,.4)',
        display: 'flex', alignItems: 'stretch', overflowX: 'auto', overflowY: 'hidden',
      }}>
        {openTabs.map((id) => {
          const f = FILE_BY_ID[id];
          if (!f) return null;
          const active = id === activeId;
          return (
            <div key={id} onClick={() => setActiveId(id)} style={{
              padding: '0 10px 0 12px', display: 'flex', alignItems: 'center', gap: 7,
              background: active ? '#1a1c20' : 'transparent',
              borderRight: '1px solid rgba(0,0,0,.4)',
              borderTop: active ? `2px solid ${acc}` : '2px solid transparent',
              color: active ? fg : dim, fontSize: 12, cursor: 'pointer',
              flex: '1 1 0', minWidth: 60, maxWidth: 180, whiteSpace: 'nowrap',
            }}>
              <span style={{ width: 16, display: 'flex', justifyContent: 'center', flexShrink: 0 }}>
                <FileIcon kind={f.kind} size={12} />
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', flex: 1 }}>{f.path}</span>
              <span onClick={(e) => { e.stopPropagation(); closeTab(id); }}
                    className="ide-close"
                    onMouseDown={(e) => e.preventDefault()}
                    style={{ opacity: .5, padding: '0 3px', borderRadius: 3, fontSize: 11, flexShrink: 0 }}>×</span>
            </div>
          );
        })}
        <div style={{ flex: 1 }} />
      </div>

      {/* ── Editor + terminal ── */}
      <div style={{
        gridRow: 3, gridColumn: 3, minHeight: 0, minWidth: 0,
        display: 'flex', flexDirection: 'column',
      }}>
        {/* editor */}
        <div className={`ide-scroll${crt ? ' wf-crt' : ''}`}
             style={{ flex: 1, overflow: 'auto', minHeight: 0, position: 'relative' }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'flex-start' }}>
            {/* line gutter */}
            <div style={{
              flex: '0 0 auto', padding: isMobile ? '10px 6px 10px 4px' : '14px 10px 14px 8px', textAlign: 'right',
              color: 'rgba(212,210,203,.22)', fontSize: isMobile ? 11 : 12, lineHeight: 1.7,
              userSelect: 'none', minWidth: isMobile ? 28 : 42,
              fontFamily: "'JetBrains Mono',monospace",
            }}>
              {Array.from({ length: 60 }).map((_, i) => <div key={i}>{i + 1}</div>)}
            </div>
            <div style={{
              padding: isMobile ? '10px 12px' : '14px 28px', flex: 1, minWidth: 0, color: fg,
              fontFamily: ['skills', 'projects', 'contact', 'home'].includes(activeId)
                ? "'JetBrains Mono',monospace"
                : "'Inter',ui-sans-serif,system-ui,sans-serif",
            }}>
              {activeId ? renderFile(activeId) : (
                <div style={{ opacity: .4, padding: 40 }}>No file open.</div>
              )}
            </div>
          </div>
        </div>

        {/* drag handle */}
        {termOpen && (
          <div
            onPointerDown={onResizeStart}
            style={{ height: isMobile ? 14 : 4, flexShrink: 0, cursor: 'row-resize', touchAction: 'none', background: 'transparent', borderTop: '1px solid rgba(0,0,0,.5)' }}
            onMouseEnter={(e) => e.currentTarget.style.background = acc}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          />
        )}

        {/* terminal panel */}
        {termOpen && (
          <div style={{ height: termHeight, flexShrink: 0, background: '#0a0c0f', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '4px 12px', fontSize: 11, color: dim, gap: 14,
              background: '#15171a', borderBottom: '1px solid rgba(0,0,0,.4)',
            }}>
              <span style={{ color: fg, borderBottom: `2px solid ${acc}`, padding: '4px 0' }}>TERMINAL</span>
              <span>PROBLEMS</span>
              <span>OUTPUT</span>
              <span>DEBUG CONSOLE</span>
              <span style={{ marginLeft: 'auto', cursor: 'pointer', opacity: .8 }}
                    onClick={() => setTermOpen(false)}>✕</span>
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <CliTerminal cli={cli} theme={theme} density={density} crt={false} hideChrome />
            </div>
          </div>
        )}
      </div>

      {/* ── Right chat panel ── */}
      {chatOpen && (
        <div className={isMobile ? 'ide-chat-mobile' : ''} style={{
          gridRow: isMobile ? '1 / -1' : '2 / 4', gridColumn: isMobile ? '1 / -1' : 4,
          borderLeft: '1px solid rgba(0,0,0,.4)',
          display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden',
          ...(isMobile ? { zIndex: 90 } : {}),
        }}>
          <ChatSidebar theme={theme} onClose={() => setChatOpen(false)} />
        </div>
      )}

      {/* ── Status bar ── */}
      <div style={{
        gridRow: 4, gridColumn: '1 / -1',
        background: '#14171b', color: 'rgba(212,210,203,.6)',
        borderTop: `1px solid rgba(0,0,0,.5)`,
        display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, padding: '0 6px',
        fontSize: isMobile ? 10 : 11, letterSpacing: '.02em',
        overflowX: 'auto', whiteSpace: 'nowrap',
        WebkitOverflowScrolling: 'touch',
      }}>
        <span>⎇ main</span>
        {!isMobile && <span>⓪ 0 △ 0</span>}
        <span style={{ marginLeft: 'auto' }}>{activeFile?.kind?.toUpperCase() || ''}</span>
        <span>{isMobile ? '' : 'UTF-8'}</span>
        {!isMobile && <span>LF</span>}
        {!isMobile && <span>vinodgopal.dev</span>}
        <span style={{ cursor: 'pointer' }} onClick={onExit}>$ terminal</span>
      </div>

      {/* ── Cmd+P palette ── */}
      {palette && (
        <div onClick={() => setPalette(false)} style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,.35)',
          zIndex: 50, display: 'flex', justifyContent: 'center', paddingTop: isMobile ? 40 : 70,
          paddingLeft: isMobile ? 12 : 0, paddingRight: isMobile ? 12 : 0,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            width: isMobile ? '100%' : 520, maxWidth: 520,
            background: '#252830', border: '1px solid rgba(255,255,255,.08)',
            borderRadius: 6, boxShadow: '0 14px 40px rgba(0,0,0,.5)',
            display: 'flex', flexDirection: 'column', maxHeight: isMobile ? '80vh' : 360, overflow: 'hidden',
          }}>
            <input autoFocus value={palQuery}
              onChange={(e) => { setPalQuery(e.target.value); setPalIdx(0); }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowDown') { e.preventDefault(); setPalIdx((i) => Math.min(palMatches.length - 1, i + 1)); }
                if (e.key === 'ArrowUp')   { e.preventDefault(); setPalIdx((i) => Math.max(0, i - 1)); }
                if (e.key === 'Enter')     { e.preventDefault(); const f = palMatches[palIdx]; if (f) { openFile(f.id); setPalette(false); } }
              }}
              placeholder="Search files…"
              style={{
                background: 'transparent', border: 0, outline: 0, color: fg,
                padding: '12px 14px', fontFamily: "'Inter',sans-serif", fontSize: 13.5,
                borderBottom: '1px solid rgba(255,255,255,.08)',
              }} />
            <div className="ide-scroll" style={{ overflowY: 'auto' }}>
              {palMatches.map((f, i) => (
                <div key={f.id}
                     onMouseEnter={() => setPalIdx(i)}
                     onClick={() => { openFile(f.id); setPalette(false); }}
                     style={{
                       padding: '6px 14px', display: 'flex', gap: 10, alignItems: 'center',
                       background: i === palIdx ? 'rgba(255,255,255,.07)' : 'transparent',
                       cursor: 'pointer', fontSize: 13,
                     }}>
                  <span style={{ width: 16, display: 'flex', justifyContent: 'center' }}><FileIcon kind={f.kind} size={12} /></span>
                  <span>{f.path}</span>
                  <span style={{ marginLeft: 'auto', opacity: .4, fontSize: 11 }}>{f.path}</span>
                </div>
              ))}
              {palMatches.length === 0 && <div style={{ padding: 14, color: dim }}>No matches.</div>}
            </div>
          </div>
        </div>
      )}

      {/* keybind hints */}
      {!isMobile && (
        <div style={{
          position: 'absolute', right: chatOpen ? 296 : 12, top: 68, fontSize: 11, color: dim,
          fontFamily: "'Inter',sans-serif", display: 'flex', gap: 14, pointerEvents: 'none',
          transition: 'right .15s',
        }}>
          <span><kbd style={kbdS}>⌘P</kbd> files</span>
          <span><kbd style={kbdS}>⌃`</kbd> terminal</span>
        </div>
      )}
    </div>
  );
}

const kbdS = {
  fontFamily: "'JetBrains Mono',monospace", fontSize: 10.5,
  padding: '1px 5px', borderRadius: 3,
  background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.12)',
};

Object.assign(window, { IdeShell, FILES });
