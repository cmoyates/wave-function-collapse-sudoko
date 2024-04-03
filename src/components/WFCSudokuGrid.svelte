<script lang="ts">
	import type { WFCGridCell } from '$lib/wfc';
	import WfcSudokuCell from './WFCSudokuCell.svelte';

	export let workingGrid: WFCGridCell[][];
	export let solverRunning: boolean;

	export let setBaseGridValue: (x: number, y: number, value: number) => void;
</script>

<div class="grid-cols-9 border-b-2 border-r-2 border-black">
	{#each workingGrid as row}
		<div class="grid grid-cols-9">
			{#each row as cell}
				<WfcSudokuCell {cell} {solverRunning} {setBaseGridValue} />
			{/each}
		</div>
	{/each}
</div>
