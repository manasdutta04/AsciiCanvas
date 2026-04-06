import {
  Cells,
  setCell,
  deleteCell,
  getCell,
  cellKey,
  DEFAULT_COLOR,
} from "./types";

const BOX = {
  single: { tl: "┌", tr: "┐", bl: "└", br: "┘", h: "─", v: "│" },
  double: { tl: "╔", tr: "╗", bl: "╚", br: "╝", h: "═", v: "║" },
  heavy: { tl: "┏", tr: "┓", bl: "┗", br: "┛", h: "━", v: "┃" },
  rounded: { tl: "╭", tr: "╮", bl: "╰", br: "╯", h: "─", v: "│" },
};

export type BoxStyle = keyof typeof BOX;

export function drawRect(
  cells: Cells,
  c1: number,
  r1: number,
  c2: number,
  r2: number,
  style: BoxStyle = "single",
  color: string = DEFAULT_COLOR,
) {
  const minC = Math.min(c1, c2),
    maxC = Math.max(c1, c2);
  const minR = Math.min(r1, r2),
    maxR = Math.max(r1, r2);
  if (maxC - minC < 1 || maxR - minR < 1) return;

  const B = BOX[style];
  setCell(cells, minC, minR, B.tl, color);
  setCell(cells, maxC, minR, B.tr, color);
  setCell(cells, minC, maxR, B.bl, color);
  setCell(cells, maxC, maxR, B.br, color);

  for (let c = minC + 1; c < maxC; c++) {
    setCell(cells, c, minR, B.h, color);
    setCell(cells, c, maxR, B.h, color);
  }
  for (let r = minR + 1; r < maxR; r++) {
    setCell(cells, minC, r, B.v, color);
    setCell(cells, maxC, r, B.v, color);
  }
}

function bresenham(
  c1: number,
  r1: number,
  c2: number,
  r2: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  let x = c1,
    y = r1;
  const dx = Math.abs(c2 - c1),
    dy = Math.abs(r2 - r1);
  const sx = c1 < c2 ? 1 : -1;
  const sy = r1 < r2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    pts.push([x, y]);
    if (x === c2 && y === r2) break;
    const e2 = 2 * err;
    if (e2 > -dy) {
      err -= dy;
      x += sx;
    }
    if (e2 < dx) {
      err += dx;
      y += sy;
    }
  }
  return pts;
}

function lineChar(pc: number, pr: number, nc: number, nr: number): string {
  const dc = nc - pc,
    dr = nr - pr;
  if (dc === 0) return "│";
  if (dr === 0) return "─";
  if ((dc > 0 && dr < 0) || (dc < 0 && dr > 0)) return "/";
  return "\\";
}

export function drawLine(
  cells: Cells,
  c1: number,
  r1: number,
  c2: number,
  r2: number,
  color: string = DEFAULT_COLOR,
) {
  const pts = bresenham(c1, r1, c2, r2);
  for (let i = 0; i < pts.length; i++) {
    const [c, r] = pts[i];
    let ch: string;
    if (pts.length === 1) {
      ch = "•";
    } else if (i === 0) {
      const [nc, nr] = pts[1];
      ch = lineChar(c, r, nc, nr);
    } else {
      const [pc, pr] = pts[i - 1];
      ch = lineChar(pc, pr, c, r);
    }
    setCell(cells, c, r, ch, color);
  }
}

export function drawArrow(
  cells: Cells,
  c1: number,
  r1: number,
  c2: number,
  r2: number,
  color: string = DEFAULT_COLOR,
) {
  const pts = bresenham(c1, r1, c2, r2);
  for (let i = 0; i < pts.length - 1; i++) {
    const [c, r] = pts[i];
    let ch: string;
    if (i === 0 && pts.length > 1) {
      const [nc, nr] = pts[1];
      ch = lineChar(c, r, nc, nr);
    } else {
      const [pc, pr] = pts[i - 1];
      ch = lineChar(pc, pr, c, r);
    }
    setCell(cells, c, r, ch, color);
  }
  const dc = c2 - c1,
    dr = r2 - r1;
  let head: string;
  if (Math.abs(dc) >= Math.abs(dr)) {
    head = dc >= 0 ? ">" : "<";
  } else {
    head = dr >= 0 ? "v" : "^";
  }
  setCell(cells, c2, r2, head, color);
}

export function drawDiamond(
  cells: Cells,
  c1: number,
  r1: number,
  c2: number,
  r2: number,
  color: string = DEFAULT_COLOR,
) {
  const cx = Math.round((c1 + c2) / 2);
  const cy = Math.round((r1 + r2) / 2);
  const hw = Math.round(Math.abs(c2 - c1) / 2);
  const hh = Math.round(Math.abs(r2 - r1) / 2);
  if (hw < 1 || hh < 1) return;

  for (let i = 0; i <= hw; i++) {
    const ro = Math.round((hh * i) / hw);
    if (i === 0) {
      setCell(cells, cx, cy - hh, "^", color);
      setCell(cells, cx, cy + hh, "v", color);
    } else if (i === hw) {
      setCell(cells, cx + hw, cy, ">", color);
      setCell(cells, cx - hw, cy, "<", color);
    } else {
      setCell(cells, cx + i, cy - ro, "/", color);
      setCell(cells, cx - i, cy - ro, "\\", color);
      setCell(cells, cx + i, cy + ro, "\\", color);
      setCell(cells, cx - i, cy + ro, "/", color);
    }
  }
}

export function drawText(
  cells: Cells,
  col: number,
  row: number,
  text: string,
  color: string = DEFAULT_COLOR,
) {
  const lines = text.split("\n");
  for (let li = 0; li < lines.length; li++) {
    for (let ci = 0; ci < lines[li].length; ci++) {
      setCell(cells, col + ci, row + li, lines[li][ci], color);
    }
  }
}

export function eraseRect(
  cells: Cells,
  c1: number,
  r1: number,
  c2: number,
  r2: number,
) {
  const minC = Math.min(c1, c2),
    maxC = Math.max(c1, c2);
  const minR = Math.min(r1, r2),
    maxR = Math.max(r1, r2);
  for (let r = minR; r <= maxR; r++)
    for (let c = minC; c <= maxC; c++) deleteCell(cells, c, r);
}

export function drawFreehand(
  cells: Cells,
  points: Array<{ col: number; row: number }>,
  color: string = DEFAULT_COLOR,
) {
  for (let i = 0; i < points.length; i++) {
    const { col, row } = points[i];
    if (i === 0 || points.length === 1) {
      setCell(cells, col, row, "•", color);
    } else {
      const prev = points[i - 1];
      const pts = bresenham(prev.col, prev.row, col, row);
      for (let j = 0; j < pts.length; j++) {
        const [c, r] = pts[j];
        if (j === 0) continue;
        const [pc, pr] = pts[j - 1];
        setCell(cells, c, r, lineChar(pc, pr, c, r), color);
      }
    }
  }
}

export function floodFill(
  cells: Cells,
  startCol: number,
  startRow: number,
  fillChar: string,
  fillColor: string = DEFAULT_COLOR,
): Cells {
  const result = new Map(cells);
  const target = getCell(result, startCol, startRow);
  if (target.char === fillChar && target.color === fillColor) return result;

  const MAX = 8000;
  const visited = new Set<string>();
  const queue: Array<{ col: number; row: number }> = [
    { col: startCol, row: startRow },
  ];

  while (queue.length > 0 && visited.size < MAX) {
    const item = queue.shift()!;
    const { col, row } = item;
    const key = cellKey(col, row);
    if (visited.has(key)) continue;
    const cur = getCell(result, col, row);
    if (cur.char !== target.char || cur.color !== target.color) continue;

    visited.add(key);
    if (fillChar === " " || fillChar === "") {
      result.delete(key);
    } else {
      result.set(key, { char: fillChar, color: fillColor });
    }

    queue.push({ col: col + 1, row });
    queue.push({ col: col - 1, row });
    queue.push({ col, row: row + 1 });
    queue.push({ col, row: row - 1 });
  }
  return result;
}

export function extractRegion(
  cells: Cells,
  minC: number,
  maxC: number,
  minR: number,
  maxR: number,
): Cells {
  const region = new Map<string, { char: string; color: string }>();
  for (let r = minR; r <= maxR; r++)
    for (let c = minC; c <= maxC; c++) {
      const cell = cells.get(cellKey(c, r));
      if (cell)
        region.set(cellKey(c - minC, r - minR), {
          char: cell.char,
          color: cell.color,
        });
    }
  return region;
}

export function pasteRegion(
  cells: Cells,
  region: Cells,
  destC: number,
  destR: number,
  clearSource?: { minC: number; maxC: number; minR: number; maxR: number },
): Cells {
  const result = new Map(cells);
  if (clearSource) {
    for (let r = clearSource.minR; r <= clearSource.maxR; r++)
      for (let c = clearSource.minC; c <= clearSource.maxC; c++)
        result.delete(cellKey(c, r));
  }
  for (const [key, cell] of region.entries()) {
    const [c, r] = key.split(",").map(Number);
    if (cell.char !== " " && cell.char !== "")
      result.set(cellKey(c + destC, r + destR), {
        char: cell.char,
        color: cell.color,
      });
  }
  return result;
}

export function buildPreview(
  base: Cells,
  tool: string,
  start: { col: number; row: number },
  end: { col: number; row: number },
  freehandPoints: Array<{ col: number; row: number }>,
  color: string = DEFAULT_COLOR,
): Cells {
  const preview = new Map(base);
  const style =
    tool === "rect_double"
      ? "double"
      : tool === "rect_heavy"
        ? "heavy"
        : tool === "rect_rounded"
          ? "rounded"
          : "single";

  switch (tool) {
    case "rect_single":
    case "rect_double":
    case "rect_heavy":
    case "rect_rounded":
      drawRect(
        preview,
        start.col,
        start.row,
        end.col,
        end.row,
        style as BoxStyle,
        color,
      );
      break;
    case "line":
      drawLine(preview, start.col, start.row, end.col, end.row, color);
      break;
    case "arrow":
      drawArrow(preview, start.col, start.row, end.col, end.row, color);
      break;
    case "diamond":
      drawDiamond(preview, start.col, start.row, end.col, end.row, color);
      break;
    case "eraser":
      eraseRect(preview, start.col, start.row, end.col, end.row);
      break;
    case "freehand":
      drawFreehand(preview, freehandPoints, color);
      break;
  }
  return preview;
}
