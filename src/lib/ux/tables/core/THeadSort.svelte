<script lang="ts">
	import Triangle from '~icons/fluent/triangle-12-regular';
	import type { IColHeader, ISortBy } from '../types';
	export let sort: (column: string) => void,
		colHeaders: IColHeader[],
		sortBy: ISortBy | undefined = undefined;
</script>

{#each colHeaders as { title, subtext, key }, i}
	{@const updateSort = () => sort(key || '')}
	<th on:click={updateSort}>
		<div class="flex items-center space-x-3">
			<div class="avatar">
				{#if sortBy && sortBy.col === key}
					{#if sortBy.ascending}
						<Triangle class="stroke-current w-6 h-6" />
					{:else}
						<Triangle class="stroke-current w-6 h-6" style="transform:rotate(180deg);" />
					{/if}
				{/if}
			</div>
			<div>
				<div class="font-bold">{title}</div>
				{#if subtext}
					<div class="text-2xs opacity-50">{subtext}</div>
				{/if}
			</div>
		</div></th
	>
{/each}
