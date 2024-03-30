<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import WfcSudokuCell from '../components/WFCSudokuCell.svelte';
	import type { WFCGridCell } from '$lib/wfc';
	import { isSolvable } from '$lib/backtracking';
	import InputSudokuCell from '../components/InputSudokuCell.svelte';

	let userDefinedGrid: number[][] = [];
	let baseGrid: WFCGridCell[][] = [];
	let grid: WFCGridCell[][] = [];

	let interval: number;

	let editing = false;

	const numberInSame3x3 = (
		cell1X: number,
		cell1Y: number,
		cell2X: number,
		cell2Y: number
	): boolean => {
		const cell13x3X = Math.floor(cell1X / 3);
		const cell13x3Y = Math.floor(cell1Y / 3);

		const cell23x3X = Math.floor(cell2X / 3);
		const cell23x3Y = Math.floor(cell2Y / 3);

		return cell13x3X === cell23x3X && cell13x3Y === cell23x3Y;
	};

	const solve = () => {
		interval = setInterval(() => {
			const { cells, lowestEntropy } = getCellsWithLowestEntropy(grid);

			if (cells.length === 0) {
				console.log('Solved!');
				clearInterval(interval);
				return;
			}

			if (lowestEntropy === 0) {
				console.log('Retrying...');
				// resetToUserDefined();
				solve();
				return;
			}

			const cell = cells[Math.floor(Math.random() * cells.length)];

			const value = cell.possibleValues[Math.floor(Math.random() * cell.possibleValues.length)];

			setValue(cell, value);
		}, 0);
	};

	const setValue = (cell: WFCGridCell, value: number) => {
		cell.value = value;

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				const otherCell = grid[y][x];

				if (otherCell.value !== null) continue;

				if (
					otherCell.x === cell.x ||
					otherCell.y === cell.y ||
					numberInSame3x3(cell.x, cell.y, otherCell.x, otherCell.y)
				) {
					otherCell.possibleValues = otherCell.possibleValues.filter((v) => v !== value);
				}

				grid[y][x] = otherCell;
			}
		}

		grid[cell.y][cell.x] = cell;

		console.log('Set value', value, 'at', cell.x, cell.y);
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

	// const resetToUserDefined = () => {
	// 	clearInterval(interval);

	// 	for (let y = 0; y < grid.length; y++) {
	// 		for (let x = 0; x < grid[y].length; x++) {
	// 			grid[y][x].value = userDefinedGrid[y][x].value;
	// 			grid[y][x].possibleValues = [...userDefinedGrid[y][x].possibleValues];
	// 		}
	// 	}
	// };

	const resetGrid = (grid: WFCGridCell[][]) => {
		clearInterval(interval);

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
			grid.push(row);
		}
	};

	const resetUserDefined = () => {
		userDefinedGrid = [];
		for (let y = 0; y < 9; y++) {
			let row: number[] = [];
			for (let x = 0; x < 9; x++) {
				row.push(0);
			}
			userDefinedGrid.push(row);
		}
	};

	onDestroy(() => {
		clearInterval(interval);
	});

	resetGrid(grid);
	resetUserDefined();
	// resetGrid(userDefinedGrid);
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center space-y-8">
	<div class="flex flex-col items-center justify-center">
		<p class="text-4xl font-thin">Wave Function Collapse</p>
		<p class="text-6xl font-thin">Sudoku</p>
	</div>
	<div class="grid-cols-9 border-b-2 border-r-2 border-black">
		{#each grid as row, y}
			<div class="grid grid-cols-9">
				{#each row as cell, x}
					{#if !editing}
						<WfcSudokuCell {cell} />
					{:else}
						<InputSudokuCell grid={userDefinedGrid} {x} {y} />
					{/if}
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-row items-center justify-center space-x-4">
		{#if !editing}
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={solve}
			>
				Solve
			</button>
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={() => {}}
			>
				Reset
			</button>
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={() => {
					editing = !editing;
				}}
			>
				Edit
			</button>
		{:else}
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={() => {
					console.log('Confirm');
					console.log('Is this solvable?:', isSolvable(userDefinedGrid));
				}}
			>
				Confirm
			</button>
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={() => {
					console.log('Cancel');
				}}
			>
				Cancel
			</button>
			<button
				class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
				on:click={() => {
					console.log('Undo');
				}}
			>
				Undo
			</button>
		{/if}
	</div>
</div>
