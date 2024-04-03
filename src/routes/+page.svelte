<script lang="ts">
	import type { WFCGridCell } from '$lib/wfc';
	import WfcSudokuGrid from '../components/WFCSudokuGrid.svelte';
	import '../slider.css';

	let timeStep = 0;

	let baseGrid: WFCGridCell[][] = [];
	let workingGrid: WFCGridCell[][] = [];

	let solverRunning = false;

	// Init working grid
	for (let y = 0; y < 9; y++) {
		let row: WFCGridCell[] = [];
		for (let x = 0; x < 9; x++) {
			row.push({
				x,
				y,
				value: null,
				possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			});
		}
		workingGrid.push(row);
	}
	// Init base grid
	for (let y = 0; y < 9; y++) {
		let row: WFCGridCell[] = [];
		for (let x = 0; x < 9; x++) {
			row.push({
				x,
				y,
				value: null,
				possibleValues: [1, 2, 3, 4, 5, 6, 7, 8, 9]
			});
		}
		baseGrid.push(row);
	}
	/** Sleep function: https://stackoverflow.com/questions/951021/what-is-the-javascript-version-of-sleep#answer-39914235 */
	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const recalculateCellPossibleValues = (grid: WFCGridCell[][], cell: WFCGridCell) => {
		if (cell.value !== null) {
			cell.possibleValues = [];
			return;
		}

		cell.possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];

		// Check row
		for (let i = 0; i < 9; i++) {
			cell.possibleValues = cell.possibleValues.filter(
				(possibleValue) => possibleValue !== grid[cell.y][i].value
			);
		}

		// Check column
		for (let i = 0; i < 9; i++) {
			cell.possibleValues = cell.possibleValues.filter(
				(possibleValue) => possibleValue !== grid[i][cell.x].value
			);
		}

		// Check 3x3
		const cell3x3X = Math.floor(cell.x / 3);
		const cell3x3Y = Math.floor(cell.y / 3);
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				cell.possibleValues = cell.possibleValues.filter(
					(possibleValue) => possibleValue !== grid[y + cell3x3Y * 3][x + cell3x3X * 3].value
				);
			}
		}
	};

	const recalculateConnectedCellPossibleValues = (grid: WFCGridCell[][], cell: WFCGridCell) => {
		// Row
		for (let i = 0; i < 9; i++) {
			const connectedCell = grid[cell.y][i];
			if (connectedCell.value === null) {
				recalculateCellPossibleValues(grid, connectedCell);
			}
		}

		// Column
		for (let i = 0; i < 9; i++) {
			const connectedCell = grid[i][cell.x];
			if (connectedCell.value === null) {
				recalculateCellPossibleValues(grid, connectedCell);
			}
		}

		// 3x3
		const cell3x3X = Math.floor(cell.x / 3);
		const cell3x3Y = Math.floor(cell.y / 3);
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				const connectedCell = grid[y + cell3x3Y * 3][x + cell3x3X * 3];
				if (connectedCell.value === null) {
					recalculateCellPossibleValues(grid, connectedCell);
				}
			}
		}
	};

	const setBaseGridValue = (x: number, y: number, value: number) => {
		baseGrid[y][x].value = value;
		baseGrid[y][x].possibleValues = [];

		console.log('Setting base grid value', x, y, value);

		recalculateConnectedCellPossibleValues(baseGrid, baseGrid[y][x]);

		resetWorkingGridToBaseGrid();

		console.log('Base grid', baseGrid);
		console.log('Working grid', workingGrid);
	};

	const setTimeStep = (
		event: Event & {
			currentTarget: EventTarget & HTMLInputElement;
		}
	) => {
		timeStep = parseInt(event.currentTarget.value);
	};

	const startSolve = async () => {
		if (solverRunning) {
			return;
		}
		solverRunning = true;
		await solveStep();
		console.log('Complete');
		let solved = isSolved(workingGrid);
		solverRunning = false;
		if (solved) {
			console.log('The puzzle has been solved!');
		} else {
			console.log('This puzzle has no solution.');
		}
	};

	const isMoveValid = (grid: WFCGridCell[][], x: number, y: number, value: number): boolean => {
		// Check row
		for (let i = 0; i < 9; i++) {
			if (grid[y][i].value === value) {
				return false;
			}
		}

		// Check column
		for (let i = 0; i < 9; i++) {
			if (grid[i][x].value === value) {
				return false;
			}
		}

		// Check 3x3
		const cell3x3X = Math.floor(x / 3);
		const cell3x3Y = Math.floor(y / 3);
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 3; x++) {
				if (grid[y + cell3x3Y * 3][x + cell3x3X * 3].value === value) {
					return false;
				}
			}
		}

		return true;
	};

	const solveStep = async (): Promise<boolean> => {
		const { cells, lowestEntropy } = getCellsWithLowestEntropy(workingGrid);

		if (cells.length === 0) {
			return true;
		}

		if (lowestEntropy === 0) {
			return false;
		}

		const cell = cells[Math.floor(Math.random() * cells.length)];

		let possibleValues = cell.possibleValues.slice();

		while (cell.possibleValues.length !== 0) {
			const value = cell.possibleValues[Math.floor(Math.random() * cell.possibleValues.length)];

			// console.log(`Trying ${value} at ${cell.x}, ${cell.y}`);

			if (!isMoveValid(workingGrid, cell.x, cell.y, value)) {
				workingGrid[cell.y][cell.x].possibleValues = workingGrid[cell.y][
					cell.x
				].possibleValues.filter((possibleValue) => possibleValue !== value);

				continue;
			}

			cell.value = value;
			workingGrid[cell.y][cell.x] = cell;
			recalculateConnectedCellPossibleValues(workingGrid, cell);

			await sleep(timeStep);

			let solveStepResult = await solveStep();

			if (solveStepResult) {
				cell.possibleValues = [];
				return true;
			}

			await sleep(timeStep);

			// console.log(`Removing ${value} at ${cell.x}, ${cell.y}`);

			possibleValues = possibleValues.filter((possibleValue) => possibleValue !== value);
			cell.possibleValues = possibleValues.slice();

			cell.value = null;

			workingGrid[cell.y][cell.x] = cell;
		}

		recalculateConnectedCellPossibleValues(workingGrid, cell);
		return false;
	};

	const getCellsWithLowestEntropy = (grid: WFCGridCell[][]) => {
		let lowestEntropy = 10;
		let cells: WFCGridCell[] = [];

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				const cell = grid[y][x];

				if (cell.value !== null) continue;

				if (cell.possibleValues.length < lowestEntropy) {
					lowestEntropy = cell.possibleValues.length;
					cells = [cell];
				} else if (cell.possibleValues.length === lowestEntropy) {
					cells.push(cell);
				}
			}
		}

		return { cells, lowestEntropy };
	};

	const resetWorkingGridToBaseGrid = () => {
		for (let y = 0; y < workingGrid.length; y++) {
			for (let x = 0; x < workingGrid[y].length; x++) {
				workingGrid[y][x].value = baseGrid[y][x].value;
				workingGrid[y][x].possibleValues = [...baseGrid[y][x].possibleValues];
			}
		}
	};

	const resetBaseGrid = () => {
		for (let y = 0; y < workingGrid.length; y++) {
			for (let x = 0; x < workingGrid[y].length; x++) {
				baseGrid[y][x].value = null;
				baseGrid[y][x].possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
		}
	};

	const isSolved = (grid: WFCGridCell[][]): boolean => {
		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				if (grid[y][x].value === null) {
					return false;
				}
			}
		}

		return true;
	};
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center space-y-8">
	<div class="flex flex-col items-center justify-center">
		<p class="text-4xl font-thin">Wave Function Collapse</p>
		<p class="-mr-2 text-center text-6xl font-thin tracking-[8px]">Sudoku</p>
	</div>
	<WfcSudokuGrid {workingGrid} {solverRunning} {setBaseGridValue} />
	<div class="flex flex-row items-center justify-center space-x-4">
		<button
			class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
			on:click={startSolve}
		>
			Solve
		</button>
		<button
			class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
			on:click={resetWorkingGridToBaseGrid}
		>
			Reset
		</button>
		<div class="justify- -mt-2 flex flex-col items-center font-thin">
			<p class="mb-1 text-sm">Timestep: {timeStep}ms</p>
			<input
				type="range"
				style=""
				min={0}
				max={1000}
				step={50}
				value={timeStep}
				on:input={setTimeStep}
			/>
		</div>
	</div>
</div>
