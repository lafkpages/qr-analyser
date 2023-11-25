<div>
	<div class="size-indicator" />

	<slot />
</div>

<style lang="scss">
	div {
		display: flex;
		flex-direction: column;
		align-items: center;

		.size-indicator {
			width: 100%;
			min-height: 8px;
			border: solid black;
			border-width: 0px 1px 1px 1px;
			margin-top: 8px;
			margin-bottom: 8px;
			box-sizing: border-box;

			&::after {
				width: 50%;
				height: 8px;
				content: '';
				display: block;
				transform: translateY(8px);
				border-right: 1px solid black;
				margin-right: 50%;
			}
		}
	}
</style>
