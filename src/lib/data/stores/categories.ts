import { setContext, getContext } from 'svelte';
import { writable, type Writable } from 'svelte/store';
import type { CategoryObject } from '$lib/_db/mongoose.gen';

type CategorySelectObject = CategoryObject & {
	checked: boolean;
};
export function initCategoryStore(categories: CategoryObject[] = []) {
	const catSelect = categories.map((cat) => {
		const catSelect: CategorySelectObject = { ...cat, checked: false };
		return catSelect;
	});
	setContext('categories', writable(catSelect));
}

export function getCategoryStore() {
	return getContext<Writable<CategorySelectObject[]>>('categories') || initCategoryStore([]);
}
