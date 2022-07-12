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
	import { setContext } from 'svelte';
	import type { CatObjectOption } from '$lib/types';
	import type { CategoryObject, ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';
	import ContentItem from '$lib/ux/content/works/ContentItem.svelte';

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
<div class="flex overflow-visible z-[1000] fixed left-0 right-0 justify-center">
	<div class="collapse overflow-visible">
		<input type="checkbox" class="peer" bind:checked />
		<div class="collapse-title pr-4 py-0">
			<div class="flex w-full justify-center">
				<div class="btn mr-0 btn-primary sm:w-auto text-xl font-medium gap-4">
					<span>Filter</span>
					<Filter />
				</div>
			</div>
		</div>
		<div class="collapse-content collapse-card peer-checked:p-4 bg-primary">
			<CatSelect {loadCats} {clearFilters} {selectedCats} />
		</div>
	</div>
</div>
<div class="md:container w-full mx-auto flex flex-col ">
	<!-- Selected Category Filters -->
	<div
		class="gap-2 sm:gap-4 lg:gap-6 2xl:gap-10 pb-[20vh] pt-[5.5rem] flex flex-col mx-auto w-full max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2"
	>
		{#each itemList as { title, slug, author, categories, content: { brief } }}
			<ContentItem {title} {slug} {author} {categories} {brief} />
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
