<script lang="ts">
	import { masks } from '$lib/qr/masks';

	import DataTable from './DataTable.svelte';

	export let mask: number;

	export let width = 6;
	export let height = 6;

	$: lines = new Array(height).fill(0).map((_, y) =>
		new Array(width)
			.fill(0)
			.map((_, x) => (masks[mask](x, y) ? '1' : '0'))
			.join('')
	);
</script>

<div>
	<DataTable {lines} />
</div>

<style lang="scss">
	div {
		border: 1px solid black;
		width: max-content;
		height: max-content;
	}
</style>
