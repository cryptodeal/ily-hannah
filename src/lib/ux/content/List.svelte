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
		{ title: 'Published' }
	];
</script>

<Table compact={true}>
	<THead slot="thead" {colHeaders} />
	<svelte:fragment slot="tbody">
		{#each $items as { title, checked, state }, i}
			<tr class="hover">
				<!-- Display Player Name -->
				<th>
					<label>
						<input type="checkbox" class="checkbox" bind:checked />
					</label>
				</th>
				<td>{title}</td>
				<td>
					<input type="checkbox" class="checkbox" disabled checked={state === 'published'} />
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
