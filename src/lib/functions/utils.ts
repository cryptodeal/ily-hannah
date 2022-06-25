export function resolve(
	path: string | string[],
	obj: typeof self | object = self,
	separator = '.'
) {
	const properties = Array.isArray(path) ? path : path.split(separator);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return properties.reduce((prev: any, curr: any) => prev && prev[curr], obj);
}
