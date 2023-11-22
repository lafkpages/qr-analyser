<script lang="ts">
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;

	export let color = 'red';
</script>

<div
	class="overlay"
	style:--x={x}
	style:--y={y}
	style:--width={width}
	style:--height={height}
	style:--color={color}
/>

<style lang="scss">
	div.overlay {
		position: absolute;
		top: calc(var(--y) * var(--cell-size));
		left: calc(var(--x) * var(--cell-size));
		width: calc(var(--width) * var(--cell-size));
		height: calc(var(--height) * var(--cell-size));

		background-color: var(--color);
		opacity: 0.5;

		&:hover {
			opacity: 1;
			transform: scale(1.2);
		}
	}
</style>
