export type Tool =
  | "select"
  | "hand"
  | "rect_single"
  | "rect_double"
  | "rect_rounded"
  | "rect_heavy"
  | "line"
  | "arrow"
  | "diamond"
  | "text"
  | "freehand"
  | "fill"
  | "eraser";

export interface Cell {
  char: string;
  color: string;
}

export const DEFAULT_COLOR = "#cdd6f4";

export const COLOR_PALETTE = [
  "#cdd6f4", // Default/Light
  "#f38ba8", // Red
  "#fab387", // Orange
  "#f9e2af", // Yellow
  "#a6e3a1", // Green
  "#94e2d5", // Teal
  "#89b4fa", // Blue
  "#cba6f7", // Purple
  "#f5c2e7", // Pink
  "#45475a", // Gray
  "#ffffff", // White
  "#000000", // Black
];

export type Cells = Map<string, Cell>;

export function cellKey(col: number, row: number): string {
  return `${col},${row}`;
}
export function parseKey(key: string): { col: number; row: number } {
  const [c, r] = key.split(",").map(Number);
  return { col: c, row: r };
}
export function cloneCells(cells: Cells): Cells {
  return new Map(cells);
}
export function getCell(cells: Cells, col: number, row: number): Cell {
  return cells.get(cellKey(col, row)) ?? { char: " ", color: DEFAULT_COLOR };
}
export function setCell(
  cells: Cells,
  col: number,
  row: number,
  ch: string,
  color: string = DEFAULT_COLOR,
) {
  if (ch === " " || ch === "") cells.delete(cellKey(col, row));
  else cells.set(cellKey(col, row), { char: ch, color });
}
export function deleteCell(cells: Cells, col: number, row: number) {
  cells.delete(cellKey(col, row));
}

export function cellsToAscii(cells: Cells): string {
  if (cells.size === 0) return "";
  let minCol = Infinity,
    maxCol = -Infinity;
  let minRow = Infinity,
    maxRow = -Infinity;
  for (const key of cells.keys()) {
    const { col, row } = parseKey(key);
    if (col < minCol) minCol = col;
    if (col > maxCol) maxCol = col;
    if (row < minRow) minRow = row;
    if (row > maxRow) maxRow = row;
  }
  const lines: string[] = [];
  for (let r = minRow; r <= maxRow; r++) {
    let line = "";
    for (let c = minCol; c <= maxCol; c++) line += getCell(cells, c, r).char;
    lines.push(line.trimEnd());
  }
  while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
  while (lines.length > 0 && lines[0] === "") lines.shift();
  return lines.join("\n");
}

export interface TextSession {
  col: number;
  row: number;
  text: string;
  cursorOffset: number;
}

export interface Selection {
  startC: number;
  startR: number;
  endC: number;
  endR: number;
}

export function selectionBounds(s: Selection) {
  return {
    minC: Math.min(s.startC, s.endC),
    maxC: Math.max(s.startC, s.endC),
    minR: Math.min(s.startR, s.endR),
    maxR: Math.max(s.startR, s.endR),
  };
}

export const CHAR_W = 10;
export const CHAR_H = 20;
export const FONT_SIZE = 14;
export const FONT_FAMILY =
  "'Cascadia Code','Fira Code','Consolas','Courier New',monospace";
