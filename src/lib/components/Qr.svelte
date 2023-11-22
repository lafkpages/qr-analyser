<script lang="ts">
	import { parseQr, type Qr } from '$lib/qr';
	import { onMount } from 'svelte';

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

		<div class="overlay mask" />
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

			div.overlay {
				position: absolute;
				background-color: #ff0000aa;

				&:hover {
					transform: scale(1.2);
				}

				&.mask {
					top: calc(8 * var(--cell-size));
					left: calc(2 * var(--cell-size));
					width: calc(3 * var(--cell-size));
					height: calc(var(--cell-size));
				}
			}
		}

		div.info {
			display: flex;
			flex-direction: column;
		}
	}
</style>
