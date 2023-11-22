<script lang="ts">
	import { qrs, parseQr } from '$lib/qr';

	import Qr from '$components/Qr.svelte';

	let qr = parseQr(qrs.wikipedia);
</script>

<Qr {qr} />

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
