<script lang="ts">
	export let dataTip: string,
		open = false,
		primary = false;
</script>

<div class="tooltip" class:tooltip-primary={primary} class:tooltip-open={open} data-tip={dataTip}>
	<slot />
</div>
