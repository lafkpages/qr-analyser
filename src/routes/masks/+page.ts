import type { PageLoad } from './$types';

export const load = (({ url }) => {
	const widthParam = url.searchParams.get('width');
	const heightParam = url.searchParams.get('height');

	const widthNum = widthParam ? parseInt(widthParam) : NaN;
	const heightNum = heightParam ? parseInt(heightParam) : NaN;

	const width = isNaN(widthNum) ? undefined : widthNum;
	const height = isNaN(heightNum) ? undefined : heightNum;

	return {
		width,
		height
	};
}) satisfies PageLoad;
