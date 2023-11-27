import type { PageLoad } from './$types';

export const load = (({ url }) => {
	return {
		qr: url.searchParams.get('qr') || '',
		qrData: url.searchParams.get('qrData') || ''
	};
}) satisfies PageLoad;
