<script lang="ts">
	import type { Qr as QrType } from '$lib/qr';

	import { CellType, cellTypeLabels } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
	import QrMask from '$components/QrMask.svelte';
	import SizeIndicator from '$components/SizeIndicator.svelte';

	import { cellSize } from '$lib/stores/DataTable';

	export let qr: QrType;

	let hoveredCellX: number | null = null;
	let hoveredCellY: number | null = null;
</script>

<div class="qr">
	<div class="left">
		<Qr {qr} bind:hoveredCellX bind:hoveredCellY />

		<!-- QR encoding -->
		<div class="qr-encoding-indicator" style:--top={qr.size - 2}>
			<SizeIndicator vertical>2</SizeIndicator>
		</div>

		<!-- QR width -->
		<SizeIndicator>
			{qr.size}
		</SizeIndicator>
	</div>

	<div class="middle">
		<div class="info">
			<h3>QR metadata</h3>
			<p>
				<span>Size: {qr.size}</span>
				<br />
				<span>Version: {qr.version}</span>
			</p>
		</div>

		<div class="info">
			<h3>QR mask</h3>
			<p>
				<span>Raw mask: {qr.rawMaskStr} ({qr.rawMask})</span>
				<br />
				<span>Mask: {qr.rawMaskStr} ^ 101 = {qr.maskStr} ({qr.mask})</span>
			</p>
			<p>
				<QrMask mask={qr.mask} />
			</p>
			<p>
				The raw mask bits are bellow the top left position pattern, highlighted in blue. To get the
				actual mask, these bits must be XOR'ed with 101.
			</p>
		</div>

		<div class="info">
			<h3>QR encoding</h3>
			<p>
				<span>Encoding: {qr.encodingStr} ({qr.encoding})</span>
			</p>

			<p>
				The QR encoding is specified in the bottom right corner of the QR code, shown in orange.
			</p>
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

		<div class="info key">
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

	.qr {
		position: relative;
		display: flex;
		gap: 12px;

		.left {
			width: max-content;
			position: relative;
			margin-right: 36px;

			.qr-encoding-indicator {
				position: absolute;
				top: calc(var(--top) * $cellSize);
				left: 100%;
				height: calc(2 * $cellSize);
			}
		}

		.middle {
			display: flex;
			gap: 12px;
			flex-grow: 1;
			flex-wrap: wrap;

			.info {
				display: flex;
				flex-direction: column;
				border: 1px dashed grey;
				padding: 8px;

				h3:first-of-type {
					margin-block-start: 0px;
				}

				:not(h3:first-of-type) {
					margin-block-start: 0px;
				}

				:last-child {
					margin-block-end: 0px;
				}
			}

			.key {
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
							width: MAX($cellSize, 8px);
							height: MAX($cellSize, 8px);
							aspect-ratio: 1;

							background-color: var(--color);
						}
					}
				}
			}
		}
	}

	@media (max-width: 2020px) {
		div.qr {
			flex-direction: column;

			.right {
				position: absolute;
				top: 0px;
				right: 0px;
			}
		}
	}

	@media (max-width: 440px) {
		div.qr {
			.middle {
				flex-direction: column;

				.key {
					margin-left: unset;
				}
			}
		}
	}
</style>
