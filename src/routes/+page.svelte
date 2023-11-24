<script lang="ts">
	import type { PageData } from './$types';

	import { tick } from 'svelte';
	import { goto } from '$app/navigation';

	import { parseQr } from '$lib/qr';
	import qrs, { validateQrId } from '$lib/qr/qrs';

	import Qr from '$components/Qr.svelte';
	import QrMasks from '$components/QrMasks.svelte';

	export let data: PageData;

	let qrId = validateQrId(data.qr);
	$: qr = parseQr(qrs[qrId]);
</script>

QR code: <select
	bind:value={qrId}
	on:input={async () => {
		// wait for qrId to update
		await tick();

		await goto(`/?qr=${qrId}`);
	}}
>
	<option value="wikipedia">Wikipedia</option>
	<option value="wifi">WiFi</option>
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
