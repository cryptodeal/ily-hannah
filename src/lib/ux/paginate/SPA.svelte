<script lang="ts">
	export let page = 1,
		pageCount: number,
		hasNextPage: boolean,
		hasPrevPage: boolean,
		fetchPrev: () => void,
		fetchNext: () => void;
</script>

<div class="flex w-fit mx-auto justify-center">
	{#if pageCount && pageCount > 1}
		<div class="btn-group mx-auto">
			<button class="btn btn-sm" class:btn-disabled={!hasPrevPage} on:click={fetchPrev}>«</button>
			<button class="btn btn-sm">Page {page}</button>
			<button class="btn btn-sm" class:btn-disabled={!hasNextPage} on:click={fetchNext}>»</button>
		</div>
	{/if}
</div>
