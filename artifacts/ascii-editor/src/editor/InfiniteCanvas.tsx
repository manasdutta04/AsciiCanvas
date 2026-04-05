import React, { useRef, useEffect, useCallback, useState } from "react";
import {
  Cells,
  CHAR_W,
  CHAR_H,
  FONT_SIZE,
  FONT_FAMILY,
  Tool,
  TextSession,
  Selection,
  selectionBounds,
  getCell,
  setCell,
  deleteCell,
  cellKey,
} from "./types";
import {
  buildPreview,
  drawText,
  floodFill,
  extractRegion,
  pasteRegion,
} from "./drawing";

interface Props {
  tool: Tool;
  cells: Cells;
  fillChar: string;
  onCommit: (newCells: Cells) => void;
  zoom: number;
  onZoomChange: (z: number) => void;
  panX: number;
  panY: number;
  onPanChange: (x: number, y: number) => void;
  textSession: TextSession | null;
  onTextSessionChange: (t: TextSession | null) => void;
  onCursorPos: (col: number, row: number) => void;
  previewCells: Cells | null;
  onPreviewCells: (p: Cells | null) => void;
  selection: Selection | null;
  onSelectionChange: (s: Selection | null) => void;
}

const BG = "#0d0d18";
const FG = "#cdd6f4";
const PREVIEW_CLR = "#89b4fa";
const CURSOR_FILL = "rgba(137,180,250,0.12)";
const CURSOR_STR = "rgba(137,180,250,0.4)";
const GRID_LINE = "rgba(255,255,255,0.05)";
const ERASER_FILL = "rgba(243,139,168,0.2)";
const SEL_FILL = "rgba(137,180,250,0.08)";
const SEL_STROKE = "rgba(137,180,250,0.7)";

export function InfiniteCanvas({
  tool,
  cells,
  fillChar,
  onCommit,
  zoom,
  onZoomChange,
  panX,
  panY,
  onPanChange,
  textSession,
  onTextSessionChange,
  onCursorPos,
  previewCells,
  onPreviewCells,
  selection,
  onSelectionChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setTick] = useState(0);
  const repaint = useCallback(() => setTick((t) => t + 1), []);

  const mouseDown = useRef(false);
  const startCell = useRef<{ col: number; row: number } | null>(null);
  const freePoints = useRef<Array<{ col: number; row: number }>>([]);

  const isPanning = useRef(false);
  const panStart = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);
  const midDown = useRef(false);
  const midStart = useRef<{
    x: number;
    y: number;
    px: number;
    py: number;
  } | null>(null);

  const [spaceHeld, setSpaceHeld] = useState(false);
  const spaceHeldRef = useRef(false);
  const [panningActive, setPanningActive] = useState(false);

  const [hoverCell, setHoverCell] = useState<{
    col: number;
    row: number;
  } | null>(null);
  const cursorBlink = useRef(true);
  const blinkTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  const selMoveState = useRef<{
    dragging: boolean;
    startCell: { col: number; row: number };
    region: Cells;
    srcBounds: { minC: number; maxC: number; minR: number; maxR: number };
    curDeltaC: number;
    curDeltaR: number;
  } | null>(null);

  const stateRef = useRef({
    panX,
    panY,
    zoom,
    cells,
    textSession,
    tool,
    selection,
    fillChar,
  });
  useEffect(() => {
    stateRef.current = {
      panX,
      panY,
      zoom,
      cells,
      textSession,
      tool,
      selection,
      fillChar,
    };
  });

  const screenToCell = useCallback((sx: number, sy: number, rect: DOMRect) => {
    const { panX, panY, zoom } = stateRef.current;
    const cw = CHAR_W * zoom,
      ch = CHAR_H * zoom;
    return {
      col: Math.floor((sx - rect.left - panX) / cw),
      row: Math.floor((sy - rect.top - panY) / ch),
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ro = new ResizeObserver(() => repaint());
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [repaint]);

  useEffect(() => {
    blinkTimer.current = setInterval(() => {
      cursorBlink.current = !cursorBlink.current;
      repaint();
    }, 530);
    return () => {
      if (blinkTimer.current) clearInterval(blinkTimer.current);
    };
  }, [repaint]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;
    if (w === 0 || h === 0) return;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    const { panX, panY, zoom } = stateRef.current;
    const cw = CHAR_W * zoom;
    const ch = CHAR_H * zoom;

    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);

    const startCol = Math.floor(-panX / cw) - 1;
    const startRow = Math.floor(-panY / ch) - 1;
    const endCol = Math.ceil((w - panX) / cw) + 1;
    const endRow = Math.ceil((h - panY) / ch) + 1;

    if (zoom >= 0.3) {
      ctx.strokeStyle = GRID_LINE;
      ctx.lineWidth = 0.5;
      for (let c = startCol; c <= endCol; c++) {
        const sx = Math.round(c * cw + panX) + 0.5;
        ctx.beginPath();
        ctx.moveTo(sx, 0);
        ctx.lineTo(sx, h);
        ctx.stroke();
      }
      for (let r = startRow; r <= endRow; r++) {
        const sy = Math.round(r * ch + panY) + 0.5;
        ctx.beginPath();
        ctx.moveTo(0, sy);
        ctx.lineTo(w, sy);
        ctx.stroke();
      }
    }

    const { selection } = stateRef.current;
    if (selection) {
      const { minC, maxC, minR, maxR } = selectionBounds(selection);
      const sx = minC * cw + panX;
      const sy = minR * ch + panY;
      const sw = (maxC - minC + 1) * cw;
      const sh = (maxR - minR + 1) * ch;
      ctx.fillStyle = SEL_FILL;
      ctx.fillRect(sx, sy, sw, sh);
      ctx.strokeStyle = SEL_STROKE;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 3]);
      ctx.strokeRect(sx + 0.5, sy + 0.5, sw - 1, sh - 1);
      ctx.setLineDash([]);
    }

    if (hoverCell && !mouseDown.current) {
      const sx = hoverCell.col * cw + panX;
      const sy = hoverCell.row * ch + panY;
      if (tool === "eraser") {
        ctx.fillStyle = ERASER_FILL;
        ctx.fillRect(sx, sy, cw, ch);
      } else if (tool !== "select" && tool !== "hand") {
        ctx.fillStyle = CURSOR_FILL;
        ctx.fillRect(sx, sy, cw, ch);
        ctx.strokeStyle = CURSOR_STR;
        ctx.lineWidth = 1;
        ctx.strokeRect(sx + 0.5, sy + 0.5, cw - 1, ch - 1);
      }
    }

    const displayCells = previewCells ?? cells;

    ctx.font = `${FONT_SIZE * zoom}px ${FONT_FAMILY}`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    for (let r = startRow; r <= endRow; r++) {
      for (let c = startCol; c <= endCol; c++) {
        const char = displayCells.get(cellKey(c, r));
        if (!char) continue;
        const isPreview =
          previewCells &&
          previewCells.get(cellKey(c, r)) !== cells.get(cellKey(c, r));
        ctx.fillStyle = isPreview ? PREVIEW_CLR : FG;
        ctx.fillText(char, c * cw + panX + cw * 0.5, r * ch + panY + ch * 0.5);
      }
    }

    const ts = stateRef.current.textSession;
    if (ts) {
      const lines = ts.text.split("\n");
      ctx.fillStyle = PREVIEW_CLR;
      for (let li = 0; li < lines.length; li++) {
        for (let ci = 0; ci < lines[li].length; ci++) {
          const c = ts.col + ci,
            r = ts.row + li;
          ctx.fillText(
            lines[li][ci],
            c * cw + panX + cw * 0.5,
            r * ch + panY + ch * 0.5,
          );
        }
      }
      const lastLine = lines[lines.length - 1];
      const curC = ts.col + lastLine.length;
      const curR = ts.row + lines.length - 1;
      const bsx = curC * cw + panX;
      const bsy = curR * ch + panY;
      if (cursorBlink.current) {
        ctx.fillStyle = PREVIEW_CLR;
        ctx.fillRect(bsx + 1, bsy + 3, 2, ch - 6);
      }
    }
  });

  const getCanvas = () => canvasRef.current;

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (e.button === 1) {
        midDown.current = true;
        midStart.current = {
          x: e.clientX,
          y: e.clientY,
          px: stateRef.current.panX,
          py: stateRef.current.panY,
        };
        setPanningActive(true);
        return;
      }

      if (spaceHeldRef.current || stateRef.current.tool === "hand") {
        isPanning.current = true;
        panStart.current = {
          x: e.clientX,
          y: e.clientY,
          px: stateRef.current.panX,
          py: stateRef.current.panY,
        };
        setPanningActive(true);
        return;
      }

      const canvas = getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cell = screenToCell(e.clientX, e.clientY, rect);
      const { tool, textSession, cells, selection, fillChar } =
        stateRef.current;

      if (e.button === 2) {
        const updated = new Map(cells);
        updated.delete(cellKey(cell.col, cell.row));
        onCommit(updated);
        return;
      }
      if (e.button !== 0) return;

      if (tool === "text") {
        if (textSession) {
          const updated = new Map(cells);
          drawText(updated, textSession.col, textSession.row, textSession.text);
          onCommit(updated);
        }
        onTextSessionChange({
          col: cell.col,
          row: cell.row,
          text: "",
          cursorOffset: 0,
        });
        return;
      }

      if (tool === "fill") {
        const result = floodFill(cells, cell.col, cell.row, fillChar);
        onCommit(result);
        return;
      }

      if (tool === "select") {
        if (selection) {
          const { minC, maxC, minR, maxR } = selectionBounds(selection);
          const inSel =
            cell.col >= minC &&
            cell.col <= maxC &&
            cell.row >= minR &&
            cell.row <= maxR;
          if (inSel) {
            const region = extractRegion(cells, minC, maxC, minR, maxR);
            selMoveState.current = {
              dragging: true,
              startCell: cell,
              region,
              srcBounds: { minC, maxC, minR, maxR },
              curDeltaC: 0,
              curDeltaR: 0,
            };
            mouseDown.current = true;
            startCell.current = cell;
            return;
          }
        }
        onSelectionChange(null);
        mouseDown.current = true;
        startCell.current = cell;
        onSelectionChange({
          startC: cell.col,
          startR: cell.row,
          endC: cell.col,
          endR: cell.row,
        });
        return;
      }

      mouseDown.current = true;
      startCell.current = cell;

      if (tool === "freehand") {
        freePoints.current = [cell];
        onPreviewCells(
          buildPreview(new Map(cells), tool, cell, cell, freePoints.current),
        );
      } else if (tool === "eraser") {
        onPreviewCells(buildPreview(new Map(cells), tool, cell, cell, []));
      }
    },
    [
      screenToCell,
      onCommit,
      onTextSessionChange,
      onPreviewCells,
      onSelectionChange,
    ],
  );

  const onMouseMove = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (
        (midDown.current && midStart.current) ||
        (isPanning.current && panStart.current)
      ) {
        const ref = midDown.current ? midStart.current! : panStart.current!;
        const dx = e.clientX - ref.x;
        const dy = e.clientY - ref.y;
        onPanChange(ref.px + dx, ref.py + dy);
        return;
      }

      const canvas = getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cell = screenToCell(e.clientX, e.clientY, rect);

      setHoverCell(cell);
      onCursorPos(cell.col, cell.row);

      if (!mouseDown.current || !startCell.current) return;
      const { tool, cells } = stateRef.current;

      if (tool === "select" && selMoveState.current?.dragging) {
        const { startCell: sc, region, srcBounds } = selMoveState.current;
        const dc = cell.col - sc.col;
        const dr = cell.row - sc.row;
        selMoveState.current.curDeltaC = dc;
        selMoveState.current.curDeltaR = dr;
        const { minC, maxC, minR, maxR } = srcBounds;
        const preview = pasteRegion(
          new Map(cells),
          region,
          minC + dc,
          minR + dr,
          srcBounds,
        );
        onPreviewCells(preview);
        onSelectionChange({
          startC: minC + dc,
          startR: minR + dr,
          endC: maxC + dc,
          endR: maxR + dr,
        });
        return;
      }

      if (tool === "select") {
        onSelectionChange({
          startC: startCell.current.col,
          startR: startCell.current.row,
          endC: cell.col,
          endR: cell.row,
        });
        return;
      }

      if (tool === "freehand") {
        const last = freePoints.current[freePoints.current.length - 1];
        if (!last || last.col !== cell.col || last.row !== cell.row)
          freePoints.current.push(cell);
      }

      const preview = buildPreview(
        new Map(cells),
        tool,
        startCell.current,
        cell,
        freePoints.current,
      );
      onPreviewCells(preview);
    },
    [screenToCell, onPanChange, onCursorPos, onPreviewCells, onSelectionChange],
  );

  const onMouseUp = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (midDown.current) {
        midDown.current = false;
        midStart.current = null;
        setPanningActive(false);
        return;
      }
      if (isPanning.current) {
        isPanning.current = false;
        panStart.current = null;
        setPanningActive(false);
        return;
      }
      if (!mouseDown.current || !startCell.current) return;

      const canvas = getCanvas();
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const cell = screenToCell(e.clientX, e.clientY, rect);
      const { tool, cells } = stateRef.current;

      if (tool === "select" && selMoveState.current?.dragging) {
        const { region, srcBounds, curDeltaC, curDeltaR } =
          selMoveState.current;
        const { minC, maxC, minR, maxR } = srcBounds;
        const result = pasteRegion(
          new Map(cells),
          region,
          minC + curDeltaC,
          minR + curDeltaR,
          srcBounds,
        );
        onCommit(result);
        selMoveState.current = null;
        onPreviewCells(null);
        mouseDown.current = false;
        startCell.current = null;
        return;
      }

      if (tool !== "select") {
        const final = buildPreview(
          new Map(cells),
          tool,
          startCell.current,
          cell,
          freePoints.current,
        );
        onCommit(final);
      }

      mouseDown.current = false;
      startCell.current = null;
      freePoints.current = [];
      onPreviewCells(null);
    },
    [screenToCell, onCommit, onPreviewCells],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { panX, panY, zoom } = stateRef.current;
      if (e.ctrlKey || e.metaKey) {
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const factor = e.deltaY < 0 ? 1.12 : 0.9;
        const newZoom = Math.max(0.15, Math.min(5, zoom * factor));
        const newPanX = mx - (mx - panX) * (newZoom / zoom);
        const newPanY = my - (my - panY) * (newZoom / zoom);
        onZoomChange(newZoom);
        onPanChange(newPanX, newPanY);
      } else {
        onPanChange(panX - e.deltaX, panY - e.deltaY);
      }
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [onZoomChange, onPanChange]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const inInput =
        target.tagName === "INPUT" || target.tagName === "TEXTAREA";

      if (e.code === "Space" && !e.repeat && !inInput) {
        if (!spaceHeldRef.current) {
          spaceHeldRef.current = true;
          setSpaceHeld(true);
        }
        if (e.target === document.body) e.preventDefault();
      }

      const ts = stateRef.current.textSession;
      if (ts) {
        if (e.key === "Escape") {
          onTextSessionChange(null);
          return;
        }
        if (e.key === "Enter" && !e.shiftKey) {
          e.preventDefault();
          const updated = new Map(stateRef.current.cells);
          drawText(updated, ts.col, ts.row, ts.text);
          onCommit(updated);
          onTextSessionChange(null);
          return;
        }
        if (e.key === "Enter" && e.shiftKey) {
          e.preventDefault();
          onTextSessionChange({ ...ts, text: ts.text + "\n", cursorOffset: 0 });
          return;
        }
        if (e.key === "Backspace") {
          e.preventDefault();
          if (ts.text.length === 0) return;
          onTextSessionChange({
            ...ts,
            text: ts.text.slice(0, -1),
            cursorOffset: 0,
          });
          return;
        }
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          e.preventDefault();
          onTextSessionChange({
            ...ts,
            text: ts.text + e.key,
            cursorOffset: 0,
          });
          return;
        }
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        spaceHeldRef.current = false;
        setSpaceHeld(false);
        if (isPanning.current) {
          isPanning.current = false;
          panStart.current = null;
          setPanningActive(false);
        }
      }
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [onCommit, onTextSessionChange]);

  const getCursor = () => {
    if (spaceHeld || panningActive) return "grabbing";
    if (tool === "hand") return "grab";
    if (tool === "text") return "text";
    if (tool === "fill") return "cell";
    if (tool === "select") return "crosshair";
    if (tool === "eraser") return "cell";
    return "crosshair";
  };

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: "block",
        width: "100%",
        height: "100%",
        cursor: getCursor(),
        userSelect: "none",
        WebkitUserSelect: "none",
        touchAction: "none",
      }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={(e) => {
        if (mouseDown.current) onMouseUp(e);
        setHoverCell(null);
      }}
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
