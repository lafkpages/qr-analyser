<script lang="ts">
	export let vertical = false;
</script>

<div class="cont" class:vertical class:horizontal={!vertical}>
	<div class="size-indicator" />

	<slot />
</div>

<style lang="scss">
	div.cont {
		display: flex;
		align-items: center;
		width: max-content;
		height: max-content;

		.size-indicator {
			border: solid black;
			box-sizing: border-box;

			&::after {
				content: '';
				display: block;
			}
		}

		&.vertical {
			height: 100%;
			flex-direction: row;

			.size-indicator {
				min-width: 8px;
				height: 100%;
				border-width: 1px 1px 1px 0px;
				margin-left: 8px;
				margin-right: 12px;

				&::after {
					width: 8px;
					height: 50%;
					transform: translateX(8px);
					border-bottom: 1px solid black;
					margin-bottom: 50%;
				}
			}
		}

		&.horizontal {
			width: 100%;
			flex-direction: column;

			.size-indicator {
				width: 100%;
				min-height: 8px;
				border-width: 0px 1px 1px 1px;
				margin-top: 8px;
				margin-bottom: 8px;

				&::after {
					width: 50%;
					height: 8px;
					transform: translateY(8px);
					border-right: 1px solid black;
					margin-right: 50%;
				}
			}
		}
	}
</style>
