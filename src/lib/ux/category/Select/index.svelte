<script lang="ts">
	import './select.css';
	import MultiSelect from 'svelte-multiselect';
	import CatSlot from './SelectSlot.svelte';
	import CatOptSlot from './OptSlot.svelte';
	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let selectedCats = writable<CatObjectOption[]>([]);
	const categories = getCategoryStore();

	$: disabled = !$selectedCats.length;
</script>

<div class="w-fit h-40">
	<label for="category_filter_select" class="font-semibold text-primary-content">Categories</label>
	<MultiSelect
		id="category_filter_select"
		options={$categories}
		placeholder="Select categories..."
		bind:selected={$selectedCats}
	>
		<CatSlot let:option {option} slot="selected" />
		<CatOptSlot let:option {option} slot="option" />
	</MultiSelect>
</div>
