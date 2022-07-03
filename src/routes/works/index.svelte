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
	import Paginate from '$lib/ux/paginate/SSR.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	import type { ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';
	export let currentPage: number,
		pageCount: number,
		prev: number,
		next: number,
		itemList: PopulatedDocument<PopulatedDocument<ContentDocument, 'content.extended'>, 'author'>[];
</script>

<MetaTags
	title="Assorted list of works by Hannah Williams."
	description="Index of poems, short stories, and other Musings by Hannah Williams."
/>
<div
	class="min-h-[80vh] mb-24 md:mb-28 lg:mb-40 gap-6 flex flex-col mx-auto max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2"
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
<div class="left-0 right-0 fixed top-[80vh]">
	<Paginate {prev} {next} page={currentPage} {pageCount} />
</div>
