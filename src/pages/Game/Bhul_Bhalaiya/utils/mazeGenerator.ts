/**
 * Procedural maze generation - ONE valid path from start to exit.
 * Uses Recursive Backtracking (perfect maze) with bias toward exit so path always exists.
 * Grid format: (2*rows+1) x (2*cols+1), 1 = wall, 0 = path.
 */

// Move 2 steps: right, down, left, up (row, col)
const DX = [0, 2, 0, -2];
const DY = [2, 0, -2, 0];
// Wall cell between (r,c) and (r+DX[d], c+DY[d])
const WALL_X = [0, 1, 0, -1]; // right: (r,c+1), down: (r+1,c), left: (r,c-1), up: (r-1,c)
const WALL_Y = [1, 0, -1, 0];

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Prefer directions that move toward (er, ec) so exit is reachable */
function orderedDirections(r: number, c: number, er: number, ec: number): number[] {
  const dirs = [0, 1, 2, 3];
  const toward: number[] = [];
  const away: number[] = [];
  for (const d of dirs) {
    const nr = r + DX[d];
    const nc = c + DY[d];
    const distAfter = Math.abs(nr - er) + Math.abs(nc - ec);
    const distNow = Math.abs(r - er) + Math.abs(c - ec);
    if (distAfter < distNow) toward.push(d);
    else away.push(d);
  }
  return [...shuffle(toward), ...shuffle(away)];
}

function carve(
  maze: number[][],
  rows: number,
  cols: number,
  r: number,
  c: number,
  exitRow: number,
  exitCol: number
): void {
  const order = orderedDirections(r, c, exitRow, exitCol);

  for (const dir of order) {
    const nr = r + DX[dir];
    const nc = c + DY[dir];

    if (nr >= 1 && nr <= 2 * rows - 1 && nc >= 1 && nc <= 2 * cols - 1 && maze[nr][nc] === 1) {
      maze[nr][nc] = 0;
      maze[r + WALL_X[dir]][c + WALL_Y[dir]] = 0;
      carve(maze, rows, cols, nr, nc, exitRow, exitCol);
    }
  }
}

/**
 * Generate a new maze. Returns 2D array: 1 = wall, 0 = path.
 * Dimensions (2*rows+1) x (2*cols+1). Start at (1,1), exit at (2*rows-1, 2*cols-1).
 * Only ONE path from start to exit (perfect maze).
 */
export function generateMaze(rows: number, cols: number): number[][] {
  const R = 2 * rows + 1;
  const C = 2 * cols + 1;
  const exitRow = 2 * rows - 1;
  const exitCol = 2 * cols - 1;

  const maze: number[][] = Array(R)
    .fill(0)
    .map(() => Array(C).fill(1));

  maze[1][1] = 0;
  carve(maze, rows, cols, 1, 1, exitRow, exitCol);

  // BFS from start to see which cells are in the main component
  const reachable = new Set<string>();
  const q: [number, number][] = [[1, 1]];
  reachable.add('1,1');
  const dir4 = [[0, 1], [1, 0], [0, -1], [-1, 0]];
  while (q.length) {
    const [r, c] = q.shift()!;
    for (const [dr, dc] of dir4) {
      const nr = r + dr, nc = c + dc;
      const key = `${nr},${nc}`;
      if (nr >= 1 && nr < R && nc >= 1 && nc < C && maze[nr][nc] === 0 && !reachable.has(key)) {
        reachable.add(key);
        q.push([nr, nc]);
      }
    }
  }

  // Ensure exit cell is path and connect it with exactly one wall (one path only)
  maze[exitRow][exitCol] = 0;
  const fromLeft = `${exitRow},${exitCol - 2}`;
  const fromUp = `${exitRow - 2},${exitCol}`;
  if (reachable.has(fromLeft)) maze[exitRow][exitCol - 1] = 0;
  else if (reachable.has(fromUp)) maze[exitRow - 1][exitCol] = 0;
  else {
    maze[exitRow][exitCol - 1] = 0;
    maze[exitRow - 1][exitCol] = 0;
  }

  return maze;
}

/** Configurable maze size - change in one place (e.g. 10x10, 15x15) */
export const MAZE_ROWS = 10;
export const MAZE_COLS = 10;

export function getStartCell(): [number, number] {
  return [1, 1];
}

export function getExitCell(rows: number, cols: number): [number, number] {
  return [2 * rows - 1, 2 * cols - 1];
}
