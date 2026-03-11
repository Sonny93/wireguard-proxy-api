export function partition<T, S extends T>(
	items: readonly T[],
	predicate: (item: T, index: number, array: readonly T[]) => item is S
): [truthy: S[], falsy: Exclude<T, S>[]];

export function partition<T>(
	items: readonly T[],
	predicate: (item: T, index: number, array: readonly T[]) => boolean
): [truthy: T[], falsy: T[]];

export function partition<T>(
	items: readonly T[],
	predicate: (item: T, index: number, array: readonly T[]) => boolean
): [truthy: T[], falsy: T[]] {
	return items.reduce<[T[], T[]]>(
		(acc, item, index, array) => {
			acc[predicate(item, index, array) ? 0 : 1].push(item);
			return acc;
		},
		[[], []]
	);
}
