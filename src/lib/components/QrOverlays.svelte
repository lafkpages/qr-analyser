<script lang="ts">
	import type { Qr } from '$lib/qr';

	import DataTableOverlay from './DataTableOverlay.svelte';

	export let qr: Qr;

	export let selectedColors = ['green', 'yellow', 'cyan', 'orange', 'pink', 'teal', 'magenta'];
</script>

<!-- Mask data -->
{#if selectedColors.includes('cyan')}
	<DataTableOverlay x={2} y={8} width={3} color="cyan" />
{/if}

<!-- Encoding -->
{#if selectedColors.includes('orange')}
	<DataTableOverlay x={qr.size - 2} y={qr.size - 2} width={2} height={2} color="orange" />
{/if}

<!-- Length -->
{#if selectedColors.includes('pink')}
	{#if qr.encoding == 4}
		<DataTableOverlay x={qr.size - 2} y={qr.size - 6} width={2} height={4} color="pink" />
	{/if}
{/if}

<!-- Position patterns -->
{#if selectedColors.includes('green')}
	<DataTableOverlay x={0} y={0} width={8} height={8} color="green" />
	<DataTableOverlay x={qr.size - 8} y={0} width={8} height={8} color="green" />
	<DataTableOverlay x={0} y={qr.size - 8} width={8} height={8} color="green" />
{/if}

<!-- Timing patterns -->
{#if selectedColors.includes('yellow')}
	<DataTableOverlay x={6} y={8} height={qr.size - 16} color="yellow" />
	<DataTableOverlay x={8} y={6} width={qr.size - 16} color="yellow" />
	<DataTableOverlay x={8} y={qr.size - 8} color="yellow" />
{/if}
