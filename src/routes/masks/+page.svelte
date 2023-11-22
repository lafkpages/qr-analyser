<script lang="ts">
	import type { PageData } from '../$types';

	import QrMasks from '$components/QrMasks.svelte';

	export let data: PageData;
</script>

<QrMasks width={data.width} height={data.height} />
