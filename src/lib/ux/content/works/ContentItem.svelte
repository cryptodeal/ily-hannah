<script lang="ts">
	import Badge from '$lib/ux/category/Badge.svelte';
	import type { CategoryDocument, UserDocument } from '$lib/_db/mongoose.gen';
	import uniqolor from 'uniqolor';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const allCats = getContext('all_categories') as Readable<CategoryDocument[]>;

	export let title: string,
		brief: string | undefined = undefined,
		author: UserDocument[],
		slug: string,
		categories: (CategoryDocument['_id'] | CategoryDocument)[];

	function findCats(cats: CategoryDocument['_id'][], allCats: CategoryDocument[]) {
		const catData: CategoryDocument[] = [];
		for (let i = 0; i < cats.length; i++) {
			const cat = allCats.find((cat) => cat._id.toString() === cats[i].toString());
			if (cat) {
				catData.push(cat);
			}
		}
		return catData;
	}

	$: catList = findCats(categories as CategoryDocument['_id'][], $allCats);
	$: authors = author
		.filter(({ name }) => name?.first && name?.last)
		.map(({ name }) => `${name.first} ${name.last}`);
</script>

<div class="card card-compact w-full bg-secondary text-secondary-content shadow-xl">
	<a sveltekit:prefetch href={`/works/${slug}`} class="card-body">
		<h2 class="card-title">{title}</h2>
		{#if brief}
			<p>{brief}</p>
		{/if}

		{#if authors.length}
			<h6>By: {authors.join(', ')}</h6>
		{/if}
		<div class="card-actions gap-1">
			{#each catList as { name, _id }}
				{@const { color, isLight } = uniqolor(_id.toString(), { format: 'hsl' })}
				<Badge {color} {isLight} {name} />
			{/each}
		</div>
	</a>
</div>

<style lang="postcss">
	.card-title {
		@apply leading-tight font-normal text-3xl;
	}
</style>
