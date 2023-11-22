import * as qrs from './qrs';

export { qrs };

export function parseQr(qr: string | Qr) {
	if (typeof qr == 'string') {
		return new Qr(qr);
	}

	return qr;
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

	get maskStr() {
		return this.lines[8].substring(2, 5);
	}

	get mask() {
		return parseInt(this.maskStr, 2);
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
}
