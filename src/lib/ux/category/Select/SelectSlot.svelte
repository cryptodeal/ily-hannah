<script lang="ts">
	import uniqolor from 'uniqolor';
	import type { Option } from 'svelte-multiselect';
	import type { CatObjectOption } from '$lib/types';
	export let option: Option;

	const parseOption = (opt: Option) => {
		const { value, label } = opt as CatObjectOption;
		const { color, isLight } = uniqolor(value.toString(), { format: 'hsl' });
		return {
			value,
			label,
			color,
			isLight
		};
	};
	$: parsedOption = parseOption(option);
	$: color = parsedOption.color;
	$: textColor = parsedOption.isLight ? 'Black' : 'White';
	$: label = parsedOption.label;
</script>

<span
	style="display:inline-flex; align-items:center; justify-content:center; height:1.25rem; font-size:0.875rem; line-height:1.25rem; padding-left:0.563rem; padding-right:0.563rem; width:fit-content; border-radius:1.9rem;"
	style:background={color}
	style:color={textColor}
>
	{label}
</span>
