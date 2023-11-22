<script lang="ts">
	import type { Qr } from '$lib/qr';

	import { onMount } from 'svelte';

	import { CellType, cellTypeLabels, getCellType } from '$lib/qr';

	import DataTable from './DataTable.svelte';
	import QrOverlay from '$components/DataTableOverlay.svelte';

	export let qr: Qr;

	let qrElm: HTMLDivElement;

	let cellSize = 0;

	let hoveredCellX: number | null = null;
	let hoveredCellY: number | null = null;

	onMount(() => {
		cellSize = qrElm.getElementsByTagName('td')[0].clientHeight;
	});
</script>

<div class="qr" style:--cell-size="{cellSize}px" bind:this={qrElm}>
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
			<QrOverlay
				x={hoveredCellX}
				y={hoveredCellY}
				width={1}
				height={1}
				color="magenta"
				class="hovered-cell"
			/>
		{/if}

		<!-- Mask data -->
		<QrOverlay x={2} y={8} width={3} height={1} color="cyan" />

		<!-- Encoding -->
		<QrOverlay x={qr.size - 2} y={qr.size - 2} width={2} height={2} color="orange" />

		<!-- Position patterns -->
		<QrOverlay x={0} y={0} width={8} height={8} color="green" />
		<QrOverlay x={qr.size - 8} y={0} width={8} height={8} color="green" />
		<QrOverlay x={0} y={qr.size - 8} width={8} height={8} color="green" />

		<!-- Timing patterns -->
		<QrOverlay x={6} y={8} width={1} height={qr.size - 16} color="yellow" />
		<QrOverlay x={8} y={6} width={qr.size - 16} height={1} color="yellow" />
		<QrOverlay x={8} y={qr.size - 8} width={1} height={1} color="yellow" />
	</DataTable>

	<div class="info">
		<h3>QR info</h3>
		<span>Size: {qr.size}</span>
		<span>Version: {qr.version}</span>
		<span>Mask: {qr.maskStr} ({qr.mask})</span>

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
</div>

<style lang="scss">
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
						width: var(--cell-size);
						height: var(--cell-size);
						aspect-ratio: 1;

						background-color: var(--color);
					}
				}
			}
		}
	}
</style>
