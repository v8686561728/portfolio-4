// chat-panel.jsx — VS Code Copilot-style chat sidebar (no API, rule-based)

// ── Query resolver ────────────────────────────────────────────────────────

function resolveQuery(raw) {
  const q = raw.toLowerCase();
  const has = (...words) => words.some(w => q.includes(w));

  if (has('email', 'mail', 'contact', 'reach', 'phone', 'number', 'website', 'site', 'github', 'linkedin', 'social')) {
    return [
      `Here's how to reach Vinod:`,
      ``,
      `Email     ${VINOD.email}`,
      `Phone     ${VINOD.phone}`,
      `Website   ${VINOD.site}`,
      `GitHub    ${VINOD.github}`,
      `LinkedIn  ${VINOD.linkedin}`,
    ].join('\n');
  }

  if (has('location', 'based', 'where', 'city', 'country', 'india', 'hyderabad')) {
    return `Vinod is based in ${VINOD.location}.`;
  }

  if (has('how many year', 'years of exp', 'how long', 'experience level')) {
    return `Vinod has ${VINOD.yearsExp} years of professional software engineering experience.`;
  }

  if (has('education', 'degree', 'college', 'university', 'school', 'study', 'btech', 'mgit', 'bachelor')) {
    const e = EDUCATION;
    return `Vinod holds a ${e.degree} from ${e.school}, ${e.location} (${e.range}).`;
  }

  if (has('certif', 'course', 'udemy', 'training')) {
    return `Certifications:\n\n${CERTIFICATIONS.map(c => `· ${c}`).join('\n')}`;
  }

  if (has('award', 'recogni', 'achiev', 'honor', 'honour', 'outstanding', 'exceptional')) {
    return [
      `Awards & recognition:`,
      ``,
      ...AWARDS.map(a => `· ${a.title} — ${a.org} (${a.year})\n  ${a.note}`),
    ].join('\n');
  }

  const companyMatch = EXPERIENCE.find(e =>
    q.includes(e.company.toLowerCase()) ||
    (e.company === "EY GDS"    && has('ey', 'ernst', 'young')) ||
    (e.company === "Moody's"   && has("moody"))
  );
  if (companyMatch) {
    const e = companyMatch;
    return [
      `${e.company} — ${e.role}`,
      `${e.range} · ${e.location}`,
      ``,
      ...e.bullets.map(b => `· ${b}`),
      ``,
      `Stack: ${e.stack.join(', ')}`,
      e.awards ? `Awards: ${e.awards.join(', ')}` : null,
    ].filter(x => x !== null).join('\n');
  }

  if (has('project', 'built', 'build', 'created', 'microfrontend', 'oauth', 'audit', 'p&g', 'cms')) {
    return [
      `Notable projects:`,
      ``,
      ...PROJECTS.map(p =>
        `${p.name}  (${p.where}, ${p.year})\n${p.blurb}\nStack: ${p.stack.join(', ')}`
      ),
    ].join('\n\n');
  }

  const skillMatch = SKILLS.find(s =>
    q.includes(s.name.toLowerCase()) ||
    q.includes(s.name.toLowerCase().replace('.js', ''))
  );
  if (skillMatch) {
    return `Vinod has ${skillMatch.years} years of experience with ${skillMatch.name} (proficiency: ${skillMatch.pct}%).`;
  }

  if (has('skill', 'tech', 'stack', 'language', 'framework', 'tool', 'know', 'use')) {
    const top = SKILLS.slice(0, 8).map(s => `${s.name} (${s.years}y)`).join(', ');
    const rest = SKILLS.slice(8).map(s => s.name).join(', ');
    return `Core skills:\n\n${top}\n\nAlso knows: ${rest}`;
  }

  if (has('work', 'experience', 'career', 'job', 'employer', 'compan', 'role', 'position', 'current')) {
    return [
      `Work history:`,
      ``,
      ...EXPERIENCE.map(e => `${e.company}${e.current ? ' (current)' : ''}\n${e.role} · ${e.range}`),
    ].join('\n\n');
  }

  if (has('who', 'about', 'introduce', 'summary', 'tell me', 'describe', 'overview', 'vinod')) {
    return `${VINOD.name} — ${VINOD.role}\n${VINOD.location} · ${VINOD.yearsExp} years experience\n\n${VINOD.summary}`;
  }

  if (has('hi', 'hello', 'hey', 'hiya', 'sup', 'howdy')) {
    return `Hi! I can answer questions about Vinod's experience, skills, projects, awards, education, and contact info.`;
  }

  if (has('thank')) {
    return `You're welcome! Feel free to ask anything else.`;
  }

  return [
    `I can answer questions about Vinod's:`,
    `· experience & work history`,
    `· skills & tech stack`,
    `· projects`,
    `· awards`,
    `· education`,
    `· contact info`,
    ``,
    `Try: "What is his tech stack?" or "Tell me about EY"`,
  ].join('\n');
}

function queryAsync(messages) {
  const last = messages[messages.length - 1].content;
  return new Promise(resolve => setTimeout(() => resolve(resolveQuery(last)), 300));
}

// ── Animated dots ─────────────────────────────────────────────────────────

function ChatThinkingDots({ acc }) {
  const [n, setN] = React.useState(0);
  React.useEffect(() => {
    const t = setInterval(() => setN(x => (x + 1) % 4), 400);
    return () => clearInterval(t);
  }, []);
  return <span style={{ color: acc, letterSpacing: 2 }}>{['·', '··', '···', '····'][n]}</span>;
}

// ── Suggestion chips ──────────────────────────────────────────────────────

const CHAT_SUGGESTIONS = [
  'Who is Vinod?',
  'What is his tech stack?',
  'Current company?',
  'What awards has he won?',
];

// ── Chat sidebar (Copilot-style) ──────────────────────────────────────────

function ChatSidebar({ theme, onClose }) {
  const [messages, setMessages] = React.useState([]);
  const [input, setInput]       = React.useState('');
  const [loading, setLoading]   = React.useState(false);
  const bottomRef = React.useRef(null);
  const inputRef  = React.useRef(null);

  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = async (text) => {
    const q = (text !== undefined ? text : input).trim();
    if (!q || loading) return;
    setInput('');
    const userMsg = { role: 'user', content: q };
    const next = [...messages, userMsg];
    setMessages(next);
    setLoading(true);
    const reply = await queryAsync(next);
    setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
    setLoading(false);
  };

  const acc = theme.acc;
  const fg  = '#d4d2cb';
  const dim = 'rgba(212,210,203,.55)';
  const bg  = '#1e2024';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: bg, overflow: 'hidden' }}>

      {/* Sidebar header */}
      <div style={{
        padding: '8px 14px', fontSize: 10.5, letterSpacing: '.12em',
        color: dim, textTransform: 'uppercase', flexShrink: 0,
        borderBottom: '1px solid rgba(0,0,0,.3)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <i className="codicon codicon-comment-discussion" style={{ fontSize: 13, color: acc }} />
        Copilot Chat
        {messages.length > 0 && (
          <button onClick={() => setMessages([])} title="Clear conversation"
            style={{
              marginLeft: 'auto', background: 'none', border: 'none', color: dim,
              cursor: 'pointer', padding: '2px 4px', borderRadius: 3, fontSize: 11,
              fontFamily: 'inherit',
            }}
            onMouseEnter={e => e.currentTarget.style.color = fg}
            onMouseLeave={e => e.currentTarget.style.color = dim}>
            clear
          </button>
        )}
        {onClose && (
          <button onClick={onClose} title="Close panel" className="ide-close"
            style={{ background: 'none', border: 'none', color: dim, cursor: 'pointer', padding: '2px 4px', borderRadius: 3, marginLeft: messages.length > 0 ? 4 : 'auto' }}>
            <i className="codicon codicon-close" style={{ fontSize: 14 }} />
          </button>
        )}
      </div>

      {/* Messages area */}
      <div className="ide-scroll" style={{
        flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column',
        padding: '0 0 8px',
      }}>

        {/* Welcome screen */}
        {messages.length === 0 && (
          <div style={{ padding: '24px 16px' }}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: `${acc}18`, border: `1px solid ${acc}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 12px',
              }}>
                <i className="codicon codicon-comment-discussion" style={{ fontSize: 18, color: acc }} />
              </div>
              <div style={{ color: fg, fontSize: 13, fontWeight: 500, marginBottom: 4 }}>
                Ask about Vinod
              </div>
              <div style={{ color: dim, fontSize: 11.5, lineHeight: 1.6 }}>
                Get answers about his experience,<br/>skills, and projects.
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {CHAT_SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} className="cli-chip"
                  style={{ textAlign: 'left', fontSize: 11.5, padding: '5px 10px', fontFamily: 'inherit' }}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Message list */}
        {messages.map((m, i) => (
          <div key={i}>
            {m.role === 'user' ? (
              /* User message — right aligned bubble */
              <div style={{ padding: '10px 12px 2px', display: 'flex', justifyContent: 'flex-end' }}>
                <div style={{
                  maxWidth: '82%', fontSize: 12.5, lineHeight: 1.6,
                  padding: '6px 11px', borderRadius: '10px 10px 2px 10px',
                  background: `${acc}20`, color: acc,
                  border: `1px solid ${acc}35`,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {m.content}
                </div>
              </div>
            ) : (
              /* Assistant message — left aligned with icon */
              <div style={{ padding: '10px 12px 2px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <div style={{
                  width: 20, height: 20, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: `${acc}22`, border: `1px solid ${acc}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <i className="codicon codicon-hubot" style={{ fontSize: 11, color: acc }} />
                </div>
                <div style={{
                  flex: 1, fontSize: 12.5, lineHeight: 1.7, color: fg,
                  whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {m.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {loading && (
          <div style={{ padding: '10px 12px', display: 'flex', gap: 8, alignItems: 'center' }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              background: `${acc}22`, border: `1px solid ${acc}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <i className="codicon codicon-hubot" style={{ fontSize: 11, color: acc }} />
            </div>
            <ChatThinkingDots acc={acc} />
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div style={{
        flexShrink: 0, borderTop: '1px solid rgba(0,0,0,.35)',
        padding: '10px 12px', background: '#1a1c20',
      }}>
        <div style={{
          background: 'rgba(255,255,255,.05)', border: `1px solid rgba(255,255,255,.1)`,
          borderRadius: 6, overflow: 'hidden',
          transition: 'border-color .15s',
        }}
          onFocusCapture={e => e.currentTarget.style.borderColor = `${acc}55`}
          onBlurCapture={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,.1)'}>
          <textarea
            ref={inputRef}
            value={input}
            rows={3}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Ask Copilot…  (Enter to send)"
            style={{
              display: 'block', width: '100%', background: 'transparent',
              color: fg, border: 'none', outline: 'none', resize: 'none',
              padding: '8px 10px', fontFamily: "'JetBrains Mono','IBM Plex Mono',ui-monospace,monospace",
              fontSize: 12, lineHeight: 1.55, boxSizing: 'border-box',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '4px 8px 6px' }}>
            <button
              onClick={() => send()}
              disabled={loading || !input.trim()}
              className="cli-chip"
              style={{ fontSize: 11.5, padding: '3px 12px', opacity: (!input.trim() || loading) ? .35 : 1, fontFamily: 'inherit' }}>
              <i className="codicon codicon-send" style={{ fontSize: 11, marginRight: 4, verticalAlign: 'middle' }} />
              Send
            </button>
          </div>
        </div>
        <div style={{ marginTop: 6, fontSize: 10.5, color: dim, textAlign: 'center' }}>
          Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}

window.ChatSidebar = ChatSidebar;
