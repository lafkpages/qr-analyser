<script lang="ts">
	export let x: number;
	export let y: number;
	export let width: number;
	export let height: number;

	export let color = 'red';

	let class_ = '';
	export { class_ as class };
</script>

<div
	class="overlay {class_}"
	style:--x={x}
	style:--y={y}
	style:--width={width}
	style:--height={height}
	style:--color={color}
/>

<style lang="scss">
	@use '$lib/styles/DataTable' as *;

	div.overlay {
		position: absolute;
		top: calc(var(--y) * $cellSize);
		left: calc(var(--x) * $cellSize);
		width: calc(var(--width) * $cellSize);
		height: calc(var(--height) * $cellSize);
		z-index: 2;
		pointer-events: none;

		background-color: var(--color);
		opacity: 0.5;

		&:hover {
			$hoverSize: 2px;

			padding: $hoverSize;
			margin-top: calc(-1 * $hoverSize);
			margin-left: calc(-1 * $hoverSize);

			z-index: 3;
		}
	}
</style>
