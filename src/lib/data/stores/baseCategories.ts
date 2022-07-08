import { setContext, getContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { CategoryObject } from '$lib/_db/mongoose.gen';
import type { CatObjectOption } from '$lib/types';

export function initCategoryStore(categories: CategoryObject[] = []) {
	const catSelect = categories.map(({ name, _id }) => {
		return { label: name, value: _id };
	});
	setContext('categories', writable(catSelect));
}

export function getCategoryStore() {
	return getContext<Writable<CatObjectOption[]>>('categories') || initCategoryStore([]);
}
