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
	import type { PaginatedContentPub } from '$lib/_db/controllers/content';
	export let contentData: PaginatedContentPub;
	let { currentPage, hasPrevPage, hasNextPage, pageCount, prev, next, itemList } = contentData;

	const loadContent = (page?: number) => {
		if (!page) return;
		return fetch(`/profile.json?pg=${page}`)
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

<div class="mx-auto mb-5 max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2">
	<div class="flex flex-col gap-y-6 gap-x-2">
		{#each itemList as { title, slug, author }}
			{@const authors = author.map(({ name: { first, last } }) => `${first} ${last}`)}
			<div class="flex flex-col gap-2">
				<a class="flex-1" href={`/works/${slug}`}><h2>{title}</h2></a>
				{#if author.length}
					<h5 class="ml-4">By: {authors.join(', ')}</h5>
				{/if}
			</div>
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
</div>
