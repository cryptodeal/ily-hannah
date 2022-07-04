<script lang="ts">
	import Table from '$lib/ux/tables/core/Table.svelte';
	import THead from '$lib/ux/tables/core/THead.svelte';
	import type { IColHeader } from '$lib/ux/tables/types';
	import TFoot from '$lib/ux/tables/core/TFoot.svelte';
	import Paginate from '../paginate/SPA.svelte';
	import uniqolor from 'uniqolor';
	import { invertColor } from '$lib/functions/utils';
	import { getCategoryStore } from '$lib/data/stores/categories';
	export let currentPage: number,
		pageCount: number,
		hasNextPage: boolean,
		hasPrevPage: boolean,
		nextPaginated: () => void,
		prevPaginated: () => void;
	const categories = getCategoryStore();
	const colHeaders: IColHeader[] = [{ title: 'Select' }, { title: 'Name' }, { title: 'Edit' }];
</script>

<Table compact={true}>
	<THead slot="thead" {colHeaders} />
	<svelte:fragment slot="tbody">
		{#each $categories as { name, checked, _id }, i}
			{@const badgeColor = uniqolor(_id.toString()).color}
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
					<div
						class="badge"
						style="background-color:{badgeColor};color:{invertColor(badgeColor, true)};"
					>
						{name}
					</div>
				</td>
				<td>
					<button class="btn btn-sm"> Edit </button>
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
