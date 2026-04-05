import React from "react";
import { Tool } from "./types";

const TOOL_LABELS: Record<Tool, string> = {
  select: "Select",
  hand: "Hand",
  rect_single: "Box · Single",
  rect_double: "Box · Double",
  rect_rounded: "Box · Rounded",
  rect_heavy: "Box · Heavy",
  line: "Line",
  arrow: "Arrow",
  diamond: "Diamond",
  text: "Text",
  freehand: "Freehand",
  fill: "Fill",
  eraser: "Eraser",
};

const HINTS: Partial<Record<Tool, string>> = {
  select: "Drag to select · Drag selection to move · Del to erase",
  hand: "Click and drag to pan the canvas",
  text: "Click to place · Type · Enter to commit · Shift+Enter newline",
  fill: "Click to flood-fill enclosed region",
  eraser: "Drag to erase · Right-click for single cell",
  freehand: "Drag to draw freehand",
};

interface Props {
  tool: Tool;
  col: number;
  row: number;
  zoom: number;
  onZoomChange: (z: number) => void;
  onZoomFit: () => void;
  onHome: () => void;
  cellCount: number;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function StatusBar({
  tool,
  col,
  row,
  zoom,
  onZoomChange,
  onZoomFit,
  onHome,
  cellCount,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: Props) {
  const pct = Math.round(zoom * 100);
  return (
    <div style={styles.bar}>
      <div style={styles.left}>
        <span style={styles.toolLabel}>{TOOL_LABELS[tool]}</span>
        <span style={styles.sep}>·</span>
        <span style={styles.dim}>col</span>
        <span style={styles.val}>{col}</span>
        <span style={styles.dim}>row</span>
        <span style={styles.val}>{row}</span>
        {cellCount > 0 && (
          <>
            <span style={styles.sep}>·</span>
            <span style={styles.dim}>{cellCount} chars</span>
          </>
        )}
      </div>

      <div style={styles.mid}>
        {HINTS[tool] ? (
          <span style={styles.hint}>{HINTS[tool]}</span>
        ) : (
          <>
            <span style={styles.hint}>Space+drag to pan</span>
            <span style={styles.sep}>·</span>
            <span style={styles.hint}>Ctrl+scroll to zoom</span>
            <span style={styles.sep}>·</span>
            <span style={styles.hint}>[ ] to zoom</span>
            <span style={styles.sep}>·</span>
            <span style={styles.hint}>Ctrl+E to export</span>
          </>
        )}
      </div>

      <div style={styles.right}>
        <button
          onClick={onUndo}
          disabled={!canUndo}
          style={{ ...styles.iconBtn, color: canUndo ? "#585b70" : "#2a2a38" }}
          title="Undo (Ctrl+Z)"
        >
          ⟲
        </button>
        <button
          onClick={onRedo}
          disabled={!canRedo}
          style={{ ...styles.iconBtn, color: canRedo ? "#585b70" : "#2a2a38" }}
          title="Redo (Ctrl+Y)"
        >
          ⟳
        </button>
        <span style={styles.sep}>·</span>
        <div style={styles.zoomRow}>
          <ZoomBtn
            label="−"
            onClick={() => onZoomChange(Math.max(0.15, zoom * 0.85))}
          />
          <button
            style={styles.zoomPct}
            onClick={onHome}
            title="Reset view (Home)"
          >
            {pct}%
          </button>
          <ZoomBtn
            label="+"
            onClick={() => onZoomChange(Math.min(5, zoom * 1.18))}
          />
        </div>
        <button
          onClick={onZoomFit}
          style={styles.fitBtn}
          title="Zoom to fit (Ctrl+Shift+F)"
        >
          fit
        </button>
      </div>
    </div>
  );
}

function ZoomBtn({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button onClick={onClick} style={styles.zoomBtn}>
      {label}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bar: {
    height: 28,
    background: "#0d0d18",
    borderTop: "1px solid #1e1e2e",
    display: "flex",
    alignItems: "center",
    padding: "0 12px",
    gap: 0,
    flexShrink: 0,
    fontSize: 11,
    userSelect: "none",
    WebkitUserSelect: "none",
  },
  left: { display: "flex", alignItems: "center", gap: 5, minWidth: 200 },
  mid: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    overflow: "hidden",
  },
  right: {
    display: "flex",
    alignItems: "center",
    gap: 4,
    minWidth: 180,
    justifyContent: "flex-end",
  },
  toolLabel: {
    color: "#89b4fa",
    fontWeight: 700,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontSize: 10,
  },
  sep: { color: "#2a2a3a" },
  dim: { color: "#45475a" },
  val: { color: "#a6adc8", fontVariantNumeric: "tabular-nums" },
  hint: { color: "#2e2e42", fontSize: 10, whiteSpace: "nowrap" },
  iconBtn: {
    background: "none",
    border: "none",
    fontSize: 14,
    cursor: "pointer",
    padding: "0 3px",
    lineHeight: 1,
    transition: "color 0.1s",
  },
  zoomRow: {
    display: "flex",
    alignItems: "center",
    gap: 1,
    background: "#1a1a28",
    borderRadius: 5,
    padding: "1px 3px",
    border: "1px solid #252535",
  },
  zoomBtn: {
    background: "none",
    border: "none",
    color: "#45475a",
    fontSize: 13,
    cursor: "pointer",
    padding: "0 3px",
    lineHeight: 1,
  },
  zoomPct: {
    background: "none",
    border: "none",
    color: "#7f849c",
    fontSize: 10,
    cursor: "pointer",
    padding: "0 2px",
    fontVariantNumeric: "tabular-nums",
    minWidth: 36,
    textAlign: "center",
  },
  fitBtn: {
    background: "none",
    border: "1px solid #252535",
    borderRadius: 4,
    color: "#45475a",
    fontSize: 10,
    cursor: "pointer",
    padding: "1px 6px",
    letterSpacing: 0.3,
  },
};
