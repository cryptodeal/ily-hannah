<script lang="ts">
	export let color: string, isLight: boolean, name: string;
</script>

<div
	class="catBadge badge"
	class:text-primary-content={isLight}
	class:text-neutral-content={!isLight}
	style:--bgColor={color}
>
	{name}
</div>

<style lang="postcss">
	.catBadge {
		background-color: var(--bgColor);
	}
</style>
