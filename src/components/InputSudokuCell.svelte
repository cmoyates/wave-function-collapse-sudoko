<script lang="ts">
	export let grid: number[][];
	export let x: number;
	export let y: number;
</script>

<input
	class="flex h-16 w-16 items-center justify-center text-center text-4xl font-thin"
	style={`border-left: ${x % 3 === 0 ? 2 : 1}px black solid; border-top: ${y % 3 === 0 ? 2 : 1}px black solid;`}
	value={grid[y][x] === 0 ? '' : grid[y][x]}
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

		console.log(grid);
	}}
/>
