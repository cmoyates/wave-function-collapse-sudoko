<script lang="ts">
	type WFCGridCell = {
		x: number;
		y: number;
		value: number | null;
		possibleValues: number[];
	};

	let grid: WFCGridCell[][] = [];

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
</script>

<div class="flex min-h-screen w-full flex-col items-center justify-center space-y-8">
	<div class="flex flex-col items-center justify-center">
		<p class="text-4xl font-thin">Wave Function Collapse</p>
		<p class="text-6xl font-thin">Sudoku</p>
	</div>
	<div class="grid-cols-9 border-b border-r border-black">
		{#each grid as row, y}
			<div class="grid grid-cols-9">
				{#each row as cell, x}
					<!-- <input
						class="w-16 h-16 border-l border-t border-black flex justify-center items-center text-center text-4xl font-thin"
						value={cell === 0 ? '' : cell}
						type="number"
						min="1"
						max="9"
						on:input={(e) => {
							let value = e.currentTarget.value;
							console.log(value.length);
							if (value.length >= 1) {
								const correctedValue = parseInt(value[value.length - 1]);

								console.log(correctedValue);

								grid[y][x] = correctedValue;

								e.currentTarget.value = correctedValue.toString();
							} else if (value.length === 0) {
								grid[y][x] = 0;
								e.currentTarget.value = '';
							}
						}}
					/> -->
					<div
						class="flex h-16 w-16 grid-cols-3 items-center justify-center border-l border-t border-black text-center font-thin"
						style={`display: grid; grid-template-columns: repeat(${Math.ceil(Math.sqrt(cell.possibleValues.length))}, 1fr); font-size: ${Math.ceil(Math.sqrt(cell.possibleValues.length)) === 3 ? 14 : 18}px;`}
					>
						{#each cell.possibleValues as number}
							<div class="flex items-center justify-center">{number}</div>
						{/each}
					</div>
				{/each}
			</div>
		{/each}
	</div>
	<div class="flex flex-row items-center justify-center space-x-4">
		<button class="border border-black px-4 py-1 font-thin">Solve</button>
		<button class="border border-black px-4 py-1 font-thin">Reset</button>
	</div>
</div>
