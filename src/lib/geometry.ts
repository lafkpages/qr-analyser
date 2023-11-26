import type { Point } from 'jsqr/dist/locator';

export function distance(p1: Point, p2: Point) {
	return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

export function degreesBetweenTwoLines(line1: [Point, Point], line2: [Point, Point]) {
	const dAx = line1[1].x - line1[0].x;
	const dAy = line1[1].y - line1[0].y;
	const dBx = line2[1].x - line2[0].x;
	const dBy = line2[1].y - line2[0].y;

	return Math.abs(Math.atan2(dAx * dBy - dAy * dBx, dAx * dBx + dAy * dBy));
}

export function getPointFromPointAngleAndDistance(
	point: Point,
	angle: number,
	distance: number
): Point {
	const x = point.x + Math.cos(angle) * distance;
	const y = point.y + Math.sin(angle) * distance;

	return { x, y };
}
