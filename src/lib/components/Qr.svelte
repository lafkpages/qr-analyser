<script lang="ts">
	import type { Qr } from '$lib/qr';

	import { CellType, cellTypeLabels, getCellType } from '$lib/qr';

	import DataTable from './DataTable.svelte';
	import DataTableOverlay from '$components/DataTableOverlay.svelte';
	import QrMask from './QrMask.svelte';
	import QrOverlays from './QrOverlays.svelte';

	export let qr: Qr;

	let cellSize = 0;

	let hoveredCellX: number | null = null;
	let hoveredCellY: number | null = null;
</script>

<div class="qr">
	<DataTable
		lines={qr.lines}
		on:pointermove={(e) => {
			hoveredCellX = Math.floor(e.offsetX / cellSize);
			hoveredCellY = Math.floor(e.offsetY / cellSize);

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
			<DataTableOverlay
				x={hoveredCellX}
				y={hoveredCellY}
				width={1}
				height={1}
				color="magenta"
				class="hovered-cell"
			/>
		{/if}

		<QrOverlays {qr} />
	</DataTable>

	<div class="info">
		<h3>QR info</h3>
		<span>Size: {qr.size}</span>
		<span>Version: {qr.version}</span>
		<span>Raw mask: {qr.rawMaskStr} ({qr.rawMask})</span>
		<span>Mask: {qr.maskStr} ({qr.mask})</span>

		<QrMask mask={qr.mask} />

		{#if hoveredCellX != null && hoveredCellY != null}
			<h3>Cell info</h3>
			<span>X: {hoveredCellX}</span>
			<span>Y: {hoveredCellY}</span>
			<span>Cell type: {cellTypeLabels[getCellType(qr.size, hoveredCellY, hoveredCellX)]}</span>
		{/if}
	</div>

	<div class="key">
		<h3>Color key</h3>

		<ul>
			{#each [['green', cellTypeLabels[CellType.PositionPattern]], ['yellow', cellTypeLabels[CellType.TimingPattern]], ['cyan', 'mask data'], ['orange', 'data encoding'], ['magenta', 'hovered cell']] as [color, label]}
				<li>
					<div style:--color={color} />
					{label}
				</li>
			{/each}
		</ul>
	</div>

	<DataTable lines={qr.unmaskedLines}>
		<QrOverlays {qr} />
	</DataTable>
</div>

<style lang="scss">
	@use '$lib/styles/DataTable' as *;

	div.qr {
		display: flex;
		gap: 12px;

		:global(.data-table) {
			:global(.hovered-cell) {
				opacity: 0.8;
				outline: 2px solid magenta;
			}
		}

		div.info {
			display: flex;
			flex-direction: column;

			h3:first-of-type {
				margin-block-start: 0px;
			}
		}

		div.key {
			h3:first-of-type {
				margin-block-start: 0px;
			}

			ul {
				padding: 0px;

				li {
					display: flex;
					align-items: center;
					gap: 4px;

					div {
						width: $cellSize;
						height: $cellSize;
						aspect-ratio: 1;

						background-color: var(--color);
					}
				}
			}
		}
	}
</style>
