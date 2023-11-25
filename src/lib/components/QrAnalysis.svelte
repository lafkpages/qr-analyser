<script lang="ts">
	import type { Qr as QrType } from '$lib/qr';

	import { CellType, cellTypeLabels } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
	import QrMask from './QrMask.svelte';

	export let qr: QrType;

	let hoveredCellX: number | null = null;
	let hoveredCellY: number | null = null;
</script>

<div class="qr">
	<div class="left">
		<Qr {qr} bind:hoveredCellX bind:hoveredCellY />
	</div>

	<div class="middle">
		<div class="info">
			<h3>QR metadata</h3>
			<p>
				<span>Size: {qr.size}</span>
				<br />
				<span>Version: {qr.version}</span>
				<br />
				<span>Raw mask: {qr.rawMaskStr} ({qr.rawMask})</span>
			</p>
		</div>

		<div class="info">
			<h3>QR mask</h3>
			<p>
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
					<span>Cell type: {cellTypeLabels[qr.getCellType(hoveredCellX, hoveredCellY)]}</span>
					<br />
					<span>Raw value: {qr.getCell(hoveredCellX, hoveredCellY)}</span>
					<br />
					<span>Unmasked value: {qr.getCell(hoveredCellX, hoveredCellY, true)}</span>
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
	</div>

	<div class="right">
		<Qr {qr} bind:hoveredCellX bind:hoveredCellY unmasked />
	</div>
</div>

<style lang="scss">
	@use '$lib/styles/DataTable' as *;

	div.qr {
		position: relative;
		display: flex;
		gap: 12px;

		.middle {
			display: flex;
			gap: 12px;
			flex-grow: 1;

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
	}

	// If screen is <1000px wide
	@media (max-width: 1000px) {
		div.qr {
			flex-direction: column;

			.right {
				position: absolute;
				top: 0px;
				right: 0px;
			}
		}
	}
</style>
