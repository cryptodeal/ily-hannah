<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import CatSlot from '$lib/ux/category/Select/SelectSlot.svelte';
	import CatOptSlot from '$lib/ux/category/Select/OptSlot.svelte';
	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let selectedCats = writable<CatObjectOption[]>([]),
		saveBtn = true,
		save: () => void;

	const categories = getCategoryStore();
</script>

<div class="flex w-[20rem] flex-col justify-center items-center gap-2 h-48">
	<label for="Category_Filter_Select" class="text-lg font-semibold">Categories</label>
	<MultiSelect
		id="Category_Filter_Select"
		options={$categories}
		placeholder="Select categories..."
		bind:selected={$selectedCats}
	>
		<CatSlot let:option {option} slot="selected" />
		<CatOptSlot let:option {option} slot="option" />
	</MultiSelect>

	{#if saveBtn}
		<button class="btn btn-wide" on:click={save}>Save</button>
	{/if}
</div>
