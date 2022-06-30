<script lang="ts">
	import Table from '$lib/ux/tables/core/Table.svelte';
	import THead from '$lib/ux/tables/core/THead.svelte';
	import type { IColHeader } from '$lib/ux/tables/types';
	import TFoot from '$lib/ux/tables/core/TFoot.svelte';
	import type { ContentObjectSelect } from '$lib/_db/controllers/content';
	import Paginate from '../Paginate.svelte';
	import type { Writable } from 'svelte/store';
	import { getContext } from 'svelte';
	export let currentPage: number,
		pageCount: number,
		hasNextPage: boolean,
		hasPrevPage: boolean,
		nextPaginated: () => void,
		prevPaginated: () => void;
	const items = getContext('content-list') as Writable<ContentObjectSelect[]>;
	const colHeaders: IColHeader[] = [
		{ title: 'Select' },
		{ title: 'Title' },
		{ title: 'State' },
		{ title: 'Edit' }
	];
</script>

<Table compact={true}>
	<THead slot="thead" {colHeaders} />
	<svelte:fragment slot="tbody">
		{#each $items as { title, checked, state, slug }, i}
			{@const badgeColor =
				state === 'published'
					? 'badge-primary'
					: state === 'draft'
					? 'badge-secondary'
					: 'badge-accent'}
			<tr class="hover">
				<!-- Display Player Name -->
				<th>
					<label for="content_action_select">
						<input
							id="content_action_select"
							name="content_action_select"
							type="checkbox"
							class="checkbox"
							bind:checked
						/>
					</label>
				</th>
				<td>
					{title}
				</td>
				<td>
					<div class="badge {badgeColor}">{state}</div>
				</td>
				<td>
					<a class="btn btn-sm" sveltekit:prefetch href="/profile/edit/{slug}"> Edit </a>
				</td>
			</tr>
		{/each}
	</svelte:fragment>
	<TFoot slot="tfoot" {colHeaders} />
</Table>
<Paginate
	fetchNext={nextPaginated}
	fetchPrev={prevPaginated}
	page={currentPage}
	{pageCount}
	{hasNextPage}
	{hasPrevPage}
/>
