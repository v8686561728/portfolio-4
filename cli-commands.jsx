// cli-commands.jsx — every command and its renderer.
// Registered to window.CLI_COMMANDS for cli-engine.jsx to look up.

const { VINOD: V, EXPERIENCE: EXP, SKILLS: SK, AWARDS: AW,
        PROJECTS: PJ, EDUCATION: EDU, CERTIFICATIONS: CRT } = window;

// Mutex so only one instance of each game runs at a time (cleared by `clear`).
const ACTIVE_GAMES = new Set();

// ── Output-block primitives ────────────────────────────────────────────────

const Out = ({ children, style }) => (
  <div className="cli-mono" style={{ whiteSpace: 'pre-wrap', ...style }}>{children}</div>
);
const Dim   = ({ children }) => <span style={{ opacity: .55 }}>{children}</span>;
const Bold  = ({ children, c }) => <span style={{ fontWeight: 600, color: c }}>{children}</span>;
const Hr    = () => <div style={{ opacity: .3 }}>{'─'.repeat(60)}</div>;

const Section = ({ title, children }) => (
  <div style={{ marginBottom: 4 }}>
    <div style={{ opacity: .6, marginBottom: 4 }}># {title}</div>
    {children}
  </div>
);

// Bar made of block characters — used by `skills` and `cat skills`.
const Bar = ({ pct, width = 24, color }) => {
  const filled = Math.round((pct / 100) * width);
  return (
    <span style={{ color }}>
      {'█'.repeat(filled)}<span style={{ opacity: .2 }}>{'░'.repeat(width - filled)}</span>
    </span>
  );
};

// ── Individual command renderers ───────────────────────────────────────────

function HelpOutput() {
  const rows = [
    ['help',        'list available commands'],
    ['whoami',      'short bio + current role'],
    ['about',       'longer summary'],
    ['experience',  '4 roles · 7+ years'],
    ['skills',      'stack with proficiency bars'],
    ['projects',    'selected work'],
    ['awards',      'recognition'],
    ['education',   'B.Tech · MGIT'],
    ['contact',     'email · phone · socials'],
    ['resume',      'open the PDF'],
    ['code',        'open the IDE view'],
    ['theme',       'phosphor | amber | mono | ice | terra'],
    ['clear',       'clear screen (or ^L)'],
    ['games',       'snake · tetris · breakout'],
    ['help --all',  'including hidden commands'],
  ];
  return (
    <Out>
      <Dim>available commands · <span>tab</span> to autocomplete · <span>↑↓</span> for history</Dim>
      <div style={{ marginTop: 6, display: 'grid',
        gridTemplateColumns: 'max-content 1fr', columnGap: 18, rowGap: 2 }}>
        {rows.map(([c, d]) => (
          <React.Fragment key={c}>
            <CliChip cmd={c.split(' ')[0]} style={{ justifySelf: 'start' }}>{c}</CliChip>
            <span><Dim>— {d}</Dim></span>
          </React.Fragment>
        ))}
      </div>
    </Out>
  );
}

function HelpAllOutput() {
  return (
    <Out>
      <HelpOutput />
      <div style={{ marginTop: 8, opacity: .6 }}># hidden</div>
      <div style={{ marginTop: 4, display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 18, rowGap: 2 }}>
        <CliChip cmd="sudo hire-me">sudo hire-me</CliChip><span><Dim>— escalate to interview</Dim></span>
        <CliChip cmd="vim resume">vim resume</CliChip><span><Dim>— open résumé in pseudo-vim</Dim></span>
        <CliChip cmd="ls">ls</CliChip><span><Dim>— list portfolio entries as files</Dim></span>
        <CliChip cmd="cat about.md">cat about.md</CliChip><span><Dim>— print a file</Dim></span>
        <CliChip cmd="matrix">matrix</CliChip><span><Dim>— follow the white rabbit</Dim></span>
        <CliChip cmd="neofetch">neofetch</CliChip><span><Dim>— system info</Dim></span>
        <CliChip cmd="uptime">uptime</CliChip><span><Dim>— career uptime</Dim></span>
        <CliChip cmd="games">games</CliChip><span><Dim>— list terminal games</Dim></span>
        <CliChip cmd="snake">snake</CliChip><span><Dim>— classic snake game</Dim></span>
        <CliChip cmd="tetris">tetris</CliChip><span><Dim>— tetromino stacking game</Dim></span>
        <CliChip cmd="breakout">breakout</CliChip><span><Dim>— brick breaker game</Dim></span>
      </div>
    </Out>
  );
}

function WhoamiOutput() {
  return (
    <Out>
      <Bold c="var(--acc)">{V.name}</Bold> · {V.role}{'\n'}
      <Dim>{V.location} · {V.yearsExp} yrs</Dim>{'\n'}
      <Dim>currently @ Moody's — building risk & analytics platforms.</Dim>
    </Out>
  );
}

function AboutOutput() {
  return (
    <Out>
      <Section title="about">
        <div style={{ maxWidth: 78 + 'ch', whiteSpace: 'normal' }}>
          {V.summary}
        </div>
      </Section>
      <div style={{ marginTop: 6, display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <CliChip cmd="experience" />
        <CliChip cmd="skills" />
        <CliChip cmd="projects" />
        <CliChip cmd="contact" />
      </div>
    </Out>
  );
}

function ExperienceOutput({ latest = false }) {
  const rows = latest ? EXP.slice(0, 1) : EXP;
  return (
    <Out>
      {rows.map((r, i) => (
        <div key={r.company} style={{ marginBottom: 14 }}>
          <div>
            <span style={{ color: r.color }}>●</span>{' '}
            <Bold>{r.company}</Bold>
            <Dim> · {r.role} · {r.range} · {r.location}</Dim>
            {r.current && <span style={{ color: 'var(--acc)' }}> · current</span>}
          </div>
          <div style={{ paddingLeft: 16, opacity: .85 }}>
            <Dim>{r.blurb}</Dim>
          </div>
          <ul style={{ margin: '4px 0 4px 16px', padding: 0, listStyle: 'none' }}>
            {r.bullets.map((b, j) => (
              <li key={j} style={{ marginBottom: 2 }}>
                <span style={{ opacity: .4 }}>– </span>{b}
              </li>
            ))}
          </ul>
          <div style={{ paddingLeft: 16, marginTop: 4, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {r.stack.map((s) => (
              <span key={s} style={{
                fontSize: 11.5, padding: '1px 7px',
                border: '1px solid currentColor', borderRadius: 3, opacity: .7,
              }}>{s}</span>
            ))}
          </div>
          {r.awards && r.awards.map((a) => (
            <div key={a} style={{ paddingLeft: 16, marginTop: 4 }}>
              <span style={{ color: '#ffb000' }}>★</span> <Dim>{a}</Dim>
            </div>
          ))}
        </div>
      ))}
      {!latest && (
        <div style={{ display: 'flex', gap: 12 }}>
          <CliChip cmd="awards" />
          <CliChip cmd="education" />
          <CliChip cmd="projects" />
        </div>
      )}
    </Out>
  );
}

function SkillsOutput() {
  return (
    <Out>
      <Section title="stack · usage">
        <div style={{ display: 'grid', gridTemplateColumns: '160px max-content 60px max-content',
                      columnGap: 14, rowGap: 1, fontVariantNumeric: 'tabular-nums' }}>
          {SK.map((s) => (
            <React.Fragment key={s.name}>
              <span>{s.name}</span>
              <Bar pct={s.pct} color="var(--acc)" />
              <Dim>{s.pct}%</Dim>
              <Dim>{s.years}y</Dim>
            </React.Fragment>
          ))}
        </div>
      </Section>
      <div style={{ marginTop: 6, display: 'flex', gap: 12 }}>
        <CliChip cmd="experience" />
        <CliChip cmd="projects" />
        <CliChip cmd="contact" />
      </div>
    </Out>
  );
}

function ProjectsOutput() {
  return (
    <Out>
      {PJ.map((p) => (
        <div key={p.name} style={{ marginBottom: 12 }}>
          <div><Bold>{p.name}</Bold> <Dim>· {p.where} · {p.year}</Dim></div>
          <div style={{ paddingLeft: 14, opacity: .85, whiteSpace: 'normal', maxWidth: '80ch' }}>
            {p.blurb}
          </div>
          <div style={{ paddingLeft: 14, marginTop: 3, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {p.stack.map((s) => (
              <span key={s} style={{
                fontSize: 11.5, padding: '1px 7px',
                border: '1px solid currentColor', borderRadius: 3, opacity: .7,
              }}>{s}</span>
            ))}
          </div>
        </div>
      ))}
    </Out>
  );
}

function AwardsOutput() {
  return (
    <Out>
      {AW.map((a) => (
        <div key={a.title} style={{ marginBottom: 8 }}>
          <span style={{ color: '#ffb000' }}>★</span>{' '}
          <Bold>{a.title}</Bold> <Dim>· {a.org} · {a.year}</Dim>
          <div style={{ paddingLeft: 16, opacity: .8, whiteSpace: 'normal', maxWidth: '80ch' }}>
            {a.note}
          </div>
        </div>
      ))}
    </Out>
  );
}

function EducationOutput() {
  return (
    <Out>
      <Bold>{EDU.degree}</Bold> · {EDU.school}{'\n'}
      <Dim>{EDU.range} · {EDU.location}</Dim>{'\n\n'}
      <Dim># certifications</Dim>{'\n'}
      {CRT.map((c) => <div key={c}>· {c}</div>)}
    </Out>
  );
}

function ContactOutput() {
  return (
    <Out>
      <Section title="contact">
        <div>📧 <a href={`mailto:${V.email}`} style={{ color: 'var(--acc)' }}>{V.email}</a></div>
        <div>📞 <Dim>{V.phone}</Dim></div>
        <div>🌐 <a href={`https://${V.site}`} target="_blank" style={{ color: 'var(--acc)' }}>{V.site}</a></div>
        <div>📍 <Dim>{V.location}</Dim></div>
      </Section>
      <div style={{ marginTop: 6 }}>
        <CliChip cmd="sudo hire-me" />
      </div>
    </Out>
  );
}

function ResumeOutput() {
  return (
    <Out>
      <Dim>opening Vinod_V_Resume_2026.pdf …</Dim>{'\n'}
      <a href="uploads/Vinod_V_Resume_2026.pdf" target="_blank"
         style={{ color: 'var(--acc)', textDecoration: 'underline' }}>
        ↗ click to open in a new tab
      </a>
    </Out>
  );
}

function NeofetchOutput() {
  const ascii = `      _    _____ ____  _   _  ___  ____
     | |  |_   _|  _ \\| \\ | |/ _ \\|  _ \\
   _ | |    | | | | | |  \\| | | | | | | |
  | || |_   | | | |_| | |\\  | |_| | |_| |
   \\___(_)  |_| |____/|_| \\_|\\___/|____/`;
  return (
    <Out style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', columnGap: 24 }}>
      <pre style={{ margin: 0, color: 'var(--acc)', fontSize: 10.5, lineHeight: 1.05 }}>{ascii}</pre>
      <div style={{ lineHeight: 1.6 }}>
        <div><Bold c="var(--acc)">{V.name.toLowerCase().replace(' ', '')}</Bold>@<Bold c="var(--acc)">portfolio</Bold></div>
        <Dim>{'─'.repeat(28)}</Dim>
        <div><Dim>OS:</Dim> {V.role}</div>
        <div><Dim>Host:</Dim> Moody's · Hyderabad</div>
        <div><Dim>Uptime:</Dim> 7 yrs 4 mo</div>
        <div><Dim>Shell:</Dim> React / Vue / Node</div>
        <div><Dim>Edu:</Dim> B.Tech · MGIT '18</div>
        <div><Dim>Mail:</Dim> {V.email}</div>
        <div style={{ display: 'flex', gap: 4, marginTop: 6 }}>
          {['#1a1a1a','#3a3a3a','#5a5a5a','var(--acc)','#7a9cc6','#c9a86b','#c46a5a','#d4d2cb'].map((c) => (
            <span key={c} style={{ width: 14, height: 8, background: c }} />
          ))}
        </div>
      </div>
    </Out>
  );
}

function UptimeOutput() {
  // Career start: 2018-08
  const start = new Date(2018, 7, 1);
  const now = new Date();
  const ms = now - start;
  const yrs = Math.floor(ms / (365.25 * 24 * 3600 * 1000));
  const mos = Math.floor((ms % (365.25 * 24 * 3600 * 1000)) / (30.44 * 24 * 3600 * 1000));
  return (
    <Out>
      career uptime · <Bold c="var(--acc)">{yrs}y {mos}mo</Bold>{'\n'}
      <Dim>load avg: 0.94 (1m), 0.82 (5m), 0.71 (15m) — sustainable</Dim>
    </Out>
  );
}

function LsOutput() {
  return (
    <Out>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '0 18px' }}>
        {[
          ['about.md', 'cat about.md'],
          ['experience/', 'experience'],
          ['skills.json', 'cat skills'],
          ['projects/', 'projects'],
          ['awards.md', 'awards'],
          ['education.md', 'education'],
          ['contact.md', 'contact'],
          ['resume.pdf', 'resume'],
        ].map(([n, c]) => (
          <CliChip key={n} cmd={c} style={{ textAlign: 'left', color: n.endsWith('/') ? 'var(--acc)' : 'inherit' }}>{n}</CliChip>
        ))}
      </div>
    </Out>
  );
}

function CatOutput({ file }) {
  const f = (file || '').toLowerCase().replace(/\.(md|json|pdf)$/, '');
  if (!f) return <Err>cat: missing file operand · try `ls`</Err>;
  switch (f) {
    case 'about':      return <AboutOutput />;
    case 'skills':     return <SkillsOutput />;
    case 'experience': return <ExperienceOutput />;
    case 'awards':     return <AwardsOutput />;
    case 'projects':   return <ProjectsOutput />;
    case 'education':  return <EducationOutput />;
    case 'contact':    return <ContactOutput />;
    case 'resume':     return <ResumeOutput />;
    default:           return <Err>{`cat: ${file}: No such file or directory`}</Err>;
  }
}

// "sudo hire-me" — escalate; opens a mailto draft.
function HireMeOutput() {
  const subject = encodeURIComponent('Interested in working with you');
  const body = encodeURIComponent(
    `Hi Vinod,\n\nI saw your portfolio at vinodgopal.dev and I'd love to chat about a role.\n\n— `
  );
  return (
    <Out>
      <span style={{ color: '#ffb000' }}>[sudo]</span> <Dim>password for visitor: </Dim>
      <span style={{ color: 'var(--acc)' }}>••••••••••</span>{' '}
      <span style={{ color: '#7ed957' }}>OK</span>{'\n'}
      <Bold c="var(--acc)">access granted.</Bold> initiating contact protocol…{'\n\n'}
      ┌───────────────────────────────────────────────────┐{'\n'}
      │ <Bold>let's talk.</Bold>                                       │{'\n'}
      │ <Dim>Vinod is open to senior-IC and tech-lead roles.</Dim>    │{'\n'}
      │                                                   │{'\n'}
      │ <a href={`mailto:${V.email}?subject=${subject}&body=${body}`}
           style={{ color: 'var(--acc)', textDecoration: 'underline' }}>
           ↗ open draft email
         </a>{'                              '}│{'\n'}
      │ <a href={`https://${V.site}`} target="_blank"
           style={{ color: 'var(--acc)', textDecoration: 'underline' }}>
           ↗ {V.site}
         </a>{'                              '}│{'\n'}
      └───────────────────────────────────────────────────┘
    </Out>
  );
}

// "matrix" — fun easter egg, brief rain effect rendered into the stream.
function MatrixOutput() {
  const cols = 60, rows = 7;
  const chars = 'ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄ01';
  const grid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => chars[Math.floor(Math.random() * chars.length)]).join(''));
  return (
    <Out>
      <pre style={{ margin: 0, color: '#7ed957', lineHeight: 1.05, fontSize: 12 }}>
        {grid.join('\n')}
      </pre>
      <Dim>wake up, Neo… (just type `clear` to escape)</Dim>
    </Out>
  );
}

// "vim resume" — pseudo-vim modal. Stays minimal.
function VimResumeOutput() {
  return (
    <Out>
      <div style={{
        border: '1px solid currentColor', padding: 8,
        background: 'rgba(255,255,255,.02)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', opacity: .6 }}>
          <span>"resume.pdf" [readonly]</span>
          <span>1,1  Top</span>
        </div>
        <div style={{ marginTop: 6 }}>
          <Dim># Vinod V — Senior Software Engineer (7+ yrs)</Dim>{'\n'}
          {'\n'}
          → <a href="uploads/Vinod_V_Resume_2026.pdf" target="_blank"
               style={{ color: 'var(--acc)', textDecoration: 'underline' }}>open the real PDF ↗</a>{'\n'}
          {'\n'}
          <Dim>(this is :read-only. press `:q` mentally and `clear` to exit.)</Dim>
        </div>
      </div>
    </Out>
  );
}

// "theme" — read or set the theme.
function ThemeCommand({ args, ctx }) {
  const valid = ['phosphor','amber','mono','ice','terra'];
  if (args.length === 0) {
    ctx.append(<Out>
      current theme: <Bold c="var(--acc)">{ctx.theme.name}</Bold>{'\n'}
      <Dim>options: {valid.map((v, i) => <React.Fragment key={v}>
        <CliChip cmd={`theme ${v}`}>{v}</CliChip>{i < valid.length - 1 ? ' · ' : ''}
      </React.Fragment>)}</Dim>
    </Out>);
    return;
  }
  const t = args[0].toLowerCase();
  if (!valid.includes(t)) {
    ctx.append(<Err>theme: unknown theme '{t}'. options: {valid.join(', ')}</Err>);
    return;
  }
  ctx.setTheme(t);
  ctx.append(<Out><Dim>theme → </Dim><Bold c="var(--acc)">{t}</Bold></Out>);
}

// ── Terminal games ────────────────────────────────────────────────────────────

// Snake ──────────────────────────────────────────────────────────────────────
const SN_W = 20, SN_H = 16;

function snakeRandomFood(snake) {
  const occ = new Set(snake.map(([c, r]) => `${c},${r}`));
  let p;
  do { p = [Math.floor(Math.random() * SN_W), Math.floor(Math.random() * SN_H)]; }
  while (occ.has(`${p[0]},${p[1]}`));
  return p;
}

function SnakeGame() {
  const [score, setScore]     = React.useState(0);
  const [hiScore, setHiScore] = React.useState(() => +(localStorage.getItem('snake-hi') || 0));
  const [phase, setPhase]     = React.useState('idle'); // idle | playing | dead | blocked
  const [, setTick]           = React.useState(0);

  const snakeR   = React.useRef([[10, 8], [9, 8], [8, 8]]);
  const dirR     = React.useRef([1, 0]);
  const nextDirR = React.useRef([1, 0]);
  const foodR    = React.useRef(snakeRandomFood([[10, 8], [9, 8], [8, 8]]));
  const scoreR   = React.useRef(0);

  React.useEffect(() => {
    if (ACTIVE_GAMES.has('snake')) { setPhase('blocked'); return; }
    ACTIVE_GAMES.add('snake');
    return () => ACTIVE_GAMES.delete('snake');
  }, []);

  React.useEffect(() => {
    if (phase === 'dead' || phase === 'blocked') return;
    const DIRS = {
      w: [0,-1], W: [0,-1], ArrowUp: [0,-1],
      s: [0, 1], S: [0, 1], ArrowDown: [0, 1],
      a: [-1,0], A: [-1,0], ArrowLeft: [-1,0],
      d: [1, 0], D: [1, 0], ArrowRight: [1, 0],
    };
    const handler = (e) => {
      if (!DIRS[e.key]) return;
      e.preventDefault(); e.stopPropagation();
      const [dc, dr] = DIRS[e.key];
      const [cc, cr] = dirR.current;
      if (dc !== -cc || dr !== -cr) nextDirR.current = [dc, dr];
      if (phase === 'idle') setPhase('playing');
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [phase]);

  const speedMs = Math.max(80, 220 - scoreR.current);

  React.useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      dirR.current = nextDirR.current;
      const [hc, hr] = snakeR.current[0];
      const [dc, dr] = dirR.current;
      const nh = [hc + dc, hr + dr];
      const dead =
        nh[0] < 0 || nh[0] >= SN_W || nh[1] < 0 || nh[1] >= SN_H ||
        snakeR.current.slice(0, -1).some(([c, r]) => c === nh[0] && r === nh[1]);
      if (dead) {
        const hi = Math.max(scoreR.current, +(localStorage.getItem('snake-hi') || 0));
        localStorage.setItem('snake-hi', hi);
        setHiScore(hi);
        setPhase('dead');
        return;
      }
      const atFood = nh[0] === foodR.current[0] && nh[1] === foodR.current[1];
      const ns = [nh, ...snakeR.current];
      if (!atFood) ns.pop();
      else {
        scoreR.current += 10;
        setScore(scoreR.current);
        foodR.current = snakeRandomFood(ns);
      }
      snakeR.current = ns;
      setTick(t => t + 1);
    }, speedMs);
    return () => clearInterval(id);
  }, [phase, speedMs]);

  function buildSnakeBoard() {
    const G = Array.from({ length: SN_H + 2 }, () => Array(SN_W + 2).fill(' '));
    G[0][0] = '┌'; G[0][SN_W + 1] = '┐';
    G[SN_H + 1][0] = '└'; G[SN_H + 1][SN_W + 1] = '┘';
    for (let c = 1; c <= SN_W; c++) { G[0][c] = '─'; G[SN_H + 1][c] = '─'; }
    for (let r = 1; r <= SN_H; r++) { G[r][0] = '│'; G[r][SN_W + 1] = '│'; }
    const [fc, fr] = foodR.current;
    G[fr + 1][fc + 1] = '●';
    snakeR.current.slice(1).forEach(([c, r]) => { G[r + 1][c + 1] = '█'; });
    const [hc, hr] = snakeR.current[0];
    const [dc, dr] = dirR.current;
    G[hr + 1][hc + 1] = dc === 1 ? '▶' : dc === -1 ? '◀' : dr === -1 ? '▲' : '▼';
    if (phase === 'idle') {
      const msg = ' press WASD to start ';
      const sc = Math.floor((SN_W - msg.length) / 2) + 1;
      const mr = Math.floor(SN_H / 2) + 1;
      [...msg].forEach((ch, i) => { G[mr][sc + i] = ch; });
    }
    return G.map(row => row.join('')).join('\n');
  }

  if (phase === 'blocked') {
    return <Out><Dim>snake: a game is already running · type `clear` to reset</Dim></Out>;
  }
  return (
    <Out style={{ userSelect: 'none' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 2, alignItems: 'baseline' }}>
        <Bold c="var(--acc)">SNAKE</Bold>
        <span><Dim>score: </Dim>{score}</span>
        <span><Dim>hi: </Dim>{hiScore}</span>
        {phase === 'playing' && <span style={{ marginLeft: 'auto', opacity: .55 }}>WASD · clear to quit</span>}
      </div>
      <pre style={{ margin: 0, lineHeight: 1.3, fontSize: 13 }}>{buildSnakeBoard()}</pre>
      {phase === 'dead' && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bold c="#ff6a5e">GAME OVER</Bold>
          <span><Dim>final: </Dim>{score}  <Dim>hi: </Dim>{hiScore}</span>
          <CliChip cmd="snake">play again</CliChip>
          <CliChip cmd="clear">clear</CliChip>
        </div>
      )}
    </Out>
  );
}

// Tetris ─────────────────────────────────────────────────────────────────────
const TT_W = 10, TT_H = 22;

const TETROMINOS = {
  I: { cells: [[0,0],[1,0],[2,0],[3,0]], char: '█' },
  O: { cells: [[0,0],[1,0],[0,1],[1,1]], char: '▓' },
  T: { cells: [[1,0],[0,1],[1,1],[2,1]], char: '▒' },
  S: { cells: [[1,0],[2,0],[0,1],[1,1]], char: '▐' },
  Z: { cells: [[0,0],[1,0],[1,1],[2,1]], char: '▌' },
  J: { cells: [[0,0],[0,1],[1,1],[2,1]], char: '■' },
  L: { cells: [[2,0],[0,1],[1,1],[2,1]], char: '□' },
};

function ttRotate(cells) {
  const maxY = Math.max(...cells.map(([, y]) => y));
  const rot = cells.map(([x, y]) => [maxY - y, x]);
  const minX = Math.min(...rot.map(([x]) => x));
  const minY = Math.min(...rot.map(([, y]) => y));
  return rot.map(([x, y]) => [x - minX, y - minY]);
}

function ttSpawnPiece() {
  const types = Object.keys(TETROMINOS);
  const type = types[Math.floor(Math.random() * types.length)];
  return {
    cells: TETROMINOS[type].cells.map(c => [...c]),
    x: Math.floor(TT_W / 2) - 2,
    y: 0,
    char: TETROMINOS[type].char,
  };
}

function ttCollides(cells, ox, oy, board) {
  return cells.some(([cx, cy]) => {
    const nx = cx + ox, ny = cy + oy;
    return nx < 0 || nx >= TT_W || ny >= TT_H || (ny >= 0 && board[ny][nx] !== null);
  });
}

function TetrisGame() {
  const [, setTick]       = React.useState(0);
  const [phase, setPhase] = React.useState('idle');

  const boardR  = React.useRef(Array.from({ length: TT_H }, () => Array(TT_W).fill(null)));
  const pieceR  = React.useRef(null);
  const nextR   = React.useRef(ttSpawnPiece());
  const scoreR  = React.useRef(0);
  const linesR  = React.useRef(0);
  const levelR  = React.useRef(1);

  React.useEffect(() => {
    if (ACTIVE_GAMES.has('tetris')) { setPhase('blocked'); return; }
    ACTIVE_GAMES.add('tetris');
    return () => ACTIVE_GAMES.delete('tetris');
  }, []);

  const lockAndSpawn = React.useCallback(() => {
    const p = pieceR.current;
    if (!p) return;
    p.cells.forEach(([cx, cy]) => {
      const nx = cx + p.x, ny = cy + p.y;
      if (ny >= 0 && ny < TT_H && nx >= 0 && nx < TT_W) boardR.current[ny][nx] = p.char;
    });
    let cleared = 0;
    for (let r = TT_H - 1; r >= 0; r--) {
      if (boardR.current[r].every(c => c !== null)) {
        boardR.current.splice(r, 1);
        boardR.current.unshift(Array(TT_W).fill(null));
        cleared++; r++;
      }
    }
    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][Math.min(cleared, 4)];
      scoreR.current += pts * levelR.current;
      linesR.current += cleared;
      levelR.current = Math.floor(linesR.current / 10) + 1;
    }
    const np = nextR.current;
    nextR.current = ttSpawnPiece();
    if (ttCollides(np.cells, np.x, np.y, boardR.current)) {
      pieceR.current = null;
      setPhase('over');
    } else {
      pieceR.current = np;
    }
    setTick(t => t + 1);
  }, []);

  React.useEffect(() => {
    if (phase === 'over' || phase === 'blocked') return;
    const GAME_KEYS = new Set(['a','A','d','D','w','W','s','S',' ','ArrowLeft','ArrowRight','ArrowUp','ArrowDown']);
    const handler = (e) => {
      if (!GAME_KEYS.has(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      if (phase === 'idle') {
        pieceR.current = nextR.current;
        nextR.current = ttSpawnPiece();
        setPhase('playing');
        setTick(t => t + 1);
        return;
      }
      const p = pieceR.current;
      if (!p) return;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        if (!ttCollides(p.cells, p.x - 1, p.y, boardR.current)) { p.x--; setTick(t => t + 1); }
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        if (!ttCollides(p.cells, p.x + 1, p.y, boardR.current)) { p.x++; setTick(t => t + 1); }
      } else if (e.key === 'w' || e.key === 'W' || e.key === 'ArrowUp') {
        const rot = ttRotate(p.cells);
        if (!ttCollides(rot, p.x, p.y, boardR.current)) { p.cells = rot; setTick(t => t + 1); }
      } else if (e.key === 's' || e.key === 'S' || e.key === 'ArrowDown') {
        if (!ttCollides(p.cells, p.x, p.y + 1, boardR.current)) { p.y++; scoreR.current++; setTick(t => t + 1); }
      } else if (e.key === ' ') {
        while (!ttCollides(p.cells, p.x, p.y + 1, boardR.current)) { p.y++; scoreR.current += 2; }
        lockAndSpawn();
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [phase, lockAndSpawn]);

  const speedMs = Math.max(100, 800 - (levelR.current - 1) * 70);

  React.useEffect(() => {
    if (phase !== 'playing') return;
    const id = setInterval(() => {
      const p = pieceR.current;
      if (!p) return;
      if (!ttCollides(p.cells, p.x, p.y + 1, boardR.current)) {
        p.y++; setTick(t => t + 1);
      } else {
        lockAndSpawn();
      }
    }, speedMs);
    return () => clearInterval(id);
  }, [phase, speedMs, lockAndSpawn]);

  function buildTetrisBoard() {
    // Each cell renders as 2 chars: '██' filled, '··' empty — uniform tiles, square aspect ratio.
    const display = boardR.current.map(row => [...row]);
    const p = pieceR.current;
    if (p) {
      p.cells.forEach(([cx, cy]) => {
        const nx = cx + p.x, ny = cy + p.y;
        if (ny >= 0 && ny < TT_H && nx >= 0 && nx < TT_W) display[ny][nx] = true;
      });
    }
    const nGrid = Array.from({ length: 4 }, () => Array(4).fill(false));
    const np = nextR.current;
    if (np) np.cells.forEach(([cx, cy]) => { if (cy < 4 && cx < 4) nGrid[cy][cx] = true; });
    const SIDE = [
      '   next:',
      '   ┌────────┐',
      `   │${nGrid[0].map(c => c ? '██' : '··').join('')}│`,
      `   │${nGrid[1].map(c => c ? '██' : '··').join('')}│`,
      `   │${nGrid[2].map(c => c ? '██' : '··').join('')}│`,
      `   │${nGrid[3].map(c => c ? '██' : '··').join('')}│`,
      '   └────────┘',
      '',
      `   score: ${scoreR.current}`,
      `   level: ${levelR.current}`,
      `   lines: ${linesR.current}`,
      '',
      '   W: rotate',
      '   A/D: move',
      '   S: drop',
      '   SPC: slam',
    ];
    const rows = display.map((row, r) => {
      const cells = row.map(c => c ? '██' : '··').join('');
      return `│${cells}│${SIDE[r] || ''}`;
    });
    return ['┌' + '─'.repeat(TT_W * 2) + '┐', ...rows, '└' + '─'.repeat(TT_W * 2) + '┘'].join('\n');
  }

  if (phase === 'blocked') {
    return <Out><Dim>tetris: a game is already running · type `clear` to reset</Dim></Out>;
  }
  return (
    <Out style={{ userSelect: 'none' }}>
      <Bold c="var(--acc)">TETRIS</Bold>
      <pre style={{ margin: '2px 0 0', lineHeight: 1.3, fontSize: 13 }}>{buildTetrisBoard()}</pre>
      {phase === 'idle' && <div style={{ marginTop: 4, opacity: .55 }}>press WASD or Space to start</div>}
      {phase === 'over' && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
          <Bold c="#ff6a5e">GAME OVER</Bold>
          <span><Dim>score: </Dim>{scoreR.current}  <Dim>lvl: </Dim>{levelR.current}  <Dim>lines: </Dim>{linesR.current}</span>
          <CliChip cmd="tetris">play again</CliChip>
          <CliChip cmd="clear">clear</CliChip>
        </div>
      )}
    </Out>
  );
}

// Brick Breaker ──────────────────────────────────────────────────────────────
const BB_W = 32, BB_H = 20;
const BB_BRICK_W = 4, BB_BRICKS_PER_ROW = 8, BB_BRICK_ROWS = 4;
const BB_BRICK_CHARS = ['▓', '█', '▒', '░'];
const BB_PADDLE_W = 7;

function bbInitBricks() {
  const bricks = [];
  for (let row = 0; row < BB_BRICK_ROWS; row++) {
    for (let col = 0; col < BB_BRICKS_PER_ROW; col++) {
      bricks.push({ col, row: row + 1, alive: true, char: BB_BRICK_CHARS[row] });
    }
  }
  return bricks;
}

function BrickBreaker() {
  const [score, setScore] = React.useState(0);
  const [lives, setLives] = React.useState(3);
  const [phase, setPhase] = React.useState('idle');
  const [, setTick]       = React.useState(0);

  // Ball velocity is in cells/second for delta-time physics.
  const ballR    = React.useRef({ x: BB_W / 2, y: BB_H - 3, vx: 9, vy: -9 });
  const paddleR  = React.useRef({ x: Math.floor((BB_W - BB_PADDLE_W) / 2) });
  const bricksR  = React.useRef(bbInitBricks());
  const livesR   = React.useRef(3);
  const scoreR   = React.useRef(0);
  const serveRef = React.useRef(true);  // true = ball on paddle, waiting for Space
  const lastTsR  = React.useRef(null);

  React.useEffect(() => {
    if (ACTIVE_GAMES.has('breakout')) { setPhase('blocked'); return; }
    ACTIVE_GAMES.add('breakout');
    return () => ACTIVE_GAMES.delete('breakout');
  }, []);

  React.useEffect(() => {
    if (phase === 'won' || phase === 'lost' || phase === 'blocked') return;
    const GAME_KEYS = new Set(['a','A','d','D','ArrowLeft','ArrowRight',' ']);
    const handler = (e) => {
      if (!GAME_KEYS.has(e.key)) return;
      e.preventDefault(); e.stopPropagation();
      if (phase === 'idle') { setPhase('playing'); return; }
      const p = paddleR.current;
      if (e.key === 'a' || e.key === 'A' || e.key === 'ArrowLeft') {
        p.x = Math.max(0, p.x - 2);
      } else if (e.key === 'd' || e.key === 'D' || e.key === 'ArrowRight') {
        p.x = Math.min(BB_W - BB_PADDLE_W, p.x + 2);
      } else if (e.key === ' ' && serveRef.current) {
        // Launch from serve
        serveRef.current = false;
        const b = ballR.current;
        b.vx = 9 * (Math.random() > 0.5 ? 1 : -1);
        b.vy = -9;
      }
    };
    window.addEventListener('keydown', handler, true);
    return () => window.removeEventListener('keydown', handler, true);
  }, [phase]);

  React.useEffect(() => {
    if (phase !== 'playing') return;
    lastTsR.current = null;
    let rafId;
    const step = (ts) => {
      rafId = requestAnimationFrame(step);
      // First frame: just record timestamp
      if (lastTsR.current === null) { lastTsR.current = ts; setTick(t => t + 1); return; }
      const dt = Math.min((ts - lastTsR.current) / 1000, 0.05); // seconds, cap at 50ms
      lastTsR.current = ts;

      const b = ballR.current;
      const p = paddleR.current;

      // Serve mode: ball rests on paddle, follows it when moved
      if (serveRef.current) {
        b.x = p.x + BB_PADDLE_W / 2;
        b.y = BB_H - 3;
        setTick(t => t + 1);
        return;
      }

      b.x += b.vx * dt;
      b.y += b.vy * dt;

      // Wall bounces with displacement
      if (b.x <= 0)        { b.x = 0.1;          b.vx =  Math.abs(b.vx); }
      if (b.x >= BB_W - 1) { b.x = BB_W - 1.1;   b.vx = -Math.abs(b.vx); }
      if (b.y <= 0)        { b.y = 0.1;           b.vy =  Math.abs(b.vy); }

      // Paddle bounce
      const py = BB_H - 2;
      if (b.vy > 0 && b.y >= py - 0.8 && b.y <= py + 0.8 &&
          b.x >= p.x - 0.5 && b.x < p.x + BB_PADDLE_W + 0.5) {
        b.vy = -Math.abs(b.vy);
        b.y  = py - 0.9;
        const hit = (b.x - (p.x + BB_PADDLE_W / 2)) / (BB_PADDLE_W / 2);
        b.vx = Math.max(-13, Math.min(13, b.vx + hit * 2.5));
      }

      // Brick collisions
      const bx = Math.round(b.x), by = Math.round(b.y);
      let hitBrick = false;
      bricksR.current.forEach(br => {
        if (!br.alive) return;
        const gc = br.col * BB_BRICK_W;
        if (bx >= gc && bx < gc + BB_BRICK_W && by === br.row) {
          br.alive = false;
          if (b.vy > 0) { b.vy = -Math.abs(b.vy); b.y = br.row - 0.6; }
          else          { b.vy =  Math.abs(b.vy);  b.y = br.row + 0.6; }
          scoreR.current += 10; hitBrick = true;
        }
      });
      if (hitBrick) setScore(scoreR.current);

      if (bricksR.current.every(br => !br.alive)) {
        cancelAnimationFrame(rafId); setPhase('won'); return;
      }

      // Lost ball — enter serve mode for next life
      if (b.y >= BB_H) {
        livesR.current--;
        setLives(livesR.current);
        if (livesR.current <= 0) { cancelAnimationFrame(rafId); setPhase('lost'); return; }
        serveRef.current = true;
        b.x = p.x + BB_PADDLE_W / 2;
        b.y = BB_H - 3;
        b.vx = 9; b.vy = -9;
      }

      setTick(t => t + 1);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [phase]);

  function buildBBBoard() {
    const G = Array.from({ length: BB_H }, () => Array(BB_W).fill(' '));
    bricksR.current.forEach(({ col, row, alive, char }) => {
      if (!alive) return;
      const gc = col * BB_BRICK_W;
      for (let i = 0; i < BB_BRICK_W; i++) G[row][gc + i] = char;
    });
    const px = Math.round(Math.max(0, Math.min(BB_W - BB_PADDLE_W, paddleR.current.x)));
    G[BB_H - 2][px] = '╞';
    for (let i = 1; i < BB_PADDLE_W - 1; i++) G[BB_H - 2][px + i] = '═';
    G[BB_H - 2][px + BB_PADDLE_W - 1] = '╡';
    const bx = Math.round(ballR.current.x), by = Math.round(ballR.current.y);
    if (bx >= 0 && bx < BB_W && by >= 0 && by < BB_H) G[by][bx] = '●';
    // Overlay messages
    const overlay = phase === 'idle'
      ? ' A/D or ←→ to move  ·  any key to start '
      : serveRef.current
        ? '        press SPACE to launch        '
        : null;
    if (overlay) {
      const sc = Math.max(0, Math.floor((BB_W - overlay.length) / 2));
      [...overlay.slice(0, BB_W - sc)].forEach((ch, i) => { G[BB_H - 6][sc + i] = ch; });
    }
    return ['┌' + '─'.repeat(BB_W) + '┐',
      ...G.map(r => '│' + r.join('') + '│'),
      '└' + '─'.repeat(BB_W) + '┘'].join('\n');
  }

  if (phase === 'blocked') {
    return <Out><Dim>breakout: a game is already running · type `clear` to reset</Dim></Out>;
  }
  const livesStr = '♥'.repeat(Math.max(0, livesR.current)) + '♡'.repeat(Math.max(0, 3 - livesR.current));
  return (
    <Out style={{ userSelect: 'none' }}>
      <div style={{ display: 'flex', gap: 16, marginBottom: 2, alignItems: 'baseline' }}>
        <Bold c="var(--acc)">BREAKOUT</Bold>
        <span><Dim>score: </Dim>{score}</span>
        <span style={{ color: '#ff6a5e' }}>{livesStr}</span>
        {phase === 'playing' && !serveRef.current && <span style={{ marginLeft: 'auto', opacity: .55 }}>A/D · ←→ · clear to quit</span>}
      </div>
      <pre style={{ margin: 0, lineHeight: 1.3, fontSize: 13 }}>{buildBBBoard()}</pre>
      {(phase === 'won' || phase === 'lost') && (
        <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 12 }}>
          {phase === 'won' ? <Bold c="var(--acc)">YOU WIN!</Bold> : <Bold c="#ff6a5e">GAME OVER</Bold>}
          <span><Dim>score: </Dim>{score}</span>
          <CliChip cmd="breakout">play again</CliChip>
          <CliChip cmd="clear">clear</CliChip>
        </div>
      )}
    </Out>
  );
}

// Games menu ─────────────────────────────────────────────────────────────────
function GamesOutput() {
  return (
    <Out>
      <Dim># terminal games</Dim>
      <div style={{ marginTop: 6, display: 'grid', gridTemplateColumns: 'max-content 1fr', columnGap: 18, rowGap: 4 }}>
        <CliChip cmd="snake" style={{ justifySelf: 'start' }}>snake</CliChip>
        <span><Dim>— classic snake · WASD · 20×16</Dim></span>
        <CliChip cmd="tetris" style={{ justifySelf: 'start' }}>tetris</CliChip>
        <span><Dim>— tetrominos · WASD + Space · 10×20</Dim></span>
        <CliChip cmd="breakout" style={{ justifySelf: 'start' }}>breakout</CliChip>
        <span><Dim>— brick breaker · A/D or ←→ · 32×20</Dim></span>
      </div>
      <div style={{ marginTop: 6 }}><Dim>tip: type `clear` or click [clear] to exit a game</Dim></div>
    </Out>
  );
}

// ── Registry ───────────────────────────────────────────────────────────────

const CLI_COMMANDS = {
  help:       { exec: ({ args, ctx }) => ctx.append(args[0] === '--all'
                                          ? <HelpAllOutput /> : <HelpOutput />) },
  whoami:     { exec: ({ ctx }) => ctx.append(<WhoamiOutput />) },
  about:      { exec: ({ ctx }) => ctx.append(<AboutOutput />) },
  experience: { exec: ({ args, ctx }) => ctx.append(<ExperienceOutput latest={args[0] === '--latest'} />) },
  exp:        { exec: ({ ctx }) => ctx.append(<ExperienceOutput />) },
  skills:     { exec: ({ ctx }) => ctx.append(<SkillsOutput />) },
  projects:   { exec: ({ ctx }) => ctx.append(<ProjectsOutput />) },
  awards:     { exec: ({ ctx }) => ctx.append(<AwardsOutput />) },
  education:  { exec: ({ ctx }) => ctx.append(<EducationOutput />) },
  edu:        { exec: ({ ctx }) => ctx.append(<EducationOutput />) },
  contact:    { exec: ({ ctx }) => ctx.append(<ContactOutput />) },
  resume:     { exec: ({ ctx }) => ctx.append(<ResumeOutput />) },
  ls:         { exec: ({ ctx }) => ctx.append(<LsOutput />) },
  cat:        { exec: ({ args, ctx }) => ctx.append(<CatOutput file={args[0]} />) },
  clear:      { exec: ({ ctx }) => ctx.clear() },
  theme:      { exec: ThemeCommand },
  neofetch:   { exec: ({ ctx }) => ctx.append(<NeofetchOutput />) },
  uptime:     { exec: ({ ctx }) => ctx.append(<UptimeOutput />) },
  matrix:     { exec: ({ ctx }) => ctx.append(<MatrixOutput />) },
  'hire-me':  { exec: ({ ctx }) => ctx.append(<HireMeOutput />) },
  vim:        { exec: ({ args, ctx }) => {
    if ((args[0] || '').toLowerCase().startsWith('resume'))
      ctx.append(<VimResumeOutput />);
    else
      ctx.append(<Err>vim: only `vim resume` is implemented · try it</Err>);
  }},
  code:       { exec: ({ ctx }) => {
    ctx.append(<Out><Dim>opening IDE …</Dim></Out>);
    setTimeout(() => ctx.setMode('ide'), 250);
  }},
  games:      { exec: ({ ctx }) => ctx.append(<GamesOutput />) },
  snake:      { exec: ({ ctx }) => ctx.append(<SnakeGame />) },
  tetris:     { exec: ({ ctx }) => ctx.append(<TetrisGame />) },
  breakout:   { exec: ({ ctx }) => ctx.append(<BrickBreaker />) },
  exit:       { exec: ({ ctx }) => ctx.append(<Out><Dim>nice try. you're stuck with me.</Dim></Out>) },
  echo:       { exec: ({ args, ctx }) => ctx.append(<Out>{args.join(' ')}</Out>) },
  pwd:        { exec: ({ ctx }) => ctx.append(<Out>/home/vinod</Out>) },
  date:       { exec: ({ ctx }) => ctx.append(<Out>{new Date().toString()}</Out>) },
};

window.CLI_COMMANDS = CLI_COMMANDS;
Object.assign(window, {
  HelpOutput, WhoamiOutput, AboutOutput, ExperienceOutput, SkillsOutput,
  ProjectsOutput, AwardsOutput, EducationOutput, ContactOutput, ResumeOutput,
});
