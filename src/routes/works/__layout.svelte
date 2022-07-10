<script lang="ts">
	import { initCategoryStore } from '$lib/data/stores/categories';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { CatObjectOption } from '$lib/types';

	initCategoryStore();
	setContext('filter_categories', writable<CatObjectOption[]>([]));
</script>

<slot />
