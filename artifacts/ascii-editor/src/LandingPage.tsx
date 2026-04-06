import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div style={styles.container}>
      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navHash}>#</span>
          <span style={styles.navName}>ASCII Canvas</span>
        </div>
        <div style={styles.navLinks}>
          <a
            href="https://github.com/manasdutta04/AsciiCanvas"
            target="_blank"
            rel="noopener"
            style={styles.navLink}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
          </a>
          <Link href="/draw">
            <button style={styles.navBtn}>Open Editor</button>
          </Link>
        </div>
      </nav>

      <main style={styles.main}>
        <div style={styles.hero}>
          <div style={styles.badge}>
            <span style={styles.badgeDot}></span>
            Open Source
          </div>

          <h1 style={styles.title}>
            Create Stunning <span style={styles.highlight}>ASCII Art</span>
            <br />
            <span style={styles.highlightSub}>In Your Browser</span>
          </h1>

          <p style={styles.subtitle}>
            A powerful, intuitive drawing tool for creating beautiful ASCII art.
            Draw shapes, text, freehand, flood fills, and export instantly.
          </p>

          <div style={styles.ctas}>
            <Link href="/draw">
              <button style={styles.primaryBtn}>
                Start Drawing Free
                <span style={styles.btnArrow}>→</span>
              </button>
            </Link>
            <a
              href="https://github.com/manasdutta04/AsciiCanvas"
              target="_blank"
              rel="noopener"
              style={styles.secondaryBtn}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
              Star on GitHub
            </a>
          </div>
        </div>

        <div style={styles.canvasPreview}>
          <div style={styles.previewHeader}>
            <div style={styles.previewDots}>
              <span style={{ ...styles.dot, background: "#ff5f57" }}></span>
              <span style={{ ...styles.dot, background: "#febc2e" }}></span>
              <span style={{ ...styles.dot, background: "#28c840" }}></span>
            </div>
            <span style={styles.previewTitle}>ASCII Canvas</span>
          </div>
          <pre style={styles.asciiArt}>
            {`
    ┌─────────────────────────────┐
    │  #    ASCII Canvas           │
    │  ─────────────────────────   │
    │      ╭───────╮               │
    │     ╱  •••••  ╲              │
    │    │  •     •  │             │
    │    │   ╰─╯    │             │
    │     ╲  ╭──╮  ╱              │
    │      ╰───────╯               │
    │                             │
    │  ──── Tools ────            │
    │  [V] Select  [B] Box       │
    │  [T] Text    [F] Freehand   │
    │  [G] Fill    [E] Eraser     │
    └─────────────────────────────┘
`}
          </pre>
        </div>

        <div style={styles.features}>
          <h2 style={styles.sectionTitle}>Everything You Need</h2>
          <div style={styles.featureGrid}>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>01</div>
              <h3 style={styles.featureTitle}>Shape Tools</h3>
              <p style={styles.featureDesc}>
                Box, line, arrow, diamond, and more with multiple border styles
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>02</div>
              <h3 style={styles.featureTitle}>Text Tool</h3>
              <p style={styles.featureDesc}>
                Add text anywhere with Enter to commit, Shift+Enter for newlines
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>03</div>
              <h3 style={styles.featureTitle}>Freehand</h3>
              <p style={styles.featureDesc}>
                Draw smooth freehand paths with smart line rendering
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>04</div>
              <h3 style={styles.featureTitle}>Flood Fill</h3>
              <p style={styles.featureDesc}>
                Fill any enclosed region instantly with custom characters
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>05</div>
              <h3 style={styles.featureTitle}>Color Palette</h3>
              <p style={styles.featureDesc}>
                12 beautiful colors to make your ASCII art stand out
              </p>
            </div>
            <div style={styles.featureCard}>
              <div style={styles.featureNum}>06</div>
              <h3 style={styles.featureTitle}>One-Click Export</h3>
              <p style={styles.featureDesc}>
                Copy your masterpiece to clipboard in a single click
              </p>
            </div>
          </div>
        </div>

        <div style={styles.keybinds}>
          <h2 style={styles.sectionTitle}>Keyboard Shortcuts</h2>
          <p style={styles.keybindSubtitle}>Work faster with these shortcuts</p>
          <div style={styles.keybindGrid}>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>V</kbd>
                <span style={styles.keybindOr}>or</span>
                <kbd style={styles.kbd}>Space</kbd>
              </div>
              <span style={styles.keybindLabel}>Select / Hand</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>B</kbd>
              </div>
              <span style={styles.keybindLabel}>Box</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>D</kbd>
              </div>
              <span style={styles.keybindLabel}>Double Box</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>O</kbd>
              </div>
              <span style={styles.keybindLabel}>Rounded</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>U</kbd>
              </div>
              <span style={styles.keybindLabel}>Heavy Box</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>L</kbd>
              </div>
              <span style={styles.keybindLabel}>Line</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>A</kbd>
              </div>
              <span style={styles.keybindLabel}>Arrow</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>M</kbd>
              </div>
              <span style={styles.keybindLabel}>Diamond</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>T</kbd>
              </div>
              <span style={styles.keybindLabel}>Text</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>F</kbd>
              </div>
              <span style={styles.keybindLabel}>Freehand</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>G</kbd>
              </div>
              <span style={styles.keybindLabel}>Fill</span>
            </div>
            <div style={styles.keybindItem}>
              <div style={styles.keybindKeys}>
                <kbd style={styles.kbd}>E</kbd>
              </div>
              <span style={styles.keybindLabel}>Eraser</span>
            </div>
          </div>
          <div style={styles.moreShortcuts}>
            <span>
              <kbd style={styles.kbd}>Ctrl+Z</kbd> Undo
            </span>
            <span>
              <kbd style={styles.kbd}>Ctrl+Y</kbd> Redo
            </span>
            <span>
              <kbd style={styles.kbd}>Ctrl+A</kbd> Select All
            </span>
            <span>
              <kbd style={styles.kbd}>Ctrl+E</kbd> Export
            </span>
            <span>
              <kbd style={styles.kbd}>Arrow Keys</kbd> Pan
            </span>
            <span>
              <kbd style={styles.kbd}>[ ]</kbd> Zoom
            </span>
          </div>
        </div>

        <div style={styles.cta}>
          <h2 style={styles.ctaTitle}>Ready to Create?</h2>
          <p style={styles.ctaText}>
            Start drawing beautiful ASCII art in seconds. No signup required.
          </p>
          <Link href="/draw">
            <button style={styles.ctaBtn}>
              Open Editor Free
              <span style={styles.btnArrow}>→</span>
            </button>
          </Link>
        </div>
      </main>

      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerLogo}>
            <span style={styles.footerHash}>#</span>
            <span style={styles.footerName}>ASCII Canvas</span>
          </div>
          <div style={styles.footerLinks}>
            <a
              href="https://github.com/manasdutta04/AsciiCanvas"
              target="_blank"
              rel="noopener"
              style={styles.footerLink}
            >
              GitHub
            </a>
            <span style={styles.footerSep}>•</span>
            <span style={styles.footerText}>Built with React + Vite</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    background: "#0d0d18",
    color: "#cdd6f4",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
    overflowX: "hidden",
  },
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 40px",
    maxWidth: "1200px",
    margin: "0 auto",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  navHash: {
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    fontSize: "32px",
    fontWeight: 700,
    color: "#89b4fa",
  },
  navName: {
    fontSize: "20px",
    fontWeight: 600,
    color: "#cdd6f4",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
  },
  navLink: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    background: "rgba(255,255,255,0.05)",
    color: "#7f849c",
    transition: "all 0.2s",
    textDecoration: "none",
  },
  navBtn: {
    padding: "12px 24px",
    background: "linear-gradient(135deg, #89b4fa 0%, #74c7ec 100%)",
    border: "none",
    color: "#0d0d18",
    borderRadius: "10px",
    fontSize: "14px",
    fontWeight: 600,
    cursor: "pointer",
    transition: "all 0.2s",
  },
  main: {
    minHeight: "calc(100vh - 160px)",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "0 20px",
  },
  hero: {
    textAlign: "center",
    padding: "80px 0 60px",
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 20px",
    background: "rgba(137,180,250,0.08)",
    border: "1px solid rgba(137,180,250,0.2)",
    borderRadius: "30px",
    fontSize: "14px",
    color: "#89b4fa",
    marginBottom: "32px",
    fontWeight: 500,
  },
  badgeDot: {
    width: "8px",
    height: "8px",
    background: "#89b4fa",
    borderRadius: "50%",
    boxShadow: "0 0 10px #89b4fa",
  },
  title: {
    fontSize: "56px",
    fontWeight: 700,
    lineHeight: 1.1,
    margin: 0,
    letterSpacing: "-2px",
  },
  highlight: {
    background: "linear-gradient(135deg, #89b4fa 0%, #cba6f7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  highlightSub: {
    background: "linear-gradient(135deg, #89b4fa 0%, #74c7ec 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  },
  subtitle: {
    fontSize: "20px",
    color: "#7f849c",
    marginTop: "24px",
    maxWidth: "600px",
    margin: "24px auto 0",
    lineHeight: 1.7,
  },
  ctas: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    marginTop: "48px",
    flexWrap: "wrap",
  },
  primaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "18px 36px",
    fontSize: "16px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #89b4fa 0%, #74c7ec 100%)",
    color: "#0d0d18",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 8px 32px rgba(137,180,250,0.35)",
    transition: "all 0.2s",
  },
  btnArrow: {
    fontSize: "20px",
  },
  secondaryBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "18px 28px",
    fontSize: "16px",
    fontWeight: 500,
    background: "rgba(255,255,255,0.05)",
    color: "#cdd6f4",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "14px",
    textDecoration: "none",
    transition: "all 0.2s",
  },
  canvasPreview: {
    margin: "80px auto",
    background: "#1a1a2e",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.1)",
    overflow: "hidden",
    maxWidth: "520px",
    boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
  },
  previewHeader: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 20px",
    background: "#16162a",
    borderBottom: "1px solid rgba(255,255,255,0.05)",
  },
  previewDots: {
    display: "flex",
    gap: "8px",
  },
  dot: {
    width: "12px",
    height: "12px",
    borderRadius: "50%",
  },
  previewTitle: {
    fontSize: "13px",
    color: "#6c7086",
  },
  asciiArt: {
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    fontSize: "11px",
    lineHeight: 1.5,
    color: "#89b4fa",
    margin: 0,
    padding: "24px",
    textAlign: "left",
  },
  features: {
    padding: "60px 0",
  },
  sectionTitle: {
    fontSize: "36px",
    fontWeight: 700,
    textAlign: "center",
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  featureGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "24px",
  },
  featureCard: {
    padding: "32px",
    background:
      "linear-gradient(180deg, rgba(30,30,46,0.5) 0%, rgba(26,26,46,0.5) 100%)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
    transition: "all 0.3s",
  },
  featureNum: {
    fontSize: "14px",
    fontWeight: 700,
    color: "#89b4fa",
    marginBottom: "16px",
    fontFamily: "'Cascadia Code','Fira Code',monospace",
  },
  featureTitle: {
    fontSize: "20px",
    fontWeight: 600,
    marginBottom: "12px",
    color: "#cdd6f4",
  },
  featureDesc: {
    fontSize: "15px",
    color: "#7f849c",
    lineHeight: 1.6,
  },
  keybinds: {
    padding: "60px 0",
    textAlign: "center",
  },
  keybindSubtitle: {
    fontSize: "16px",
    color: "#6c7086",
    marginBottom: "32px",
  },
  keybindGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
    gap: "16px",
    padding: "32px",
    background: "rgba(26,26,46,0.5)",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.05)",
    maxWidth: "800px",
    margin: "0 auto",
  },
  keybindItem: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  keybindKeys: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  keybindOr: {
    fontSize: "11px",
    color: "#45475a",
  },
  keybindLabel: {
    fontSize: "13px",
    color: "#7f849c",
  },
  kbd: {
    display: "inline-block",
    padding: "6px 10px",
    background: "#0d0d18",
    border: "1px solid #313244",
    borderRadius: "8px",
    fontSize: "12px",
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    color: "#89b4fa",
  },
  moreShortcuts: {
    display: "flex",
    gap: "24px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginTop: "24px",
    color: "#6c7086",
    fontSize: "14px",
  },
  cta: {
    textAlign: "center",
    padding: "80px 0",
  },
  ctaTitle: {
    fontSize: "40px",
    fontWeight: 700,
    marginBottom: "16px",
    letterSpacing: "-1px",
  },
  ctaText: {
    fontSize: "18px",
    color: "#7f849c",
    marginBottom: "32px",
  },
  ctaBtn: {
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    padding: "18px 48px",
    fontSize: "18px",
    fontWeight: 600,
    background: "linear-gradient(135deg, #89b4fa 0%, #74c7ec 100%)",
    color: "#0d0d18",
    border: "none",
    borderRadius: "14px",
    cursor: "pointer",
    boxShadow: "0 8px 32px rgba(137,180,250,0.35)",
    transition: "all 0.2s",
  },
  footer: {
    borderTop: "1px solid rgba(255,255,255,0.05)",
    padding: "32px 40px",
    marginTop: "40px",
  },
  footerContent: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  footerLogo: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  footerHash: {
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    fontSize: "20px",
    fontWeight: 700,
    color: "#89b4fa",
  },
  footerName: {
    fontSize: "14px",
    fontWeight: 500,
    color: "#6c7086",
  },
  footerLinks: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  footerLink: {
    fontSize: "14px",
    color: "#6c7086",
    textDecoration: "none",
    transition: "color 0.2s",
  },
  footerSep: {
    color: "#313244",
  },
  footerText: {
    fontSize: "14px",
    color: "#45475a",
  },
};
