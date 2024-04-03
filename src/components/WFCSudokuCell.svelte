<script lang="ts">
	import type { WFCGridCell } from '$lib/wfc';

	export let cell: WFCGridCell;
	export let solverRunning: boolean;

	export let setBaseGridValue: (x: number, y: number, value: number) => void;
</script>

{#if cell.value === null}
	<div
		class="flex h-16 w-16 items-center justify-center border-l border-t border-black text-center font-thin"
		style={`display: grid; grid-template-columns: repeat(${Math.ceil(Math.sqrt(cell.possibleValues.length))}, 1fr); font-size: ${Math.ceil(Math.sqrt(cell.possibleValues.length)) === 3 ? 14 : 18}px; border-left: ${cell.x % 3 === 0 ? 2 : 1}px black solid; border-top: ${cell.y % 3 === 0 ? 2 : 1}px black solid;`}
	>
		{#each cell.possibleValues as number}
			<button
				class="flex items-center justify-center"
				disabled={solverRunning}
				on:click={() => {
					setBaseGridValue(cell.x, cell.y, number);
				}}
			>
				{number}
			</button>
		{/each}
	</div>
{:else}
	<div
		class="flex h-16 w-16 items-center justify-center border-l border-t border-black text-center text-4xl font-thin"
		style={`border-left: ${cell.x % 3 === 0 ? 2 : 1}px black solid; border-top: ${cell.y % 3 === 0 ? 2 : 1}px black solid;`}
	>
		{cell.value || cell.possibleValues[0]}
	</div>
{/if}
