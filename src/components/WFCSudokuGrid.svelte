<script lang="ts">
	import type { WFCGridCell } from '$lib/wfc';
	import WfcSudokuCell from './WFCSudokuCell.svelte';

	export let workingGrid: WFCGridCell[][];
</script>

<div class="grid-cols-9 border-b-2 border-r-2 border-black">
	{#each workingGrid as row}
		<div class="grid grid-cols-9">
			{#each row as cell}
				<WfcSudokuCell {cell} />
			{/each}
		</div>
	{/each}
</div>
