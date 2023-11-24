import type { PageLoad } from './$types';

export const load = (({ url }) => {
	return {
		qr: url.searchParams.get('qr') || ''
	};
}) satisfies PageLoad;
