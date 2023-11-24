<script lang="ts">
	import type { Qr as QrType } from '$lib/qr';

	import { CellType, cellTypeLabels, getCellType } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
	import QrMask from './QrMask.svelte';

	export let qr: QrType;

	let hoveredCellX: number | null = null;
	let hoveredCellY: number | null = null;
</script>

<div class="qr">
	<Qr {qr} bind:hoveredCellX bind:hoveredCellY />

	<div class="info">
		<h3>QR info</h3>
		<p>
			<span>Size: {qr.size}</span>
			<br />
			<span>Version: {qr.version}</span>
			<br />
			<span>Raw mask: {qr.rawMaskStr} ({qr.rawMask})</span>
			<br />
			<span>Mask: {qr.maskStr} ({qr.mask})</span>
		</p>

		<QrMask mask={qr.mask} />
	</div>

	<div class="info">
		<h3>Cell info</h3>
		<p>
			{#if hoveredCellX != null && hoveredCellY != null}
				<span>X: {hoveredCellX}</span>
				<br />
				<span>Y: {hoveredCellY}</span>
				<br />
				<span>Cell type: {cellTypeLabels[getCellType(qr.size, hoveredCellY, hoveredCellX)]}</span>
			{:else}
				Hover over a cell to see its info.
			{/if}
		</p>
	</div>

	<div class="key">
		<h3>Color key</h3>

		<ul>
			{#each [['green', cellTypeLabels[CellType.PositionPattern]], ['yellow', cellTypeLabels[CellType.TimingPattern]], ['cyan', 'mask data'], ['orange', 'data encoding'], ['teal', 'inverted cell'], ['magenta', 'hovered cell']] as [color, label]}
				<li>
					<div style:--color={color} />
					{label}
				</li>
			{/each}
		</ul>
	</div>

	<Qr {qr} bind:hoveredCellX bind:hoveredCellY unmasked />
</div>

<style lang="scss">
	@use '$lib/styles/DataTable' as *;

	div.qr {
		display: flex;
		gap: 12px;

		div.info {
			display: flex;
			flex-direction: column;

			h3:first-of-type {
				margin-block-start: 0px;
			}

			p {
				margin-block-start: 0px;
			}
		}

		div.key {
			margin-left: auto;

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
