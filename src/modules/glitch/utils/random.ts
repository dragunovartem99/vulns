// A stateless hash of an integer to [0, 1). Stateless so the idle schedule
// is a pure function of time: any frame can be recomputed, and tests can pin
// exactly when a burst happens without seeding anything.
export function hash(n: number): number {
	let x = Math.imul(n ^ 0x9e3779b9, 0x85ebca6b);
	x ^= x >>> 13;
	x = Math.imul(x, 0xc2b2ae35);
	x ^= x >>> 16;
	return (x >>> 0) / 2 ** 32;
}
