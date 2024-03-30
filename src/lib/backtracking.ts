// This backtracking solver comes directly from this video: https://www.youtube.com/watch?v=G_UYXzGuqvM
// It is only used to check if a puzzle entered by the user is solvable or not.

const isMovePossible = (grid: number[][], row: number, col: number, value: number) => {
	// Check row
	for (let i = 0; i < 9; i++) {
		if (grid[row][i] === value) {
			return false;
		}
	}

	// Check column
	for (let i = 0; i < 9; i++) {
		if (grid[i][col] === value) {
			return false;
		}
	}

	// Check 3x3 grid
	const startRow = row - (row % 3);
	const startCol = col - (col % 3);

	for (let i = 0; i < 3; i++) {
		for (let j = 0; j < 3; j++) {
			if (grid[i + startRow][j + startCol] === value) {
				return false;
			}
		}
	}

	return true;
};

const backtrackingSolve = (grid: number[][]) => {
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			if (grid[y][x] === 0) {
				for (let value = 1; value < 10; value++) {
					if (value !== 0 && isMovePossible(grid, y, x, value)) {
						grid[y][x] = value;
						if (backtrackingSolve(grid)) {
							return true;
						}
						grid[y][x] = 0;
					}
				}
				return false;
			}
		}
	}

	return true;
};

const anyEmptySpaces = (grid: number[][]) => {
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			if (grid[y][x] === 0) {
				return true;
			}
		}
	}
	return false;
};

export const isSolvable = (grid: number[][]) => {
	const sudokuGrid = grid.map((row) => row.slice());

	// Check for any existing conflicts
	for (let y = 0; y < 9; y++) {
		for (let x = 0; x < 9; x++) {
			if (sudokuGrid[y][x] !== 0) {
				const value = sudokuGrid[y][x];
				sudokuGrid[y][x] = 0;

				if (!isMovePossible(sudokuGrid, y, x, value)) {
					sudokuGrid[y][x] = value;

					console.log('Test 1');

					return false;
				}

				sudokuGrid[y][x] = value;
			}
		}
	}

	// Try to solve
	backtrackingSolve(sudokuGrid);
	// Check for empty spaces after solving
	return !anyEmptySpaces(sudokuGrid);
};
