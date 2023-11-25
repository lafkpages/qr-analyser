<script lang="ts">
	import type { Qr } from '$lib/qr';

	import { CellType } from '$lib/qr';
	import { masks } from '$lib/qr/masks';

	import { cellSize } from '$lib/stores/DataTable';

	import DataTable from '$components/DataTable.svelte';
	import DataTableOverlay from '$components/DataTableOverlay.svelte';
	import QrOverlays from '$components/QrOverlays.svelte';

	export let qr: Qr;
	export let unmasked = false;

	export let hoveredCellX: number | null = null;
	export let hoveredCellY: number | null = null;

	export let selectedColors: string[];

	let container: HTMLDivElement;

	function handlePointerMove(e: PointerEvent | TouchEvent) {
		let x: number, y: number;
		if ('touches' in e) {
			x = e.touches[0].clientX - container.offsetLeft;
			y = e.touches[0].clientY - container.offsetTop;

			e.preventDefault();
		} else {
			x = e.offsetX;
			y = e.offsetY;
		}

		hoveredCellX = Math.floor(x / $cellSize);
		hoveredCellY = Math.floor(y / $cellSize);

		if (hoveredCellX >= qr.size || hoveredCellY >= qr.size) {
			hoveredCellX = null;
			hoveredCellY = null;
		}
	}

	function handlePointerLeave() {
		hoveredCellX = null;
		hoveredCellY = null;
	}
</script>

<div bind:this={container}>
	<DataTable
		lines={unmasked ? qr.unmaskedLines : qr.lines}
		on:pointermove={handlePointerMove}
		on:touchmove={handlePointerMove}
		on:pointerleave={handlePointerLeave}
		on:touchend={handlePointerLeave}
	>
		<!-- Hovered cell -->
		{#if (selectedColors?.includes('magenta') ?? true) && hoveredCellX != null && hoveredCellY != null}
			<DataTableOverlay x={hoveredCellX} y={hoveredCellY} color="magenta" opacity={0.8} outlined />
		{/if}

		<QrOverlays {qr} bind:selectedColors />

		{#if (selectedColors?.includes('teal') ?? true) && unmasked}
			<!-- Mask overlay -->
			{#each { length: qr.size } as _, y}
				{#each { length: qr.size } as _, x}
					{#if qr.getCellType(x, y) == CellType.Data && masks[qr.mask](x, y)}
						<DataTableOverlay {x} {y} color="teal" opacity={0.3} />
					{/if}
				{/each}
			{/each}
		{/if}
	</DataTable>
</div>

<style lang="scss">
	div {
		width: max-content;
		height: max-content;

		cursor: crosshair;
	}
</style>
