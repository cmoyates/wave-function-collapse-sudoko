<script lang="ts">
	import { onDestroy } from 'svelte';

	type WFCGridCell = {
		x: number;
		y: number;
		value: number | null;
		possibleValues: number[];
	};

	let grid: WFCGridCell[][] = [];

	let interval: number;

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
				reset();
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

	const reset = () => {
		clearInterval(interval);

		for (let y = 0; y < grid.length; y++) {
			for (let x = 0; x < grid[y].length; x++) {
				grid[y][x].value = null;
				grid[y][x].possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
			}
		}
	};

	onDestroy(() => {
		clearInterval(interval);
	});
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center space-y-8">
	<div class="flex flex-col items-center justify-center">
		<p class="text-4xl font-thin">Wave Function Collapse</p>
		<p class="text-6xl font-thin">Sudoku</p>
	</div>
	<div class="grid-cols-9 border-b border-r border-black">
		{#each grid as row}
			<div class="grid grid-cols-9">
				{#each row as cell}
					{#if cell.value === null}
						<div
							class="flex h-16 w-16 items-center justify-center border-l border-t border-black text-center font-thin"
							style={`display: grid; grid-template-columns: repeat(${Math.ceil(Math.sqrt(cell.possibleValues.length))}, 1fr); font-size: ${Math.ceil(Math.sqrt(cell.possibleValues.length)) === 3 ? 14 : 18}px;`}
						>
							{#each cell.possibleValues as number}
								<button
									class="flex items-center justify-center"
									on:click={() => {
										setValue(cell, number);
									}}
								>
									{number}
								</button>
							{/each}
						</div>
					{:else}
						<div
							class="flex h-16 w-16 items-center justify-center border-l border-t border-black text-center text-4xl font-thin"
						>
							{cell.value || cell.possibleValues[0]}
						</div>
					{/if}
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-row items-center justify-center space-x-4">
		<button
			class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
			on:click={solve}
		>
			Solve
		</button>
		<button
			class="rounded border border-black px-4 py-1 font-thin hover:bg-black hover:font-extralight hover:text-white"
			on:click={reset}
		>
			Reset
		</button>
	</div>
</div>
