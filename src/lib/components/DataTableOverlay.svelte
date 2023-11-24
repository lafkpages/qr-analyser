<script lang="ts">
	export let x: number;
	export let y: number;
	export let width = 1;
	export let height = 1;

	export let color = 'red';
	export let opacity = 0.5;
	export let outlined = false;

	let class_ = '';
	export { class_ as class };
</script>

<div
	class="overlay {class_}"
	class:outlined
	style:--x={x}
	style:--y={y}
	style:--width={width}
	style:--height={height}
	style:--color={color}
	style:--opacity={opacity}
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
		opacity: var(--opacity);

		&.outlined {
			outline: 2px solid var(--color);
		}

		&:hover {
			$hoverSize: 2px;

			padding: $hoverSize;
			margin-top: calc(-1 * $hoverSize);
			margin-left: calc(-1 * $hoverSize);

			z-index: 3;
		}
	}
</style>
