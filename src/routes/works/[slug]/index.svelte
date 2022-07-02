<script context="module" lang="ts">
	import type { ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, params }) => {
		const { slug } = params;
		const url = `/works/${slug}.json`;
		const res = await fetch(url);
		const { contentData, content } = await res.json();

		//console.log(userData);
		return {
			props: {
				contentData: contentData as PopulatedDocument<
					PopulatedDocument<ContentDocument, 'content.extended'>,
					'author'
				>,
				content
			}
		};
	};
</script>

<script lang="ts">
	import ShareTwitter from '$lib/ux/socials/share/Twitter.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	export let contentData: PopulatedDocument<
		PopulatedDocument<ContentDocument, 'content.extended'>,
		'author'
	>;
	export let content: string;

	const authors = contentData.author
		.filter(({ name }) => name?.first && name?.last)
		.map(({ name }) => `${name.first} ${name.last}`)
		.join(', ');
</script>

<MetaTags title={contentData.title} description={contentData.content.brief} />

<div class="mx-auto mb-5 max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2">
	<div class="w-full inline-flex justify-between items-center">
		<div class="text-sm breadcrumbs">
			<ul>
				<li><a href="/works" sveltekit:prefetch>Works</a></li>
				<li>{contentData.title}</li>
			</ul>
		</div>
		<ShareTwitter />
	</div>
</div>
<div class="mx-auto prose max-w-4xl px-4 sm:px-6 lg:px-8 lg:max-w-1/2 2xl:prose-lg">
	<h1 class="mb-2">{contentData.title}</h1>
	{#if authors.length}
		<h5>By: {authors}</h5>
	{/if}
	{@html content}
</div>
