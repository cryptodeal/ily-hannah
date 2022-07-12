import { readable } from 'svelte/store';
import { browser } from '$app/env';
import type { CategoryObject } from '$lib/_db/mongoose.gen';

const DEFAULT_TIMEOUT = 600000;
const INIT_RETRY_TIMEOUT = 1000;

export const allCategories = readable<CategoryObject[]>([], (set) => {
	if (!browser) return;
	let timeout: number = INIT_RETRY_TIMEOUT;

	fetchCategories()
		.then(set)
		.catch((err) => {
			timeout = INIT_RETRY_TIMEOUT;
			console.error(`Failed to fetch`, err);
		});

	//query graph api every minute
	const id = setInterval(() => {
		fetchCategories()
			.then((categories) => {
				timeout = DEFAULT_TIMEOUT;
				set(categories);
			})
			.catch((err) => console.error(`Failed to fetch`, err));
	}, timeout);

	return () => {
		clearInterval(id);
	};
});

const fetchCategories = () => {
	return fetch('/api/category?type=all').then((res) => {
		if (!res.ok) throw new Error(`Error: !res.ok; ${res.status}`);
		return res.json().then((res) => {
			const { categories } = res;
			return categories;
		});
	});
};
