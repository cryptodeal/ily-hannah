<script lang="ts">
	export let errors: null | string[];
	$: open = errors && errors.length ? true : false;
</script>

<div class="tooltip-primary" class:tooltip-open={open} class:tooltip={errors} data-tip={errors}>
	<slot />
</div>
