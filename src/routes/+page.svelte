<script lang="ts">
	import { qrs, parseQr } from '$lib/qr';

	import Qr from '$components/Qr.svelte';

	let qr = parseQr(qrs.wikipedia);
</script>

<Qr {qr} />

<h2>Sources</h2>
<ul>
	<li>
		<a href="https://i.stack.imgur.com/N4RFU.png">QR code masks</a>
	</li>
</ul>
