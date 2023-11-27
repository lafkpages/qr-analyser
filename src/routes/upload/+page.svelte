<script lang="ts">
	import type { Vector, Point } from '$lib/math';

	import { onMount } from 'svelte';

	import { scaleVector, addVectors, xyObjectToPoint } from '$lib/math';

	import DataTable from '$components/DataTable.svelte';

	import jsqr from 'jsqr';
	import { intersect } from 'mathjs';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	// load and draw image
	let image: HTMLImageElement | null = null;

	let qrLines: string[] = [];
	$: qrFile = qrLines
		.join('\n')
		.replace(/([01])/g, '$1$1')
		.replace(/00/g, '  ')
		.replace(/11/g, '##');

	onMount(() => {
		ctx = canvas.getContext('2d');

		if (!ctx) {
			return;
		}

		ctx.imageSmoothingEnabled = false;
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
			window.qr = qr;

			if (!qr) {
				return;
			}

			/**
			 * The QR code size in QR modules.
			 */
			const qrSize = 4 * qr.version + 17;

			/**
			 * Vectors for each side of the QR code, divided to be the size of one QR module.
			 *
			 * ```
			 * • -------> •
			 * |          |
			 * |          |
			 * |          |
			 * \/         \/
			 * • -------> •
			 * ```
			 */
			const qrSidesVectors = {
				top: <Vector>[
					qr.location.topRightCorner.x - qr.location.topLeftCorner.x,
					qr.location.topRightCorner.y - qr.location.topLeftCorner.y
				],
				right: <Vector>[
					qr.location.bottomRightCorner.x - qr.location.topRightCorner.x,
					qr.location.bottomRightCorner.y - qr.location.topRightCorner.y
				],
				bottom: <Vector>[
					qr.location.bottomRightCorner.x - qr.location.bottomLeftCorner.x,
					qr.location.bottomRightCorner.y - qr.location.bottomLeftCorner.y
				],
				left: <Vector>[
					qr.location.bottomRightCorner.x - qr.location.topRightCorner.x,
					qr.location.bottomRightCorner.y - qr.location.topRightCorner.y
				]
			};
			console.log({ qrSidesVectors });

			qrLines.length = 0;

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

			// Draw/get QR code lines
			ctx.strokeStyle = '';
			ctx.setLineDash([]);
			ctx.fillStyle = 'magenta';
			for (let y = 0; y < qrSize; y++) {
				let line = '';

				const pointLeft = addVectors(
					scaleVector(qrSidesVectors.left, (y + 0.5) / qrSize),
					xyObjectToPoint(qr.location.topLeftCorner)
				);
				const pointRight = addVectors(
					scaleVector(qrSidesVectors.right, (y + 0.5) / qrSize),
					xyObjectToPoint(qr.location.topRightCorner)
				);

				for (let x = 0; x < qrSize; x++) {
					const pointTop = addVectors(
						scaleVector(qrSidesVectors.top, (x + 0.5) / qrSize),
						xyObjectToPoint(qr.location.topLeftCorner)
					);
					const pointBottom = addVectors(
						scaleVector(qrSidesVectors.bottom, (x + 0.5) / qrSize),
						xyObjectToPoint(qr.location.bottomLeftCorner)
					);

					const intersection = intersect(pointLeft, pointRight, pointTop, pointBottom) as Point;

					const cellIsFilled =
						data.data[
							Math.floor(intersection[1]) * data.width * 4 + Math.floor(intersection[0]) * 4
						] < 128;
					line += cellIsFilled ? '1' : '0';

					ctx.fillStyle = cellIsFilled ? 'magenta' : 'cyan';
					ctx.fillRect(intersection[0], intersection[1], 1, 1);
				}

				qrLines.push(line);
			}

			image = image;
			qrLines = qrLines;
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

{#if qrFile}
	<a href="/?qr=custom&qrData={encodeURIComponent(qrFile)}">Analyse QR</a>
{/if}

<style lang="scss">
	canvas {
		border: 1px dashed black;

		max-width: 100%;
		max-height: 80svh;
	}
</style>
