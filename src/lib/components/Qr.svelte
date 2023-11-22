<script lang="ts">
	import { parseQr, type Qr } from '$lib/qr';

	let rawQr: string | Qr;
	export { rawQr as qr };

	$: qr = parseQr(rawQr);
</script>

<div class="qr">
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
	</table>

	<div class="info">
		<span>Size: {qr.size}</span>
		<span>Version: {qr.version}</span>
		<span>Mask: {qr.maskStr} ({qr.mask})</span>
	</div>
</div>

<style lang="scss">
	div.qr {
		display: flex;
		gap: 12px;

		table {
			border-spacing: 0px;

			td.cell {
				width: 8px;
				height: 8px;
				aspect-ratio: 1;

				&.on {
					background-color: black;
				}
			}
		}

		div.info {
			display: flex;
			flex-direction: column;
		}
	}
</style>
