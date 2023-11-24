<script lang="ts">
	import { onMount } from 'svelte';

	export let lines: string[];

	let tbody: HTMLElement;

	onMount(() => {
		if (document.body.classList.contains('data-table-mounted')) {
			return;
		}

		document.body.classList.add('data-table-mounted');

		const s = document.createElement('style');
		s.textContent = `body {
      --cell-size: ${tbody.getElementsByTagName('td')[0].clientWidth}px;
    }`;
		document.head.appendChild(s);
	});
</script>

<table class="data-table" on:pointermove on:pointerleave>
	<tbody bind:this={tbody}>
		{#each lines as line, lineIndex (lineIndex)}
			<tr>
				{#each line as cell, cellIndex (cellIndex)}
					<td class="cell" class:on={cell == '1'} />
				{/each}
			</tr>
		{/each}
	</tbody>

	<slot />
</table>

<style lang="scss">
	$cellSize: 8px;

	table {
		border-spacing: 0px;
		position: relative;
		width: max-content;
		height: max-content;

		tbody {
			pointer-events: none;

			tr {
				td.cell {
					width: $cellSize;
					height: $cellSize;
					aspect-ratio: 1;
					padding: 0px;

					&.on {
						background-color: black;
					}
				}
			}
		}
	}
</style>
