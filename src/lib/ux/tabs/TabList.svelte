<script lang="ts">
	import Tab from '$lib/ux/tabs/Tab.svelte';

	type LinkInfo = { title: string };
	export let links: LinkInfo[];
</script>

<!-- {JSON.stringify($page, null, '  ')} -->

<!-- {JSON.stringify($navigating, null, '  ')} -->
<ul class="tabs tabs-boxed justify-center">
	{#each links as link}
		<Tab>
			{link.title}
		</Tab>
	{/each}
</ul>
