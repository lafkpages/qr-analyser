export type Vector = [number, number];
export type Point = [number, number];

export function scaleVector(vector: Vector, scalar: number): Vector {
	return [vector[0] * scalar, vector[1] * scalar];
}

export function addVectors(vector: Vector, point: Point): Point {
	return [point[0] + vector[0], point[1] + vector[1]];
}

export function xyObjectToPoint(obj: { x: number; y: number }): Point {
	return [obj.x, obj.y];
}
