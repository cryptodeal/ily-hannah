<script lang="ts">
	export let page = 1,
		pageCount: number,
		prev: number | undefined,
		next: number | undefined;
</script>

<div class="flex justify-center">
	{#if pageCount && pageCount > 1}
		<div class="btn-group">
			<a
				class="btn btn-sm rounded-r-none"
				class:btn-disabled={!prev}
				sveltekit:prefetch
				href="/works{prev && prev === 1 ? '' : `?pg=${prev}`}"
			>
				«
			</a>
			<button class="btn btn-sm rounded-l-none rounded-r-none">Page {page}</button>
			<a
				class="btn btn-sm rounded-l-none"
				class:btn-disabled={!next}
				sveltekit:prefetch
				href="/works?pg={next}"
			>
				»
			</a>
		</div>
	{/if}
</div>
