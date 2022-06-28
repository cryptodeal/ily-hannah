<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';
	export let active = false;

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);
	registerTab(tab);
	$: $selectedTab === tab ? (active = true) : (active = false);
</script>

<li class="tab" class:tab-active={active} on:click={() => selectTab(tab)}>
	<slot />
</li>
