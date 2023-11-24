<script lang="ts">
	import type { Qr } from '$lib/qr';

	import DataTableOverlay from './DataTableOverlay.svelte';

	export let qr: Qr;
</script>

<!-- Mask data -->
<DataTableOverlay x={2} y={8} width={3} color="cyan" />

<!-- Encoding -->
<DataTableOverlay x={qr.size - 2} y={qr.size - 2} width={2} height={2} color="orange" />

<!-- Position patterns -->
<DataTableOverlay x={0} y={0} width={8} height={8} color="green" />
<DataTableOverlay x={qr.size - 8} y={0} width={8} height={8} color="green" />
<DataTableOverlay x={0} y={qr.size - 8} width={8} height={8} color="green" />

<!-- Timing patterns -->
<DataTableOverlay x={6} y={8} height={qr.size - 16} color="yellow" />
<DataTableOverlay x={8} y={6} width={qr.size - 16} color="yellow" />
<DataTableOverlay x={8} y={qr.size - 8} color="yellow" />
