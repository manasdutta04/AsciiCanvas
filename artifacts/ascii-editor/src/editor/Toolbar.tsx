import React, { useState } from "react";
import { Tool } from "./types";

interface ToolDef {
  id: Tool;
  label: string;
  key: string;
  group: string;
  icon: React.ReactNode;
}

const TOOLS: ToolDef[] = [
  {
    id: "select",
    label: "Select",
    key: "V",
    group: "nav",
    icon: <SelectIcon />,
  },
  { id: "hand", label: "Hand", key: "V", group: "nav", icon: <HandIcon /> },
  {
    id: "rect_single",
    label: "Box · Single",
    key: "B",
    group: "rect",
    icon: <RectIcon type="single" />,
  },
  {
    id: "rect_double",
    label: "Box · Double",
    key: "D",
    group: "rect",
    icon: <RectIcon type="double" />,
  },
  {
    id: "rect_rounded",
    label: "Box · Rounded",
    key: "O",
    group: "rect",
    icon: <RectIcon type="rounded" />,
  },
  {
    id: "rect_heavy",
    label: "Box · Heavy",
    key: "U",
    group: "rect",
    icon: <RectIcon type="heavy" />,
  },
  { id: "line", label: "Line", key: "L", group: "draw", icon: <LineIcon /> },
  { id: "arrow", label: "Arrow", key: "A", group: "draw", icon: <ArrowIcon /> },
  {
    id: "diamond",
    label: "Diamond",
    key: "M",
    group: "draw",
    icon: <DiamondIcon />,
  },
  { id: "text", label: "Text", key: "T", group: "draw", icon: <TextIcon /> },
  {
    id: "freehand",
    label: "Freehand",
    key: "F",
    group: "draw",
    icon: <FreehandIcon />,
  },
  { id: "fill", label: "Fill", key: "G", group: "util", icon: <FillIcon /> },
  {
    id: "eraser",
    label: "Eraser",
    key: "E",
    group: "util",
    icon: <EraserIcon />,
  },
];

interface Props {
  tool: Tool;
  onToolChange: (t: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onClear: () => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  fillChar: string;
  onFillCharChange: (c: string) => void;
}

export function Toolbar({
  tool,
  onToolChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onClear,
  zoom,
  onZoomChange,
  fillChar,
  onFillCharChange,
}: Props) {
  const [tooltip, setTooltip] = useState<string | null>(null);
  const [editingFill, setEditingFill] = useState(false);

  const groups = ["nav", "rect", "draw", "util"];

  return (
    <div style={styles.toolbar}>
      {groups.map((g, gi) => {
        if (g === "nav") {
          return (
            <React.Fragment key={g}>
              <NavToggleBtn
                tool={tool}
                onToggle={() =>
                  onToolChange(tool === "hand" ? "select" : "hand")
                }
                onHover={setTooltip}
              />
            </React.Fragment>
          );
        }
        const group = TOOLS.filter((t) => t.group === g);
        return (
          <React.Fragment key={g}>
            {gi > 0 && <div style={styles.divider} />}
            {group.map((def) => (
              <ToolBtn
                key={def.id}
                def={def}
                active={tool === def.id}
                onClick={() => onToolChange(def.id)}
                onHover={setTooltip}
              />
            ))}
          </React.Fragment>
        );
      })}

      {tool === "fill" && (
        <>
          <div style={styles.divider} />
          <div style={styles.fillWrap} title="Fill character">
            {editingFill ? (
              <input
                autoFocus
                maxLength={1}
                value={fillChar}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) onFillCharChange(v);
                }}
                onBlur={() => setEditingFill(false)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === "Escape")
                    setEditingFill(false);
                  e.stopPropagation();
                }}
                style={styles.fillInput}
              />
            ) : (
              <button
                onClick={() => setEditingFill(true)}
                style={styles.fillBtn}
                title="Click to change fill character"
              >
                {fillChar}
              </button>
            )}
          </div>
        </>
      )}

      <div style={{ flex: 1 }} />
      <div style={styles.divider} />

      <ActionBtn
        icon={<UndoIcon />}
        label="Undo"
        shortcut="Ctrl+Z"
        disabled={!canUndo}
        onClick={onUndo}
        onHover={setTooltip}
      />
      <ActionBtn
        icon={<RedoIcon />}
        label="Redo"
        shortcut="Ctrl+Y"
        disabled={!canRedo}
        onClick={onRedo}
        onHover={setTooltip}
      />

      <div style={styles.divider} />
      <ActionBtn
        icon={<TrashIcon />}
        label="Clear canvas"
        shortcut=""
        onClick={onClear}
        onHover={setTooltip}
      />

      {tooltip && <div style={styles.tooltip}>{tooltip}</div>}
    </div>
  );
}

function NavToggleBtn({
  tool,
  onToggle,
  onHover,
}: {
  tool: Tool;
  onToggle: () => void;
  onHover: (t: string | null) => void;
}) {
  const isHand = tool === "hand";
  return (
    <button
      onClick={onToggle}
      onMouseEnter={() =>
        onHover(`${isHand ? "Hand" : "Select"}  [V — click to toggle]`)
      }
      onMouseLeave={() => onHover(null)}
      style={{
        ...styles.btn,
        background: "rgba(137,180,250,0.15)",
        border: "1px solid rgba(137,180,250,0.45)",
        color: "#89b4fa",
        position: "relative",
      }}
    >
      {isHand ? <HandIcon /> : <SelectIcon />}
      <span style={styles.navBadge}>V</span>
    </button>
  );
}

function ToolBtn({
  def,
  active,
  onClick,
  onHover,
}: {
  def: ToolDef;
  active: boolean;
  onClick: () => void;
  onHover: (t: string | null) => void;
}) {
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(`${def.label}  [${def.key}]`)}
      onMouseLeave={() => onHover(null)}
      style={{
        ...styles.btn,
        background: active ? "rgba(137,180,250,0.15)" : "transparent",
        border: active
          ? "1px solid rgba(137,180,250,0.45)"
          : "1px solid transparent",
        color: active ? "#89b4fa" : "#7f849c",
        position: "relative",
      }}
    >
      {def.icon}
      <span style={styles.keyBadge}>{def.key}</span>
    </button>
  );
}

function ActionBtn({
  icon,
  label,
  shortcut,
  disabled,
  onClick,
  onHover,
}: {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  disabled?: boolean;
  onClick: () => void;
  onHover: (t: string | null) => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={() => onHover(shortcut ? `${label}  [${shortcut}]` : label)}
      onMouseLeave={() => onHover(null)}
      style={{
        ...styles.btn,
        color: disabled ? "#313244" : "#7f849c",
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {icon}
    </button>
  );
}

const styles: Record<string, React.CSSProperties> = {
  toolbar: {
    width: 48,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "10px 0",
    gap: 2,
    background: "#12121e",
    borderRight: "1px solid #1e1e2e",
    flexShrink: 0,
    position: "relative",
    overflowY: "auto",
    overflowX: "hidden",
  },
  btn: {
    width: 34,
    height: 34,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
    cursor: "pointer",
    transition: "all 0.1s",
    flexShrink: 0,
    outline: "none",
  },
  keyBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    background: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 700,
    color: "#6c7086",
    padding: "0 2px",
    lineHeight: "12px",
    fontFamily: "'Fira Code','Courier New',monospace",
  },
  navBadge: {
    position: "absolute",
    bottom: -2,
    right: -2,
    background: "#1e1e2e",
    border: "1px solid #313244",
    borderRadius: 3,
    fontSize: 7,
    fontWeight: 700,
    color: "#6c7086",
    padding: "0 2px",
    lineHeight: "12px",
    fontFamily: "'Fira Code','Courier New',monospace",
  },
  divider: {
    width: 24,
    height: 1,
    background: "#1e1e30",
    margin: "4px 0",
    flexShrink: 0,
  },
  fillWrap: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: 34,
  },
  fillBtn: {
    width: 28,
    height: 28,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(166,227,161,0.12)",
    border: "1px solid rgba(166,227,161,0.35)",
    borderRadius: 6,
    color: "#a6e3a1",
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    fontSize: 14,
    fontWeight: 700,
    cursor: "pointer",
  },
  fillInput: {
    width: 28,
    height: 28,
    textAlign: "center",
    background: "#1a2a1a",
    border: "1px solid #a6e3a1",
    borderRadius: 6,
    color: "#a6e3a1",
    fontFamily: "'Cascadia Code','Fira Code',monospace",
    fontSize: 14,
    fontWeight: 700,
    outline: "none",
  },
  tooltip: {
    position: "absolute",
    left: 52,
    top: "50%",
    transform: "translateY(-50%)",
    background: "#1e1e2e",
    border: "1px solid #313244",
    color: "#cdd6f4",
    padding: "5px 9px",
    borderRadius: 6,
    fontSize: 11,
    whiteSpace: "nowrap",
    pointerEvents: "none",
    zIndex: 100,
    boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
  },
};

function SelectIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 2L13 7.5L8.5 8.5L6.5 13L3 2Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function HandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M6 6V3.5C6 2.67 5.33 2 4.5 2C3.67 2 3 2.67 3 3.5V8L2 9.5V12C2 13.1 2.9 14 4 14H10C11.1 14 12 13.1 12 12V9L9 4.5C8.67 3.83 8 3.5 7.5 3.5C7 3.5 6.5 3.83 6.5 4.5V6"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RectIcon({ type }: { type: string }) {
  const r = type === "rounded" ? 3 : 0;
  const sw = type === "heavy" ? 2 : 1;
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="11"
        height="11"
        rx={r}
        ry={r}
        stroke="currentColor"
        strokeWidth={sw}
        strokeDasharray={type === "double" ? "1.5 1" : undefined}
      />
    </svg>
  );
}
function LineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <line
        x1="3"
        y1="13"
        x2="13"
        y2="3"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
function ArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 13L13 3M13 3H7M13 3V9"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function DiamondIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M8 2L14 8L8 14L2 8Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TextIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <text
        x="4.5"
        y="13"
        fill="currentColor"
        fontFamily="serif"
        fontSize="12"
        fontWeight="bold"
      >
        T
      </text>
    </svg>
  );
}
function FreehandIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 12C4 10 5 7 7 7C9 7 8 11 10 10C12 9 12 6 14 5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
function FillIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3 10L8 3L13 10"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinejoin="round"
      />
      <path
        d="M4 8H12"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <rect
        x="1.5"
        y="11"
        width="9"
        height="3.5"
        rx="1"
        fill="currentColor"
        opacity="0.5"
      />
      <circle cx="13" cy="12.5" r="2" fill="currentColor" opacity="0.7" />
    </svg>
  );
}
function EraserIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M9 3L13 7L7 13H3V9L9 3Z"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <line
        x1="6"
        y1="6"
        x2="11"
        y2="11"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.5"
      />
    </svg>
  );
}
function UndoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 5H9C11.2 5 13 6.8 13 9C13 11.2 11.2 13 9 13H5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M5 2L2 5L5 8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function RedoIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M12 5H5C2.8 5 1 6.8 1 9C1 11.2 2.8 13 5 13H9"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M9 2L12 5L9 8"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M2 4H12M5 4V2H9V4M11 4L10 12H4L3 4"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
