<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import CatSlot from './SelectSlot.svelte';
	import CatOptSlot from './OptSlot.svelte';
	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let selectedCats = writable<CatObjectOption[]>([]),
		saveBtn = true,
		loadCats: () => void;

	const categories = getCategoryStore();
</script>

<div class="flex-col justify-center gap-2 h-48">
	<label for="teamSubsList" class="text-lg font-semibold">Categories</label>
	<MultiSelect
		id="teamSubsList"
		options={$categories}
		placeholder="Select categories..."
		bind:selected={$selectedCats}
	>
		<CatSlot let:option {option} slot="selected" />
		<CatOptSlot let:option {option} slot="option" />
	</MultiSelect>

	{#if saveBtn}
		<button class="btn" on:click={loadCats}>Go!</button>
	{/if}
</div>
