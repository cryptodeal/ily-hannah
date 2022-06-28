<script lang="ts">
	import Tab from '$lib/ux/tabs/Tab.svelte';

	type LinkInfo = { title: string };
	export let links: LinkInfo[];
</script>

<!-- {JSON.stringify($page, null, '  ')} -->

<!-- {JSON.stringify($navigating, null, '  ')} -->
<div class="flex w-full justify-center">
	<ul class="tabs tabs-boxed">
		{#each links as link}
			<Tab>
				{link.title}
			</Tab>
		{/each}
	</ul>
</div>
