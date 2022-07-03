<script lang="ts">
	export let page = 1,
		pageCount: number,
		prev: number | undefined,
		next: number | undefined;
</script>

<div class="flex justify-center items-center">
	{#if pageCount && pageCount > 1}
		<div class="btn-group">
			<a class="btn" class:btn-disabled={!prev} sveltekit:prefetch href="/works?pg={prev}">«</a>
			<button class="btn rounded-l-none rounded-r-none">Page {page}</button>
			<a class="btn" class:btn-disabled={!next} sveltekit:prefetch href="/works?pg={next}">»</a>
		</div>
	{/if}
</div>
