<script lang="ts">
	export let page = 1,
		pageCount: number;
</script>

{#if pageCount && pageCount > 1}
	<div class="flex justify-center">
		<div class="btn-group">
			<button class="btn" class:btn-disabled={page - 1 >= 1}>«</button>
			<button class="btn">Page {page}</button>
			<button class="btn" class:btn-disabled={page + 1 <= pageCount}>»</button>
		</div>
	</div>
{/if}
