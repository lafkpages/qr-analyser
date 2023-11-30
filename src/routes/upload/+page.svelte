<script lang="ts">
	import type { Vector, Point } from '$lib/math';
	import type { QRCode } from 'jsqr';

	import { onMount } from 'svelte';

	import { scaleVector, addVectors, xyObjectToPoint } from '$lib/math';

	import DataTable from '$components/DataTable.svelte';

	import jsqr from 'jsqr';
	import { intersect } from 'mathjs';

	let canvas: HTMLCanvasElement;
	let ctx: CanvasRenderingContext2D | null = null;

	// load and draw image
	let image: HTMLImageElement | null = null;

	let qr: QRCode | null = null;
	$: qrCorners = qr
		? {
				topLeft: qr.location.topLeftCorner,
				topRight: qr.location.topRightCorner,
				bottomLeft: qr.location.bottomLeftCorner,
				bottomRight: qr.location.bottomRightCorner
		  }
		: null;
	let qrCornerDragging: null | keyof NonNullable<typeof qrCorners> = null;

	// Redraw when corners change
	$: {
		qrCorners;
		draw(false);
	}

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
		image.onload = () => {
			draw(true);
		};
	});

	function draw(end: boolean) {
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
		const data = end ? ctx.getImageData(0, 0, canvas.width, canvas.height) : null;

		qrLines.length = 0;

		// read QR code
		if (end && data) {
			qr = jsqr(data.data, data.width, data.height);
			window.qr = qr;
		}

		// get QR code corners
		if (!qrCorners) {
			qrCorners = qr
				? {
						topLeft: qr.location.topLeftCorner,
						topRight: qr.location.topRightCorner,
						bottomLeft: qr.location.bottomLeftCorner,
						bottomRight: qr.location.bottomRightCorner
				  }
				: {
						topLeft: { x: 100, y: 100 },
						topRight: { x: 200, y: 100 },
						bottomLeft: { x: 100, y: 200 },
						bottomRight: { x: 200, y: 200 }
				  };
		}

		// Draw QR code corners
		ctx.fillStyle = 'red';
		ctx.strokeStyle = '';
		for (const corner of Object.values(qrCorners)) {
			ctx.fillRect(corner.x - 5, corner.y - 5, 10, 10);
		}

		// Draw QR code bounds
		ctx.strokeStyle = 'red';
		ctx.lineWidth = 1;
		ctx.setLineDash([5, 5]);
		ctx.beginPath();
		ctx.moveTo(qrCorners.topLeft.x, qrCorners.topLeft.y);
		ctx.lineTo(qrCorners.topRight.x, qrCorners.topRight.y);
		ctx.lineTo(qrCorners.bottomRight.x, qrCorners.bottomRight.y);
		ctx.lineTo(qrCorners.bottomLeft.x, qrCorners.bottomLeft.y);
		ctx.lineTo(qrCorners.topLeft.x, qrCorners.topLeft.y);
		ctx.stroke();

		// Draw/get QR code lines
		if (end && data && qr) {
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
					qrCorners.topRight.x - qrCorners.topLeft.x,
					qrCorners.topRight.y - qrCorners.topLeft.y
				],
				right: <Vector>[
					qrCorners.bottomRight.x - qrCorners.topRight.x,
					qrCorners.bottomRight.y - qrCorners.topRight.y
				],
				bottom: <Vector>[
					qrCorners.bottomRight.x - qrCorners.bottomLeft.x,
					qrCorners.bottomRight.y - qrCorners.bottomLeft.y
				],
				left: <Vector>[
					qrCorners.bottomRight.x - qrCorners.topRight.x,
					qrCorners.bottomRight.y - qrCorners.topRight.y
				]
			};

			/**
			 * The QR code size in QR modules.
			 */
			const qrSize = 4 * qr.version + 17;

			ctx.strokeStyle = '';
			ctx.setLineDash([]);
			ctx.fillStyle = 'magenta';
			for (let y = 0; y < qrSize; y++) {
				let line = '';

				const pointLeft = addVectors(
					scaleVector(qrSidesVectors.left, (y + 0.5) / qrSize),
					xyObjectToPoint(qrCorners.topLeft)
				);
				const pointRight = addVectors(
					scaleVector(qrSidesVectors.right, (y + 0.5) / qrSize),
					xyObjectToPoint(qrCorners.topRight)
				);

				for (let x = 0; x < qrSize; x++) {
					const pointTop = addVectors(
						scaleVector(qrSidesVectors.top, (x + 0.5) / qrSize),
						xyObjectToPoint(qrCorners.topLeft)
					);
					const pointBottom = addVectors(
						scaleVector(qrSidesVectors.bottom, (x + 0.5) / qrSize),
						xyObjectToPoint(qrCorners.bottomLeft)
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
		}

		image = image;
		qrLines = qrLines;
	}

	function getHoveredCorner(e: PointerEvent) {
		if (!qrCorners) {
			return null;
		}

		let hoveredCorner: null | keyof typeof qrCorners = null;
		for (const [corner, cornerPosition] of Object.entries(qrCorners)) {
			if (
				Math.abs(cornerPosition.x - e.offsetX) < 10 &&
				Math.abs(cornerPosition.y - e.offsetY) < 10
			) {
				hoveredCorner = corner as keyof typeof qrCorners;
				break;
			}
		}

		return hoveredCorner;
	}

	function onPointerDown(e: PointerEvent) {
		const hoveredCorner = getHoveredCorner(e);

		if (!hoveredCorner) {
			return;
		}

		qrCornerDragging = hoveredCorner;

		console.log('Dragging corner', hoveredCorner);
	}

	function onPointerMove(e: PointerEvent) {
		if (!qrCornerDragging || !qrCorners) {
			return;
		}

		console.log('Dragging corner', qrCornerDragging, e.offsetX, e.offsetY);

		qrCorners[qrCornerDragging].x = e.offsetX;
		qrCorners[qrCornerDragging].y = e.offsetY;

		draw(false);
	}

	function onPointerUp(e: PointerEvent) {
		qrCornerDragging = null;

		draw(true);
	}
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

<canvas
	bind:this={canvas}
	on:pointerdown={onPointerDown}
	on:pointermove={onPointerMove}
	on:pointerup={onPointerUp}
/>

<p>
	{#if qrLines.length}
		<DataTable lines={qrLines} />
	{:else}
		No QR code detected.
	{/if}
</p>

{#if qrFile}
	<a href="/?qr=custom&qrData={encodeURIComponent(qrFile)}">Analyse QR</a>
{/if}

<style lang="scss">
	canvas {
		border: 1px dashed black;

		max-width: 100%;
		max-height: 80svh;

		display: block;
	}
</style>
