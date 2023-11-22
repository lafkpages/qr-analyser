<script lang="ts">
	import { qrs, parseQr } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
	import QrMask from '$components/QrMask.svelte';

	let qr = parseQr(qrs.wikipedia);
</script>

<Qr {qr} />

<h2>Masks</h2>
<div class="masks">
	{#each { length: 8 } as _, mask}
		<div class="mask">
			<h4>Mask {mask.toString(2).padStart(3, '0')}</h4>
			<QrMask {mask} />
		</div>
	{/each}
</div>

<h2>Sources</h2>
<ul>
	<li>
		<a href="https://i.stack.imgur.com/N4RFU.png" target="_blank" rel="noopener noreferrer">
			QR code masks
		</a>
	</li>
	<li>
		<a
			href="https://blog.qartis.com/decoding-small-qr-codes-by-hand/"
			target="_blank"
			rel="noopener noreferrer"
		>
			Decoding small QR codes by hand
		</a>
	</li>
	<li>
		<a href="https://en.wikipedia.org/wiki/QR_code" target="_blank" rel="noopener noreferrer">
			QR code - Wikipedia
		</a>
	</li>
</ul>

<style lang="scss">
	.masks {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		.mask {
			display: flex;
			flex-direction: column;
			align-items: center;

			h4 {
				margin-block-start: 0px;
				margin-block-end: 0px;
			}

			:global(.data-table) {
				border: 1px solid black;
			}
		}
	}
</style>
