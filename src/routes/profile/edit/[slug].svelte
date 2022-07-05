<script context="module" lang="ts">
	import type { ContentDocument, PopulatedDocument } from '$lib/_db/mongoose.gen';
	import type { Load } from '@sveltejs/kit';
	import type { JSONContent } from '@tiptap/core';

	export const load: Load = async ({ fetch, params, session }) => {
		const { slug } = params;
		if (!session.user) {
			return {
				redirect: '/',
				status: 302
			};
		}
		const url = `/profile/edit/${slug}.json`;
		const res = await fetch(url);
		const { contentData } = await res.json();

		//console.log(userData);
		return {
			props: {
				contentData: contentData as PopulatedDocument<ContentDocument, 'content.extended'>
			}
		};
	};
</script>

<script lang="ts">
	import Tiptap from '$lib/editor/Tiptap.svelte';
	export let contentData: PopulatedDocument<ContentDocument, 'content.extended'>;
	const content: JSONContent = contentData.content.extended?.content;
	const _id: string | undefined = contentData?._id?.toString();
	const title: string | undefined = contentData?.title;
	const state: string | undefined = contentData?.state;
</script>

<div class="flex flex-col mx-auto sm:container">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/profile" sveltekit:prefetch>Profile</a></li>
			<li>Edit</li>
			<li>{contentData.title}</li>
		</ul>
	</div>
	<Tiptap {content} {_id} {title} {state} />
</div>
