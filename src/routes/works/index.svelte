<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch }) => {
		const url = `/works.json`;
		const res = await fetch(url);
		const { contentData } = await res.json();

		//console.log(userData);
		return {
			props: {
				contentData
			}
		};
	};
</script>

<script lang="ts">
	import Paginate from '$lib/ux/Paginate.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import type { PaginatedContentPub } from '$lib/_db/controllers/content';
	export let contentData: PaginatedContentPub;
	let { currentPage, hasPrevPage, hasNextPage, pageCount, prev, next, itemList } = contentData;

	const loadContent = (page?: number) => {
		if (!page) return;
		return fetch(`/works.json?pg=${page}`)
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
</script>

<MetaTags
	title="Assorted list of works by Hannah Williams."
	description="Index of poems, short stories, and other Musings by Hannah Williams."
/>

<div class="flex flex-col gap-6 mx-auto max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2">
	{#each itemList as { title, slug, author }}
		{@const authors = author
			.filter(({ name }) => name?.first && name?.last)
			.map(({ name }) => `${name.first} ${name.last}`)}
		<a class="flex-1" href={`/works/${slug}`}><h2>{title}</h2></a>
		{#if authors.length}
			<h5 class="ml-4">By: {authors.join(', ')}</h5>
		{/if}
	{/each}
	<Paginate
		fetchNext={nextPaginated}
		fetchPrev={prevPaginated}
		page={currentPage}
		{pageCount}
		{hasNextPage}
		{hasPrevPage}
	/>
</div>
