<script lang="ts">
	import type { Qr } from '$lib/qr';

	import { onMount } from 'svelte';

	import { cellTypeLabels, getCellType } from '$lib/qr';

	import QrOverlay from '$components/QrOverlay.svelte';

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
	<table>
		<tbody
			on:pointerleave={() => {
				hoveredCellX = null;
				hoveredCellY = null;
			}}
		>
			{#each qr as line, lineIndex}
				<tr>
					{#each line as cell, cellIndex}
						<td
							class="cell"
							class:on={cell == '1'}
							on:pointerover={() => {
								hoveredCellX = cellIndex;
								hoveredCellY = lineIndex;
							}}
						/>
					{/each}
				</tr>
			{/each}
		</tbody>

		<QrOverlay x={2} y={8} width={3} height={1} />
		<QrOverlay x={qr.size - 2} y={qr.size - 2} width={2} height={2} />

		<!-- Position patterns -->
		<QrOverlay x={0} y={0} width={8} height={8} color="green" />
		<QrOverlay x={qr.size - 8} y={0} width={8} height={8} color="green" />
		<QrOverlay x={0} y={qr.size - 8} width={8} height={8} color="green" />
	</table>

	<div class="info">
		<h3>QR info</h3>
		<span>Size: {qr.size}</span>
		<span>Version: {qr.version}</span>
		<span>Mask: {qr.maskStr} ({qr.mask})</span>

		{#if hoveredCellX != null && hoveredCellY != null}
			<h3>Cell info</h3>
			<span>Cell type: {cellTypeLabels[getCellType(qr.size, hoveredCellY, hoveredCellX)]}</span>
		{/if}
	</div>
</div>

<style lang="scss">
	div.qr {
		$cellSize: 8px;

		display: flex;
		gap: 12px;

		table {
			border-spacing: 0px;
			position: relative;

			tr {
				height: $cellSize;

				td.cell {
					width: $cellSize;
					height: $cellSize;
					aspect-ratio: 1;

					&.on {
						background-color: black;
					}
				}
			}
		}

		div.info {
			display: flex;
			flex-direction: column;
		}
	}
</style>
