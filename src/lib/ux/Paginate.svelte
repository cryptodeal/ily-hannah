<script lang="ts">
	export let page = 1,
		pageCount: number,
		hasNextPage: boolean,
		hasPrevPage: boolean,
		fetchPrev: () => void,
		fetchNext: () => void;
</script>

{#if pageCount && pageCount > 1}
	<div class="flex justify-center">
		<div class="btn-group">
			<button class="btn" class:btn-disabled={!hasPrevPage} on:click={fetchPrev}>«</button>
			<button class="btn">Page {page}</button>
			<button class="btn" class:btn-disabled={!hasNextPage} on:click={fetchNext}>»</button>
		</div>
	</div>
{/if}
