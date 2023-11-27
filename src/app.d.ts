import type { Qr } from '$lib/qr';

import type { QRCode } from 'jsqr';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface Platform {}
	}

	interface Window {
		qr?: Qr | QRCode | null;
	}
}

export {};
