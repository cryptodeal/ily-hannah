<script lang="ts">
	import './select.css';
	import MultiSelect from 'svelte-multiselect';
	import CatSlot from '$lib/ux/category/Select/SelectSlot.svelte';
	import CatOptSlot from '$lib/ux/category/Select/OptSlot.svelte';
	import PlusMinus from '~icons/fluent/add-subtract-circle-20-regular';
	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let selectedCats = writable<CatObjectOption[]>([]);
	const categories = getCategoryStore();
</script>

<label for="Category_Filter_Select" class="card-title"
	><PlusMinus class="h-6 w-6" />Categories</label
>
<MultiSelect
	id="Category_Filter_Select"
	options={$categories}
	placeholder="Select categories..."
	bind:selected={$selectedCats}
>
	<CatSlot let:option {option} slot="selected" />
	<CatOptSlot let:option {option} slot="option" />
</MultiSelect>
