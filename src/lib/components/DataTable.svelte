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
	$cellSize: 8px;

	table {
		border-spacing: 0px;
		position: relative;

		tbody {
			pointer-events: none;

			tr {
				height: $cellSize;

				td.cell {
					width: $cellSize;
					height: $cellSize;
					aspect-ratio: 1;

					&.on {
						background-color: black;
					}
				}
			}
		}
	}
</style>
