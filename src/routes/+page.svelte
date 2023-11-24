<script lang="ts">
	import { qrs, parseQr } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
	import QrMasks from '$components/QrMasks.svelte';

	let qrId: keyof typeof qrs = 'wikipedia';
	$: qr = parseQr(qrs[qrId]);
</script>

QR code: <select bind:value={qrId}>
	<option value="wikipedia">Wikipedia</option>
</select>

<hr />

<Qr {qr} />

<h2>Masks</h2>
<QrMasks />

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
