<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, url }) => {
		const pg = url.searchParams.get('pg');
		const uri = pg && Number(pg) !== 1 ? `/works.json?pg=${pg}` : '/works.json';
		const res = await fetch(uri);
		const { contentData } = await res.json();
		const { currentPage, pageCount, prev, hasNextPage, hasPrevPage, next, itemList } = contentData;

		//console.log(userData);
		return {
			props: { currentPage, pageCount, hasNextPage, hasPrevPage, prev, next, itemList }
		};
	};
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import CatSelect from '$lib/ux/category/Select/index.svelte';
	import SSRPaginate from '$lib/ux/paginate/SSR.svelte';
	import SPAPaginate from '$lib/ux/paginate/SPA.svelte';
	import Filter from '~icons/fluent/filter-20-regular';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	import uniqolor from 'uniqolor';
	import Badge from '$lib/ux/category/Badge.svelte';
	import { setContext } from 'svelte';
	import type { CatObjectOption } from '$lib/types';
	import type { CategoryObject, ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';

	export let currentPage: number,
		pageCount: number,
		prev: number,
		next: number,
		hasNextPage: boolean,
		hasPrevPage: boolean,
		itemList: PopulatedDocument<PopulatedDocument<ContentDocument, 'content.extended'>, 'author'>[];
	const categories = getCategoryStore();
	let checked = false,
		params: URLSearchParams | undefined;

	const selectedCats = setContext('filter_categories', writable<CatObjectOption[]>([]));

	$: sortedSelectCats = $selectedCats.slice().sort((a, b) => (a.label > b.label ? 1 : -1));
	$: if (!$selectedCats.length) params = undefined;
	const loadCats = () => {
		checked = !checked;
		params = new URLSearchParams();
		$selectedCats.map((c) => {
			if (params) params.append('cat', c.value.toString());
		});
		fetch(`/works.json?${params.toString()}`)
			//.then(res => res.json)
			.then((res) => res.json())
			.then((res) => {
				const {
					currentPage: tempCurrentPage,
					hasPrevPage: tempHasPrev,
					hasNextPage: tempHasNext,
					pageCount: tempPgCount,
					prev: tempPrev,
					next: tempNext,
					itemList: tempItems
				} = res.contentData;
				itemList = tempItems;
				currentPage = tempCurrentPage;
				hasPrevPage = tempHasPrev;
				hasNextPage = tempHasNext;
				pageCount = tempPgCount;
				prev = tempPrev;
				next = tempNext;
			});
	};

	const loadContent = (page?: number) => {
		if (!page) return;
		return fetch(`/works.json?pg=${page}&${params?.toString()}`)
			.then((res) => res.json())
			.then((res) => {
				const {
					currentPage: tempCurrentPage,
					hasPrevPage: tempHasPrev,
					hasNextPage: tempHasNext,
					pageCount: tempPgCount,
					prev: tempPrev,
					next: tempNext,
					itemList: tempItems
				} = res.contentData;
				itemList = tempItems;
				currentPage = tempCurrentPage;
				hasPrevPage = tempHasPrev;
				hasNextPage = tempHasNext;
				pageCount = tempPgCount;
				prev = tempPrev;
				next = tempNext;
			});
	};
	const prevPaginated = () => {
		return loadContent(prev);
	};

	const nextPaginated = () => {
		return loadContent(next);
	};
	const clearFilters = () => {
		checked = !checked;
		selectedCats.set([]);
		goto('/works');
	};
	onMount(async () => {
		return fetch(`/api/category?type=all`)
			.then((res) => res.json())
			.then((data: { categories: CategoryObject[] }) => {
				const { categories: cats } = data;
				categories.set(cats.map((c) => ({ label: c.name, value: c._id })));
			});
	});
</script>

<MetaTags
	title="Assorted list of works by Hannah Williams."
	description="Index of poems, short stories, and other Musings by Hannah Williams."
/>

<div class="md:container w-full mx-auto flex flex-col">
	<div class="flex flex-wrap w-full">
		<!-- Selected Category Filters -->
		<div class="flex flex-grow flex-wrap w-full items-start md:w-1/3">
			{#if $selectedCats.length && !checked}
				<div class="w-full">
					<h6>Categories:</h6>
				</div>
				{#each sortedSelectCats as { value, label: name }}
					{@const { color, isLight } = uniqolor(value.toString(), { format: 'hsl' })}
					<Badge {color} {isLight} {name} />
				{/each}
			{/if}
		</div>
		<div class="flex w-full md:w-2/3 justify-start">
			<div class="collapse">
				<input type="checkbox" bind:checked />
				<div class="collapse-title py-0">
					<div class="btn btn-ghost mx-auto text-xl font-medium gap-4">
						<span>Filter</span>
						<Filter />
					</div>
				</div>
				<div class="collapse-content pt-0">
					<CatSelect {loadCats} {clearFilters} {selectedCats} />
				</div>
			</div>
		</div>
	</div>

	<div
		class="pb-24 md:pb-28 lg:pb-40 gap-6 flex flex-col mx-auto max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2"
	>
		{#each itemList as { title, slug, author }}
			{@const authors = author
				.filter(({ name }) => name?.first && name?.last)
				.map(({ name }) => `${name.first} ${name.last}`)}
			<div class="flex flex-col gap-2">
				<a sveltekit:prefetch href={`/works/${slug}`}><h2>{title}</h2></a>
				{#if authors.length}
					<h5 class="ml-4">By: {authors.join(', ')}</h5>
				{/if}
			</div>
		{:else}
			<h3>No works matching requested filter(s)</h3>
		{/each}
	</div>
</div>
{#if !params}
	<div class="left-0 right-0 fixed top-[80vh]">
		<SSRPaginate {prev} {next} page={currentPage} {pageCount} />
	</div>
{:else}
	<div class="left-0 right-0 fixed top-[80vh]">
		<SPAPaginate
			fetchNext={nextPaginated}
			fetchPrev={prevPaginated}
			page={currentPage}
			{pageCount}
			{hasNextPage}
			{hasPrevPage}
		/>
	</div>
{/if}
