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
	export let contentData: PopulatedDocument<
		PopulatedDocument<ContentDocument, 'content.extended'>,
		'author'
	>;
	export let content: string;
</script>

<div class="mx-auto mb-5 max-w-4xl px-2 sm:px-2 lg:px-4 lg:max-w-1/2">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/works" sveltekit:prefetch>Works</a></li>
			<li>{contentData.title}</li>
		</ul>
	</div>
</div>
<div class="mx-auto prose max-w-4xl px-4 sm:px-6 lg:px-8 lg:max-w-1/2 2xl:prose-lg">
	<h1 class="mb-2">{contentData.title}</h1>
	{#if contentData.author.length}
		<h5>By: {contentData.author[0].name.first} {contentData.author[0].name.last}</h5>
	{/if}
	{@html content}
</div>
