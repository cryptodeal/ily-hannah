<script lang="ts">
	export let dataTip: string,
		open = false,
		primary = false,
		accent = false,
		info = false,
		right = false;
</script>

<div
	class="tooltip"
	class:tooltip-primary={primary}
	class:tooltip-info={info}
	class:tooltip-right={right}
	class:tooltip-accent={accent}
	class:tooltip-open={open}
	data-tip={dataTip}
>
	<slot />
</div>
