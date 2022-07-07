<script context="module" lang="ts">
	import type { UserDocument } from '$lib/_db/mongoose.gen';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, params }) => {
		const { slug } = params;
		const url = `/works/${slug}.json`;
		const res = await fetch(url);
		const { title, titleAlign, state, brief, author, content } = await res.json();

		//console.log(userData);
		return {
			props: {
				title,
				titleAlign,
				state,
				brief,
				author,
				content
			}
		};
	};
</script>

<script lang="ts">
	import ShareTwitter from '$lib/ux/socials/share/Twitter.svelte';
	import { MetaTags } from 'svelte-meta-tags';
	export let title: string,
		titleAlign: string,
		brief: string,
		author: UserDocument[],
		content: string;
	$: right = titleAlign === 'right';
	$: left = titleAlign === 'left';
	$: center = titleAlign === 'center';
	$: justify = titleAlign === 'justify';
	const authors = author
		.filter(({ name }) => name?.first && name?.last)
		.map(({ name }) => `${name.first} ${name.last}`)
		.join(', ');
</script>

<MetaTags {title} description={brief} />

<div class="mx-auto mb-5 max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2">
	<div class="w-full inline-flex flex-wrap justify-between items-center">
		<div class="text-sm breadcrumbs">
			<ul>
				<li><a href="/works" sveltekit:prefetch>Works</a></li>
				<li>{title}</li>
			</ul>
		</div>
		<ShareTwitter />
	</div>
</div>

<div class="print:hidden mx-auto prose max-w-4xl px-4 sm:px-6 lg:px-8 lg:max-w-1/2 2xl:prose-lg">
	<h1
		class="mb-2"
		class:text-right={right}
		class:text-left={left}
		class:text-center={center}
		class:text-justify={justify}
	>
		{title}
	</h1>
	{#if authors.length}
		<h5>By: {authors}</h5>
	{/if}
	{@html content}
</div>

<div
	data-theme="light"
	class="hidden print:block mx-auto prose max-w-4xl px-4 sm:px-6 lg:px-8 lg:max-w-1/2 2xl:prose-lg"
>
	<h1 class="mb-2">{title}</h1>
	{#if authors.length}
		<h5>By: {authors}</h5>
	{/if}
	{@html content}
</div>
