<script context="module" lang="ts">
	import type { CategoryObject } from '$lib/_db/mongoose.gen';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, session }) => {
		if (!session.user) {
			return {
				redirect: '/',
				status: 302
			};
		}
		const url = `/api/category`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json'
			}
		});
		const {
			itemList: categories,
			currentPage,
			hasNextPage,
			hasPrevPage,
			pageCount,
			prev,
			next
		} = await res.json();

		//console.log(userData);
		return {
			props: {
				categories,
				currentPage,
				hasNextPage,
				hasPrevPage,
				pageCount,
				prev,
				next
			}
		};
	};
</script>

<script lang="ts">
	import { getCategoryStore } from '$lib/data/stores/categories';
	import List from '$lib/ux/category/List.svelte';
	export let categories: CategoryObject[],
		currentPage: number,
		hasPrevPage: boolean,
		hasNextPage: boolean,
		pageCount: number,
		prev: number,
		next: number;

	const loadContent = (page: number) => {
		if (!page) return;
		return fetch(`/api/category?pg=${page}`)
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
				catStore.set(tempItems);
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

	const catStore = getCategoryStore();
	catStore.set(categories.map((cat) => ({ ...cat, checked: false })));
</script>

<div class="flex flex-col gap-4 mx-auto sm:container">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/profile" sveltekit:prefetch>Profile</a></li>
			<li>Settings</li>
		</ul>
	</div>
	<List {currentPage} {hasPrevPage} {pageCount} {hasNextPage} {nextPaginated} {prevPaginated} />
</div>
