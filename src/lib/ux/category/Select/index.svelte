<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import CatSlot from './SelectSlot.svelte';
	import CatOptSlot from './OptSlot.svelte';
	import ResetFilters from '~icons/fluent/filter-dismiss-20-regular';

	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let selectedCats = writable<CatObjectOption[]>([]),
		loadCats: () => void,
		clearFilters: () => void;

	const categories = getCategoryStore();

	$: disabled = !$selectedCats.length;
</script>

<label for="category_filter_select" class="font-semibold">Categories</label>
<MultiSelect
	id="category_filter_select"
	options={$categories}
	placeholder="Select categories..."
	bind:selected={$selectedCats}
>
	<CatSlot let:option {option} slot="selected" />
	<CatOptSlot let:option {option} slot="option" />
</MultiSelect>
<div class="inline-flex items-center w-full justify-evenly">
	<button class="btn" class:btn-disabled={disabled} on:click={loadCats}>Go!</button>
	<button class="btn gap-2" class:btn-disabled={disabled} on:click={clearFilters}>
		Reset
		<ResetFilters class="w-5 h-5" />
	</button>
</div>
