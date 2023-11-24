import qrs, { qrIds } from './qrs';
import { masks } from './masks';

export { qrs, qrIds };

export function parseQr(qr: string | Qr) {
	if (typeof qr == 'string') {
		return new Qr(qr);
	}

	return qr;
}

export enum CellType {
	PositionPattern,
	AlignmentPattern,
	TimingPattern,
	FormatInfo,
	Data
}

export const cellTypeLabels = [
	'position pattern',
	'alignment pattern',
	'timing pattern',
	'format info',
	'data'
];

export function getCellType(qrSize: number, row: number, col: number) {
	if (
		/* Top left */ (row < 8 && col < 8) ||
		/* Top right */ (row < 8 && col >= qrSize - 8) ||
		/* Bottom left */ (row >= qrSize - 8 && col < 8)
	) {
		return CellType.PositionPattern;
	}

	if (
		(row == 6 && col >= 8 && col <= qrSize - 9) ||
		(row >= 8 && row <= qrSize - 8 && col == 6) ||
		(row == qrSize - 8 && col == 8)
	) {
		return CellType.TimingPattern;
	}

	// TODO: Alignment patterns

	if (
		(row == 8 && col <= 8) ||
		(row <= 8 && col == 8) ||
		(row == 8 && col >= qrSize - 8) ||
		(row >= qrSize - 8 && col == 8)
	) {
		return CellType.FormatInfo;
	}

	return CellType.Data;
}

export class Qr {
	lines: string[];

	constructor(rawQr: string) {
		// Remove leading/trailing whitespace
		rawQr = rawQr.trim();

		// Replace any non-whitespace characters with a 1
		rawQr = rawQr.replace(/\S/g, '1');

		// Replace any spaces with a 0
		rawQr = rawQr.replace(/ /g, '0');

		// In .qr files, each pixel is represented by two characters
		// so it looks better in the editor.
		// First, we remove those duplicate characters.
		rawQr = rawQr.replace(/([01]){2}/g, '$1');

		// Then, split lines
		this.lines = rawQr.split(/\r?\n/);

		// Make sure all lines are the same length
		for (let i in this.lines) {
			if (this.lines[i].length < this.size) {
				this.lines[i] += ' '.repeat(this.size - this.lines[i].length);
			}
		}
	}

	/**
	 * The raw QR code mask bits.
	 * @example "100"
	 * @see Qr.rawMask
	 */
	get rawMaskStr() {
		return this.lines[8].substring(2, 5);
	}

	/**
	 * The raw QR code mask bits as a number.
	 * @example 4
	 * @see Qr.rawMaskStr
	 */
	get rawMask() {
		return parseInt(this.rawMaskStr, 2);
	}

	/**
	 * The mask used to generate the QR code.
	 * @example 1
	 * @see Qr.maskStr
	 */
	get mask() {
		return this.rawMask ^ 5;
		// XOR with 101
	}

	/**
	 * The mask used to generate the QR code as a string of bits.
	 * @example "001"
	 * @see Qr.mask
	 */
	get maskStr() {
		return this.mask.toString(2).padStart(3, '0');
	}

	/**
	 * The width of the QR code.
	 */
	get size() {
		return this.lines[0].length;
	}

	get version() {
		return (this.size - 17) / 4;
	}

	[Symbol.iterator]() {
		let index = -1;
		const lines = this.lines;

		return {
			next: () => ({ value: lines[++index], done: !(index in lines) })
		};
	}

	get unmaskedLines() {
		const unmaskedLines = [];

		for (const _y in this.lines) {
			const y = parseInt(_y);

			const line = this.lines[y];

			// Line 7 is all position/timing patterns
			if (y == 6) {
				unmaskedLines.push(line);
				continue;
			}

			let unmaskedLine = '';
			for (let x = 0; x < line.length; x++) {
				const cellType = getCellType(this.size, y, x);

				// Only unmask data cells
				if (cellType == CellType.Data) {
					unmaskedLine += masks[this.mask](x, y) ? (line[x] == '1' ? '0' : '1') : line[x];
				} else {
					unmaskedLine += line[x];
				}
			}

			unmaskedLines.push(unmaskedLine);
		}

		return unmaskedLines;
	}
}
