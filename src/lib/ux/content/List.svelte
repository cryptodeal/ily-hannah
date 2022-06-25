<script lang="ts">
	import Table from '$lib/ux/tables/core/Table.svelte';
	import THead from '$lib/ux/tables/core/THead.svelte';

	import type { IColHeader } from '$lib/ux/tables/types';
	import TFoot from '$lib/ux/tables/core/TFoot.svelte';
	import type { PaginatedContentData } from '$lib/_db/controllers/content';
	import Paginate from '../Paginate.svelte';

	export let paginatedData: PaginatedContentData;

	const colHeaders: IColHeader[] = [{ title: 'Select' }, { title: 'Title' }];
</script>

<div class="w-full flex flex-col gap-4">
	<Table>
		<THead slot="thead" {colHeaders} />
		<svelte:fragment slot="tbody">
			{#each paginatedData.itemList as { title }, i}
				<tr class="hover">
					<!-- Display Player Name -->
					<th>
						<label>
							<input type="checkbox" class="checkbox" />
						</label>
					</th>
					<td>{title}</td>
				</tr>
			{/each}
		</svelte:fragment>
		<TFoot slot="tfoot" {colHeaders} />
	</Table>
	<Paginate page={paginatedData.currentPage} pageCount={paginatedData.pageCount} />
</div>
