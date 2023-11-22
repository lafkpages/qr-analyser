<script lang="ts">
	import QrMask from './QrMask.svelte';
</script>

<div class="masks">
	{#each { length: 8 } as _, mask}
		<div class="mask">
			<h4>Mask {mask.toString(2).padStart(3, '0')}</h4>
			<QrMask {mask} />
		</div>
	{/each}
</div>

<style lang="scss">
	.masks {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;

		.mask {
			display: flex;
			flex-direction: column;
			align-items: center;

			h4 {
				margin-block-start: 0px;
				margin-block-end: 0px;
			}

			:global(.data-table) {
				border: 1px solid black;
			}
		}
	}
</style>
