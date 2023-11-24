<script lang="ts">
	export let lines: string[];
</script>

<table class="data-table" on:pointermove on:pointerleave>
	<tbody>
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
	@use '$lib/styles/DataTable' as *;

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
