export const masks: ((x: number, y: number) => boolean)[] = [
	(x, y) => (x + y) % 2 == 0,
	(x, y) => y % 2 == 0,
	(x, y) => x % 3 == 0,
	(x, y) => (x + y) % 3 == 0,
	(x, y) => (x / 3 + y / 2) % 2 == 0,
	(x, y) => ((x * y) % 2) + ((x * y) % 3) == 0,
	(x, y) => (((x * y) % 3) + x * y) % 2 == 0,
	(x, y) => (((x * y) % 3) + x + y) % 2 == 0
];
