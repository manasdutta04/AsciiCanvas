import React, { useState, useCallback, useEffect, useRef } from "react";
import { InfiniteCanvas } from "./InfiniteCanvas";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import {
  Tool,
  Cells,
  TextSession,
  Selection,
  selectionBounds,
  cellsToAscii,
  parseKey,
  DEFAULT_COLOR,
} from "./types";
import { drawText } from "./drawing";

const MAX_HISTORY = 100;
const CHAR_W = 10,
  CHAR_H = 20;

export function AsciiEditor() {
  const [cells, setCells] = useState<Cells>(() => new Map());
  const [history, setHistory] = useState<Cells[]>([new Map()]);
  const histIdxRef = useRef(0);
  const [histIdx, setHistIdxState] = useState(0);

  const [previewCells, setPreviewCells] = useState<Cells | null>(null);
  const [tool, setTool] = useState<Tool>("rect_single");
  const [zoom, setZoom] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [textSession, setTextSession] = useState<TextSession | null>(null);
  const [selection, setSelection] = useState<Selection | null>(null);
  const [fillChar, setFillChar] = useState("#");
  const [color, setColor] = useState(DEFAULT_COLOR);
  const [cursorCol, setCursorCol] = useState(0);
  const [cursorRow, setCursorRow] = useState(0);
  const [copied, setCopied] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const copiedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const w = window.innerWidth - 48;
    const h = window.innerHeight - 68;
    setPanX(Math.round(w / 2));
    setPanY(Math.round(h / 2));
  }, []);

  const setHistIdx = useCallback((i: number) => {
    histIdxRef.current = i;
    setHistIdxState(i);
  }, []);

  const commit = useCallback((newCells: Cells) => {
    const idx = histIdxRef.current;
    setHistory((prev) => {
      const next = prev.slice(0, idx + 1);
      next.push(new Map(newCells));
      if (next.length > MAX_HISTORY) next.shift();
      histIdxRef.current = next.length - 1;
      setHistIdxState(next.length - 1);
      return next;
    });
    setCells(newCells);
  }, []);

  const undo = useCallback(() => {
    setHistory((hist) => {
      const idx = histIdxRef.current;
      if (idx <= 0) return hist;
      const ni = idx - 1;
      histIdxRef.current = ni;
      setHistIdxState(ni);
      setCells(new Map(hist[ni]));
      return hist;
    });
  }, []);

  const redo = useCallback(() => {
    setHistory((hist) => {
      const idx = histIdxRef.current;
      if (idx >= hist.length - 1) return hist;
      const ni = idx + 1;
      histIdxRef.current = ni;
      setHistIdxState(ni);
      setCells(new Map(hist[ni]));
      return hist;
    });
  }, []);

  const clear = useCallback(() => {
    commit(new Map());
    setSelection(null);
  }, [commit]);

  const getAscii = useCallback(() => {
    let c = cells;
    if (textSession) {
      c = new Map(cells);
      drawText(c, textSession.col, textSession.row, textSession.text);
    }
    return cellsToAscii(c);
  }, [cells, textSession]);

  const copyAscii = useCallback(async () => {
    const ascii = getAscii();
    try {
      await navigator.clipboard.writeText(ascii);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = ascii;
      ta.style.cssText = "position:fixed;opacity:0;top:0;left:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    if (copiedTimer.current) clearTimeout(copiedTimer.current);
    copiedTimer.current = setTimeout(() => setCopied(false), 2000);
  }, [getAscii]);

  const zoomToFit = useCallback(() => {
    if (cells.size === 0) {
      setZoom(1);
      return;
    }
    let minC = Infinity,
      maxC = -Infinity,
      minR = Infinity,
      maxR = -Infinity;
    for (const key of cells.keys()) {
      const { col, row } = parseKey(key);
      if (col < minC) minC = col;
      if (col > maxC) maxC = col;
      if (row < minR) minR = row;
      if (row > maxR) maxR = row;
    }
    const vw = window.innerWidth - 48 - 20;
    const vh = window.innerHeight - 68 - 32 - 20;
    const contentW = (maxC - minC + 1) * CHAR_W;
    const contentH = (maxR - minR + 1) * CHAR_H;
    const z = Math.min(
      5,
      Math.max(0.15, Math.min(vw / contentW, vh / contentH) * 0.9),
    );
    const cw = CHAR_W * z,
      ch = CHAR_H * z;
    setPanX(Math.round(vw / 2 - ((minC + maxC + 1) / 2) * cw));
    setPanY(Math.round(vh / 2 - ((minR + maxR + 1) / 2) * ch));
    setZoom(z);
  }, [cells]);

  const goHome = useCallback(() => {
    const w = window.innerWidth - 48;
    const h = window.innerHeight - 68;
    setPanX(Math.round(w / 2));
    setPanY(Math.round(h / 2));
    setZoom(1);
  }, []);

  const handleZoom = useCallback((z: number) => {
    setZoom(Math.max(0.15, Math.min(5, z)));
  }, []);

  const deleteSelection = useCallback(() => {
    if (!selection) return;
    const { minC, maxC, minR, maxR } = selectionBounds(selection);
    const updated = new Map(cells);
    for (let r = minR; r <= maxR; r++)
      for (let c = minC; c <= maxC; c++) updated.delete(`${c},${r}`);
    commit(updated);
    setSelection(null);
  }, [selection, cells, commit]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.tagName === "SELECT";
      if (inInput) return;

      if ((e.ctrlKey || e.metaKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (
        (e.ctrlKey || e.metaKey) &&
        (e.key === "y" || (e.key === "z" && e.shiftKey))
      ) {
        e.preventDefault();
        redo();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "c" && !textSession) {
        e.preventDefault();
        copyAscii();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "e") {
        e.preventDefault();
        setShowExport((v) => !v);
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "0") {
        e.preventDefault();
        goHome();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "F") {
        e.preventDefault();
        zoomToFit();
        return;
      }
      if (e.key === "Home") {
        e.preventDefault();
        goHome();
        return;
      }
      if (e.key === "Escape") {
        setSelection(null);
        return;
      }
      if (
        (e.key === "Delete" || e.key === "Backspace") &&
        selection &&
        !textSession
      ) {
        e.preventDefault();
        deleteSelection();
        return;
      }

      if (!textSession) {
        const map: Record<string, Tool> = {
          b: "rect_single",
          d: "rect_double",
          o: "rect_rounded",
          u: "rect_heavy",
          l: "line",
          a: "arrow",
          m: "diamond",
          t: "text",
          f: "freehand",
          g: "fill",
          e: "eraser",
        };
        const t = map[e.key.toLowerCase()];
        if (t && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setTool(t);
          setSelection(null);
        }

        if (e.key.toLowerCase() === "v" && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          setTool((prev) => (prev === "hand" ? "select" : "hand"));
          setSelection(null);
        }

        if (e.key === "[") {
          e.preventDefault();
          handleZoom(zoom * 0.85);
        }
        if (e.key === "]") {
          e.preventDefault();
          handleZoom(zoom * 1.18);
        }

        if (e.key === "ArrowLeft") {
          e.preventDefault();
          setPanX((p) => p + 20);
        }
        if (e.key === "ArrowRight") {
          e.preventDefault();
          setPanX((p) => p - 20);
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          setPanY((p) => p + 20);
        }
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setPanY((p) => p - 20);
        }

        if ((e.ctrlKey || e.metaKey) && e.key === "a") {
          e.preventDefault();
          if (cells.size > 0) {
            let minC = Infinity,
              maxC = -Infinity,
              minR = Infinity,
              maxR = -Infinity;
            for (const key of cells.keys()) {
              const { col, row } = parseKey(key);
              if (col < minC) minC = col;
              if (col > maxC) maxC = col;
              if (row < minR) minR = row;
              if (row > maxR) maxR = row;
            }
            setSelection({
              startC: minC,
              startR: minR,
              endC: maxC,
              endR: maxR,
            });
          }
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [
    undo,
    redo,
    copyAscii,
    textSession,
    selection,
    zoom,
    deleteSelection,
    goHome,
    zoomToFit,
    handleZoom,
  ]);

  return (
    <div style={styles.root}>
      <TopBar
        onCopy={copyAscii}
        copied={copied}
        cellCount={cells.size}
        onExport={() => setShowExport(true)}
        onZoomFit={zoomToFit}
        onHome={goHome}
      />
      <div style={styles.body}>
        <Toolbar
          tool={tool}
          onToolChange={(t) => {
            setTool(t);
            setTextSession(null);
            setSelection(null);
          }}
          onUndo={undo}
          onRedo={redo}
          canUndo={histIdx > 0}
          canRedo={histIdx < history.length - 1}
          onClear={clear}
          zoom={zoom}
          onZoomChange={handleZoom}
          fillChar={fillChar}
          onFillCharChange={setFillChar}
          color={color}
          onColorChange={setColor}
        />
        <div style={styles.canvasWrap}>
          <InfiniteCanvas
            tool={tool}
            cells={cells}
            fillChar={fillChar}
            onCommit={commit}
            zoom={zoom}
            onZoomChange={handleZoom}
            panX={panX}
            panY={panY}
            onPanChange={(x, y) => {
              setPanX(x);
              setPanY(y);
            }}
            textSession={textSession}
            onTextSessionChange={setTextSession}
            onCursorPos={(c, r) => {
              setCursorCol(c);
              setCursorRow(r);
            }}
            previewCells={previewCells}
            onPreviewCells={setPreviewCells}
            selection={selection}
            onSelectionChange={setSelection}
            color={color}
          />
          {textSession && (
            <div style={styles.textHint}>
              <span>Type to add text</span>
              <kbd style={styles.kbd}>Enter</kbd>
              <span>commit</span>
              <kbd style={styles.kbd}>Shift+Enter</kbd>
              <span>newline</span>
              <kbd style={styles.kbd}>Esc</kbd>
              <span>cancel</span>
            </div>
          )}
          {tool === "fill" && (
            <div style={styles.textHint}>
              <span>Click any region to flood-fill with</span>
              <code style={{ ...styles.kbd, color: "#a6e3a1" }}>
                {fillChar}
              </code>
              <span>— change char in toolbar</span>
            </div>
          )}
          {tool === "select" && selection && (
            <div style={styles.textHint}>
              <span>Drag inside selection to move</span>
              <kbd style={styles.kbd}>Delete</kbd>
              <span>erase</span>
              <kbd style={styles.kbd}>Esc</kbd>
              <span>deselect</span>
            </div>
          )}
        </div>
      </div>
      <StatusBar
        tool={tool}
        col={cursorCol}
        row={cursorRow}
        zoom={zoom}
        onZoomChange={handleZoom}
        onZoomFit={zoomToFit}
        onHome={goHome}
        cellCount={cells.size}
        canUndo={histIdx > 0}
        canRedo={histIdx < history.length - 1}
        onUndo={undo}
        onRedo={redo}
      />
      {showExport && (
        <ExportModal ascii={getAscii()} onClose={() => setShowExport(false)} />
      )}
    </div>
  );
}

function ExportModal({
  ascii,
  onClose,
}: {
  ascii: string;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(ascii);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = ascii;
      ta.style.cssText = "position:fixed;opacity:0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div style={styles.modalOverlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>Export ASCII</span>
          <button style={styles.modalClose} onClick={onClose}>
            ✕
          </button>
        </div>
        <pre style={styles.modalPre}>{ascii || "(canvas is empty)"}</pre>
        <div style={styles.modalFooter}>
          <button
            style={{
              ...styles.modalBtn,
              background: copied ? "#a6e3a1" : "#89b4fa",
            }}
            onClick={copy}
          >
            {copied ? "✓ Copied!" : "Copy to clipboard"}
          </button>
          <button
            style={{ ...styles.modalBtn, background: "#313244" }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function TopBar({
  onCopy,
  copied,
  cellCount,
  onExport,
  onZoomFit,
  onHome,
}: {
  onCopy: () => void;
  copied: boolean;
  cellCount: number;
  onExport: () => void;
  onZoomFit: () => void;
  onHome: () => void;
}) {
  return (
    <div style={styles.topBar}>
      <div style={styles.brand}>
        <BrandLogo />
        <span style={styles.brandName}>ASCII</span>
        <span style={styles.brandSub}>canvas</span>
      </div>

      <div style={styles.topCenter}>
        {[
          ["V", "Select/Hand"],
          ["B", "Box"],
          ["D", "Double"],
          ["O", "Rounded"],
          ["U", "Heavy"],
          ["L", "Line"],
          ["A", "Arrow"],
          ["M", "Diamond"],
          ["T", "Text"],
          ["F", "Freehand"],
          ["G", "Fill"],
          ["E", "Eraser"],
        ].map(([k, d]) => (
          <ShortcutPill key={k} label={k} desc={d} />
        ))}
      </div>

      <div
        style={{ display: "flex", gap: 6, alignItems: "center", flexShrink: 0 }}
      >
        <button
          onClick={onHome}
          style={styles.iconBtn}
          title="Reset view (Home / Ctrl+0)"
        >
          ⌂
        </button>
        <button
          onClick={onZoomFit}
          style={styles.iconBtn}
          title="Zoom to fit (Ctrl+Shift+F)"
        >
          ⊡
        </button>
        <button
          onClick={onExport}
          style={styles.iconBtn}
          title="Export / preview (Ctrl+E)"
        >
          ⊞
        </button>
        <button
          onClick={onCopy}
          style={{
            ...styles.copyBtn,
            background: copied ? "#a6e3a1" : "#89b4fa",
          }}
        >
          {copied ? (
            <>
              <CheckIcon />
              Copied!
            </>
          ) : (
            <>
              <CopyIcon />
              Copy ASCII
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function ShortcutPill({ label, desc }: { label: string; desc: string }) {
  return (
    <div style={styles.pill}>
      <span style={styles.pillKey}>{label}</span>
      <span style={styles.pillDesc}>{desc}</span>
    </div>
  );
}

function BrandLogo() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        stroke="#89b4fa"
        strokeWidth="1.5"
      />
      <path
        d="M6 7H14M6 10H11M6 13H13"
        stroke="#89b4fa"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CopyIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ marginRight: 5 }}
    >
      <rect
        x="3.5"
        y="3.5"
        width="7"
        height="7"
        rx="1.2"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <path
        d="M8 3.5V2C8 1.45 7.55 1 7 1H2C1.45 1 1 1.45 1 2V7C1 7.55 1.45 8 2 8H3.5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      style={{ marginRight: 5 }}
    >
      <path
        d="M2 6.5L5 9.5L10 3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    height: "100vh",
    background: "#0d0d18",
    overflow: "hidden",
    fontFamily: "'Inter','Segoe UI',system-ui,sans-serif",
  },
  topBar: {
    height: 42,
    background: "#0d0d18",
    borderBottom: "1px solid #1a1a28",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 10,
    flexShrink: 0,
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  brand: { display: "flex", alignItems: "center", gap: 7, flexShrink: 0 },
  brandName: {
    color: "#cdd6f4",
    fontWeight: 700,
    fontSize: 13,
    letterSpacing: 2,
  },
  brandSub: { color: "#313244", fontSize: 11 },
  topCenter: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 3,
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  pill: {
    display: "flex",
    alignItems: "center",
    gap: 3,
    background: "#12121e",
    border: "1px solid #1e1e2e",
    borderRadius: 5,
    padding: "2px 5px",
  },
  pillKey: {
    color: "#6c7086",
    fontFamily: "'Fira Code','Courier New',monospace",
    fontSize: 9,
    fontWeight: 700,
    background: "#1a1a2e",
    borderRadius: 3,
    padding: "0 3px",
  },
  pillDesc: { color: "#45475a", fontSize: 9 },
  iconBtn: {
    background: "transparent",
    border: "1px solid #252540",
    borderRadius: 6,
    color: "#585b70",
    fontSize: 14,
    cursor: "pointer",
    padding: "3px 8px",
    lineHeight: 1,
    transition: "color 0.1s, border-color 0.1s",
  },
  copyBtn: {
    display: "flex",
    alignItems: "center",
    padding: "5px 12px",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    color: "#1e1e2e",
    transition: "background 0.15s",
    letterSpacing: 0.2,
    flexShrink: 0,
  },
  body: { display: "flex", flex: 1, overflow: "hidden" },
  canvasWrap: { flex: 1, overflow: "hidden", position: "relative" },
  textHint: {
    position: "absolute",
    bottom: 12,
    left: "50%",
    transform: "translateX(-50%)",
    background: "rgba(13,13,24,0.92)",
    border: "1px solid #252540",
    borderRadius: 8,
    padding: "6px 14px",
    display: "flex",
    alignItems: "center",
    gap: 6,
    color: "#45475a",
    fontSize: 11,
    backdropFilter: "blur(8px)",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  kbd: {
    background: "#1a1a2e",
    border: "1px solid #313244",
    borderRadius: 4,
    padding: "1px 5px",
    fontSize: 10,
    color: "#89b4fa",
    fontFamily: "'Fira Code',monospace",
  },
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,0.65)",
    backdropFilter: "blur(4px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#12121e",
    border: "1px solid #252540",
    borderRadius: 12,
    width: "min(700px, 90vw)",
    maxHeight: "80vh",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 24px 80px rgba(0,0,0,0.6)",
  },
  modalHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderBottom: "1px solid #1e1e2e",
  },
  modalTitle: { color: "#cdd6f4", fontWeight: 600, fontSize: 14 },
  modalClose: {
    background: "none",
    border: "none",
    color: "#585b70",
    cursor: "pointer",
    fontSize: 16,
    padding: "2px 6px",
  },
  modalPre: {
    flex: 1,
    overflowY: "auto",
    overflowX: "auto",
    margin: 0,
    padding: "16px 18px",
    fontFamily:
      "'Cascadia Code','Fira Code','Consolas','Courier New',monospace",
    fontSize: 13,
    lineHeight: 1.5,
    color: "#cdd6f4",
    whiteSpace: "pre",
    background: "#0d0d18",
  },
  modalFooter: {
    display: "flex",
    gap: 8,
    justifyContent: "flex-end",
    padding: "12px 18px",
    borderTop: "1px solid #1e1e2e",
  },
  modalBtn: {
    padding: "7px 16px",
    border: "none",
    borderRadius: 7,
    fontSize: 12,
    fontWeight: 600,
    cursor: "pointer",
    color: "#1e1e2e",
    transition: "background 0.15s",
  },
};
