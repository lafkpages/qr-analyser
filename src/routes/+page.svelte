<script lang="ts">
	import { qrs } from '$lib/qr';

	import Qr from '$components/Qr.svelte';
</script>

<Qr qr={qrs.wikipedia} />
