<script lang="ts">
	import { qrs, parseQr } from '$lib/qr';

	import Qr from '$components/Qr.svelte';

	let qr = parseQr(qrs.wikipedia);
</script>

<Qr {qr} />
