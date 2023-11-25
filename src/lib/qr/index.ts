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

	getCellType(x: number, y: number) {
		if (
			/* Top left */ (y < 8 && x < 8) ||
			/* Top right */ (y < 8 && x >= this.size - 8) ||
			/* Bottom left */ (y >= this.size - 8 && x < 8)
		) {
			return CellType.PositionPattern;
		}

		if (
			(y == 6 && x >= 8 && x <= this.size - 9) ||
			(y >= 8 && y <= this.size - 8 && x == 6) ||
			(y == this.size - 8 && x == 8)
		) {
			return CellType.TimingPattern;
		}

		// TODO: Alignment patterns

		if (
			(y == 8 && x <= 8) ||
			(y <= 8 && x == 8) ||
			(y == 8 && x >= this.size - 8) ||
			(y >= this.size - 8 && x == 8)
		) {
			return CellType.FormatInfo;
		}

		return CellType.Data;
	}

	getCell(x: number, y: number, unmasked = false) {
		if (unmasked) {
			const cellType = this.getCellType(x, y);

			// Only unmask data cells
			if (cellType == CellType.Data) {
				return masks[this.mask](x, y) ? (this.lines[y][x] == '1' ? '0' : '1') : this.lines[y][x];
			}
		}

		return this.lines[y][x];
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
				unmaskedLine += this.getCell(x, y, true);
			}

			unmaskedLines.push(unmaskedLine);
		}

		return unmaskedLines;
	}
}
