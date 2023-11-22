<script lang="ts">
	import { masks } from '$lib/qr/masks';

	import DataTable from './DataTable.svelte';

	export let mask: number;

	$: lines = new Array(6).fill(0).map((_, y) =>
		new Array(6)
			.fill(0)
			.map((_, x) => (masks[mask](x, y) ? '1' : '0'))
			.join('')
	);

	$: console.log(lines);
</script>

<DataTable {lines} />
