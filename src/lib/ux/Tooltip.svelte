<script lang="ts">
	export let dataTip: string,
		open = false;
</script>

<div class="tooltip tooltip-primary" class:tooltip-open={open} data-tip={dataTip}>
	<slot />
</div>
