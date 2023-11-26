<script lang="ts">
	import { onMount } from 'svelte';

	import DataTable from '$components/DataTable.svelte';

	import {
		degreesBetweenTwoLines,
		distance,
		getPointFromPointAngleAndDistance
	} from '$lib/geometry';

	import jsqr from 'jsqr';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	// load and draw image
	let image: HTMLImageElement | null = null;

	let qrLines: string[] = [];

	onMount(() => {
		ctx = canvas.getContext('2d');

		if (!ctx) {
			return;
		}

		ctx.save();

		image = new Image();
		image.onload = async () => {
			if (!ctx || !image) {
				return;
			}

			// restore canvas state
			ctx.restore();

			// resize canvas to fit image
			canvas.width = image.width;
			canvas.height = image.height;

			// draw image
			ctx.drawImage(image, 0, 0);

			// revoke image URL to free memory
			URL.revokeObjectURL(image.src);

			// get image data
			const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

			// read QR code
			const qr = jsqr(data.data, data.width, data.height);

			console.debug(qr);

			if (!qr) {
				return;
			}

			/**
			 * The width of the QR code's sides
			 */
			const qrSides = {
				top: distance(qr.location.topLeftCorner, qr.location.topRightCorner),
				right: distance(qr.location.topRightCorner, qr.location.bottomRightCorner),
				bottom: distance(qr.location.bottomRightCorner, qr.location.bottomLeftCorner),
				left: distance(qr.location.bottomLeftCorner, qr.location.topLeftCorner)
			};

			const qrTopLeftAngle = degreesBetweenTwoLines(
				[qr.location.topLeftCorner, qr.location.topRightCorner],
				[qr.location.topLeftCorner, qr.location.bottomLeftCorner]
			);
			const qrTopRightAngle = degreesBetweenTwoLines(
				[qr.location.topLeftCorner, qr.location.topRightCorner],
				[qr.location.topRightCorner, qr.location.bottomRightCorner]
			);
			const qrTopAngle = degreesBetweenTwoLines(
				[qr.location.topLeftCorner, qr.location.topRightCorner],
				[
					qr.location.topLeftCorner,
					{ x: qr.location.topRightCorner.x, y: qr.location.topLeftCorner.y }
				]
			);
			console.debug(qrTopLeftAngle, qrTopRightAngle);

			/**
			 * The QR code size in QR modules.
			 */
			const qrSize = 4 * qr.version + 17;

			/**
			 * The size of each QR code cell in pixels.
			 * May be different for each side if the QR code is skewed.
			 */
			const qrCellSizes = {
				top: qrSides.top / qrSize,
				right: qrSides.right / qrSize,
				bottom: qrSides.bottom / qrSize,
				left: qrSides.left / qrSize
			};

			// Draw QR code bounds
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 1;
			ctx.setLineDash([5, 5]);
			ctx.beginPath();
			ctx.moveTo(qr.location.topLeftCorner.x, qr.location.topLeftCorner.y);
			ctx.lineTo(qr.location.topRightCorner.x, qr.location.topRightCorner.y);
			ctx.lineTo(qr.location.bottomRightCorner.x, qr.location.bottomRightCorner.y);
			ctx.lineTo(qr.location.bottomLeftCorner.x, qr.location.bottomLeftCorner.y);
			ctx.lineTo(qr.location.topLeftCorner.x, qr.location.topLeftCorner.y);
			ctx.stroke();

			// Draw QR code lines
			ctx.strokeStyle = 'blue';
			for (let y = 0; y < qrSize; y++) {
				const from = getPointFromPointAngleAndDistance(
					qr.location.topLeftCorner,
					qrTopLeftAngle - qrTopAngle,
					y * qrCellSizes.left
				);

				const to = getPointFromPointAngleAndDistance(
					qr.location.topRightCorner,
					qrTopRightAngle - qrTopAngle,
					y * qrCellSizes.right
				);

				ctx.beginPath();
				ctx.moveTo(from.x, from.y);
				ctx.lineTo(to.x, to.y);
				ctx.stroke();
			}

			image = image;
		};
	});
</script>

<p>Upload an image containing a QR code.</p>

<input
	type="file"
	accept="image/*"
	on:input={(e) => {
		if (!image || !(e.target instanceof HTMLInputElement)) {
			return;
		}

		const file = e.target.files?.[0];

		if (!file) {
			return;
		}

		image.src = URL.createObjectURL(file);
	}}
/>

<hr />

<canvas bind:this={canvas} />

<br />

<DataTable lines={qrLines} />

<style lang="scss">
	canvas {
		border: 1px dashed black;

		max-width: 100%;
		max-height: 80svh;
	}
</style>
