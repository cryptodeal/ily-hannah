<script lang="ts">
	import Table from '$lib/ux/tables/core/Table.svelte';
	import type { IColHeader } from '$lib/ux/tables/types';
	import TFoot from '$lib/ux/tables/core/TFoot.svelte';
	import type { ContentObjectSelect } from '$lib/_db/controllers/content';
	import Paginate from '../paginate/SPA.svelte';
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

	let selectAll = false;
	const toggleAll = (boolVal: boolean) =>
		items.update((val) =>
			val.map((v) => {
				v.checked = boolVal;
				return v;
			})
		);
	$: if (selectAll || !selectAll) toggleAll(selectAll);
</script>

<Table compact={true}>
	<svelte:fragment slot="thead">
		<th>
			<div class="inline-flex items-center">
				<div>
					<label class="inline-flex items-center gap-2" for="content_action_select">
						<input
							id="content_action_select"
							name="content_action_select"
							type="checkbox"
							class="checkbox"
							bind:checked={selectAll}
						/>
						<span class="font-bold">Select</span>
					</label>
				</div>
			</div>
		</th>
		<th>
			<div class="inline-flex items-center">
				<div>
					<div class="font-bold">Title</div>
				</div>
			</div>
		</th>
		<th>
			<div class="inline-flex items-center">
				<div>
					<div class="font-bold">State</div>
				</div>
			</div>
		</th>
		<th>
			<div class="inline-flex items-center">
				<div>
					<div class="font-bold">Edit</div>
				</div>
			</div>
		</th>
	</svelte:fragment>
	<svelte:fragment slot="tbody">
		{#each $items as { title, checked, state, slug }}
			{@const badgeColor =
				state === 'published'
					? 'badge-primary'
					: state === 'draft'
					? 'badge-secondary'
					: 'badge-accent'}
			<tr class="hover">
				<th>
					<label>
						<input
							id="content_action_select_{slug}"
							name="content_action_select_{slug}"
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
