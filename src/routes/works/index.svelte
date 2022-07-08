<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, url }) => {
		const pg = url.searchParams.get('pg');
		const uri = pg && Number(pg) !== 1 ? `/works.json?pg=${pg}` : '/works.json';

		const res = await fetch(uri);
		const { contentData } = await res.json();
		const { currentPage, pageCount, prev, next, itemList } = contentData;

		//console.log(userData);
		return {
			props: { currentPage, pageCount, prev, next, itemList }
		};
	};
</script>

<script lang="ts">
	import { writable } from 'svelte/store';
	import CatSelect from '$lib/ux/category/Select/index.svelte';
	import type { CatObjectOption } from '$lib/types';
	import Paginate from '$lib/ux/paginate/SSR.svelte';
	import { onMount } from 'svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import type { CategoryObject, ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	export let currentPage: number,
		pageCount: number,
		prev: number,
		next: number,
		itemList: PopulatedDocument<PopulatedDocument<ContentDocument, 'content.extended'>, 'author'>[];

	const categories = getCategoryStore();

	const selectedCats = writable<CatObjectOption[]>([]);

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

<div class="flex flex-col items-center justify-center">
	<CatSelect {selectedCats} />
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
		{/each}
	</div>
</div>

<div class="left-0 right-0 fixed top-[80vh]">
	<Paginate {prev} {next} page={currentPage} {pageCount} />
</div>
