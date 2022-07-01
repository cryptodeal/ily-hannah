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

<div class="w-full mx-auto md:container">
	<div class="flex flex-col gap-2">
		{#each itemList as { title, slug }}
			<div class="flex">
				<a class="flex-1" href={`/works/${slug}`}>{title}</a>
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
