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
				contentData: contentData as PopulatedDocument<ContentDocument, 'content.extended'>,
				content
			}
		};
	};
</script>

<script lang="ts">
	export let contentData: PopulatedDocument<ContentDocument, 'content.extended'>;
	export let content: string;
</script>

<div class="flex flex-col mx-auto sm:container">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/works" sveltekit:prefetch>Works</a></li>
			<li>{contentData.title}</li>
		</ul>
	</div>
	<div class="prose">
		<h1>{contentData.title}</h1>
		{@html content}
	</div>
</div>
