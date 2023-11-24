<script lang="ts">
	import type { Qr } from '$lib/qr';

	import { getCellType, CellType } from '$lib/qr';
	import { masks } from '$lib/qr/masks';

	import DataTable from '$components/DataTable.svelte';
	import DataTableOverlay from '$components/DataTableOverlay.svelte';
	import QrOverlays from '$components/QrOverlays.svelte';

	export let qr: Qr;
	export let unmasked = false;

	export let hoveredCellX: number | null = null;
	export let hoveredCellY: number | null = null;
</script>

<DataTable
	lines={unmasked ? qr.unmaskedLines : qr.lines}
	on:pointermove={(e) => {
		hoveredCellX = Math.floor(e.offsetX / 8); // 8 = cell size
		hoveredCellY = Math.floor(e.offsetY / 8); // TODO: use $cellSize from SCSS

		if (hoveredCellX >= qr.size || hoveredCellY >= qr.size) {
			hoveredCellX = null;
			hoveredCellY = null;
		}
	}}
	on:pointerleave={() => {
		hoveredCellX = null;
		hoveredCellY = null;
	}}
>
	<!-- Hovered cell -->
	{#if hoveredCellX != null && hoveredCellY != null}
		<DataTableOverlay x={hoveredCellX} y={hoveredCellY} color="magenta" class="hovered-cell" />
	{/if}

	<QrOverlays {qr} />

	{#if unmasked}
		<!-- Mask overlay -->
		{#each { length: qr.size } as _, y}
			{#each { length: qr.size } as _, x}
				{#if getCellType(qr.size, y, x) == CellType.Data && masks[qr.mask](x, y)}
					<DataTableOverlay {x} {y} color="teal" opacity={0.3} />
				{/if}
			{/each}
		{/each}
	{/if}
</DataTable>
