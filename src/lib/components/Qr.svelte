<script lang="ts">
	import { parseQr, type Qr } from '$lib/qr';
	import { onMount } from 'svelte';

	import QrOverlay from '$components/QrOverlay.svelte';

	let rawQr: string | Qr;
	export { rawQr as qr };

	$: qr = parseQr(rawQr);

	let qrElm: HTMLDivElement;

	let cellSize = 0;

	onMount(() => {
		cellSize = qrElm.getElementsByTagName('td')[0].clientHeight;
	});
</script>

<div class="qr" style:--cell-size="{cellSize}px" bind:this={qrElm}>
	<table>
		<tbody>
			{#each qr as line, lineIndex}
				<tr>
					{#each line as cell}
						<td class="cell" class:on={cell == '1'} />
					{/each}
				</tr>
			{/each}
		</tbody>

		<QrOverlay x={2} y={8} width={3} height={1} />
		<QrOverlay x={qr.size - 2} y={qr.size - 2} width={2} height={2} />
	</table>

	<div class="info">
		<span>Size: {qr.size}</span>
		<span>Version: {qr.version}</span>
		<span>Mask: {qr.maskStr} ({qr.mask})</span>
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
