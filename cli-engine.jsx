// cli-engine.jsx — the working terminal: input, history, autocomplete, output stream.
// Output stream is an array of React nodes appended in order.
// Commands live in cli-commands.jsx and are looked up by name.

const CliCtx = React.createContext(null);

// Tiny helper: simulate slight typing latency for command chips so the user
// sees the command appear before its output. Set to 0 for instant.
const CHIP_TYPE_DELAY = 28; // ms per char

function useCli({ theme, setMode, setTheme }) {
  const [history, setHistory] = React.useState([]);   // entered command strings
  const [stream, setStream]   = React.useState([]);   // [{kind, node, key}]
  const [input, setInput]     = React.useState('');
  const [hIdx, setHIdx]       = React.useState(-1);   // -1 = current input
  const [draft, setDraft]     = React.useState('');   // input before history-recall
  const keyRef = React.useRef(0);
  const nextKey = () => ++keyRef.current;

  const append = React.useCallback((node, kind = 'output') => {
    setStream((s) => [...s, { kind, node, key: nextKey() }]);
  }, []);

  const clear = React.useCallback(() => setStream([]), []);

  const ctx = React.useMemo(() => ({
    append, clear, theme, setMode, setTheme,
    setInput, // commands can pre-fill input ("type for me")
  }), [append, clear, theme, setMode, setTheme]);

  // Run a command line — split args, dispatch, append output.
  const run = React.useCallback((line) => {
    const cmd = (line || '').trim();
    // Echo prompt + the typed line
    setStream((s) => [...s, {
      kind: 'echo', key: nextKey(),
      node: <PromptLine line={cmd} theme={theme} />,
    }]);
    if (!cmd) return;
    setHistory((h) => (h[h.length - 1] === cmd ? h : [...h, cmd]));
    setHIdx(-1); setDraft('');

    const [name, ...args] = cmd.split(/\s+/);
    const lookup = (window.CLI_COMMANDS || {});
    // Allow "sudo X" as a special case so it dispatches to X with sudo flag.
    let target = lookup[name?.toLowerCase()];
    let sudo = false;
    if (name?.toLowerCase() === 'sudo') {
      sudo = true;
      target = lookup[args[0]?.toLowerCase()];
      args.shift();
    }
    if (!target) {
      ctx.append(<Err>{`zsh: command not found: ${name}`}{'\n'}<span style={{opacity:.6}}>type `help` for available commands</span></Err>);
      return;
    }
    try {
      target.exec({ args, ctx, sudo, raw: cmd });
    } catch (e) {
      ctx.append(<Err>{`error: ${e.message}`}</Err>);
    }
  }, [ctx, theme]);

  // Autocomplete — tab cycles through matches.
  const tabIdxRef = React.useRef({ prefix: null, idx: 0 });
  const autocomplete = React.useCallback(() => {
    const cur = input;
    const all = Object.keys(window.CLI_COMMANDS || {});
    const matches = all.filter((c) => c.startsWith(cur.trim()));
    if (matches.length === 0) return;
    if (matches.length === 1) {
      setInput(matches[0] + ' ');
      tabIdxRef.current = { prefix: null, idx: 0 };
      return;
    }
    // multiple: cycle
    if (tabIdxRef.current.prefix !== cur.trim()) {
      tabIdxRef.current = { prefix: cur.trim(), idx: 0 };
    }
    setInput(matches[tabIdxRef.current.idx]);
    tabIdxRef.current.idx = (tabIdxRef.current.idx + 1) % matches.length;
  }, [input]);

  // History keys.
  const onKeyDown = React.useCallback((e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      run(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      autocomplete();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const ni = hIdx === -1 ? history.length - 1 : Math.max(0, hIdx - 1);
      if (hIdx === -1) setDraft(input);
      setHIdx(ni);
      setInput(history[ni]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (hIdx === -1) return;
      const ni = hIdx + 1;
      if (ni >= history.length) {
        setHIdx(-1); setInput(draft);
      } else {
        setHIdx(ni); setInput(history[ni]);
      }
    } else if (e.key === 'l' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      clear();
    }
  }, [input, run, autocomplete, history, hIdx, draft, clear]);

  // Type a command into the input, then run it — for clickable chips.
  const typeAndRun = React.useCallback(async (cmd) => {
    setInput('');
    for (let i = 1; i <= cmd.length; i++) {
      setInput(cmd.slice(0, i));
      await new Promise((r) => setTimeout(r, CHIP_TYPE_DELAY));
    }
    await new Promise((r) => setTimeout(r, 120));
    run(cmd);
    setInput('');
  }, [run]);

  return { stream, input, setInput, onKeyDown, run, typeAndRun, ctx, history, clear };
}

// ────────────────────────────────────────────────────────────────────────────
// Renderers used by both the engine and the commands.

function PromptLine({ line, theme }) {
  return (
    <div className="cli-line cli-mono" style={{ color: theme.fg }}>
      <span style={{ color: theme.acc, fontWeight: 600 }}>vinod@dev</span>
      <span style={{ color: theme.dim }}>:</span>
      <span style={{ color: theme.path }}>~</span>
      <span style={{ color: theme.dim }}>$</span>{' '}
      <span>{line}</span>
    </div>
  );
}

function Err({ children }) {
  return <div className="cli-line cli-mono" style={{ color: '#ff6a5e', whiteSpace: 'pre-wrap' }}>{children}</div>;
}

// Click-to-run command chip used inside output blocks.
function CliChip({ cmd, children, style = {} }) {
  const cli = React.useContext(CliCtx);
  return (
    <button onClick={() => cli && cli.typeAndRun(cmd)}
            className="cli-chip cli-mono"
            style={style}>
      {children || cmd}
    </button>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// CliTerminal — view component. Receives the engine state via props.

function CliTerminal({
  cli,                        // from useCli
  theme, density, crt,
  bootLines,                  // optional initial render lines (run once)
  hideChrome = false,         // when embedded in IDE terminal panel
  onFocusChange,
}) {
  const wrapRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const [focused, setFocused] = React.useState(true);

  // Auto-scroll to bottom whenever stream grows.
  React.useEffect(() => {
    const el = wrapRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [cli.stream, cli.input]);

  // Focus the (hidden) input on any click in the terminal area.
  const focus = () => inputRef.current && inputRef.current.focus();
  React.useEffect(() => { focus(); }, []);

  const [vw] = React.useState(() => window.innerWidth);
  React.useEffect(() => {
    const onResize = () => {
      // trigger re-render via state update
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);
  const isMobile = window.innerWidth < 640;
  const isSmall = window.innerWidth < 768;
  const pad = density === 'compact' ? (isMobile ? 10 : 14) : density === 'comfy' ? (isMobile ? 16 : 28) : (isMobile ? 12 : 20);
  const fontSize = isMobile ? 12 : isSmall ? 12.5 : 13.5;

  return (
    <CliCtx.Provider value={cli}>
      <div
        onClick={focus}
        onTouchStart={focus}
        className={crt ? 'wf-crt cli-root' : 'cli-root'}
        style={{
          position: 'relative', width: '100%', height: '100%',
          background: theme.bg, color: theme.fg,
          fontFamily: "'JetBrains Mono','IBM Plex Mono',ui-monospace,Menlo,monospace",
          fontSize, lineHeight: 1.55,
          overflow: 'hidden',
          overscrollBehavior: 'contain',
        }}>
        <div ref={wrapRef}
             className="ide-scroll"
             style={{
               position: 'absolute', inset: 0,
               padding: pad, paddingTop: pad - 4,
               overflowY: 'auto', overflowX: 'auto',
               scrollBehavior: 'smooth',
               WebkitOverflowScrolling: 'touch',
             }}>
          {/* boot lines (rendered once at top) */}
          {bootLines}

          {/* output stream */}
          {cli.stream.map((entry) => (
            <div key={entry.key} style={{ marginBottom: entry.kind === 'echo' ? 2 : 8 }}>
              {entry.node}
            </div>
          ))}

          {/* active prompt */}
          <div className="cli-line cli-mono" style={{ display: 'flex', alignItems: 'baseline', flexWrap: 'wrap' }}>
            <span style={{ color: theme.acc, fontWeight: 600 }}>vinod@dev</span>
            <span style={{ color: theme.dim }}>:</span>
            <span style={{ color: theme.path }}>~</span>
            <span style={{ color: theme.dim }}>$</span>
            <span style={{ marginLeft: 8, color: theme.fg, whiteSpace: 'pre' }}>
              {cli.input}
              <span className="cli-cursor" style={{
                background: focused ? theme.fg : 'transparent',
                outline: focused ? 'none' : `1px solid ${theme.fg}`,
              }} />
            </span>
          </div>
        </div>

        {/* invisible real input — captures keys, never shown */}
        <input
          ref={inputRef}
          value={cli.input}
          onChange={(e) => cli.setInput(e.target.value)}
          onKeyDown={cli.onKeyDown}
          onFocus={() => { setFocused(true); onFocusChange && onFocusChange(true); }}
          onBlur={() => { setFocused(false); onFocusChange && onFocusChange(false); }}
          spellCheck={false} autoCapitalize="off" autoComplete="off" autoCorrect="off"
          aria-label="terminal input"
          inputMode="text"
          style={{
            position: 'fixed', left: 0, bottom: 0,
            width: 1, height: 1, opacity: 0,
            border: 0, padding: 0, background: 'transparent',
            pointerEvents: 'none',
          }} />
      </div>
    </CliCtx.Provider>
  );
}

Object.assign(window, {
  CliCtx, useCli, CliTerminal, PromptLine, Err, CliChip,
});
