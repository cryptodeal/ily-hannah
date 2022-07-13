<script lang="ts">
	import Twitter from '~icons/akar-icons/twitter-fill';
	import { onMount } from 'svelte';
	export let text: string | undefined = undefined;
	export let url: string | undefined = undefined;
	export let hashtags: string[] | undefined = undefined;
	export let via: string | undefined = undefined;
	export let related: string | undefined = undefined;

	onMount(() => {
		if (!url) url = window.location.href;
		if (!text) text = document.title;
	});

	$: query = [
		text && `text=${encodeURIComponent(text)}`,
		url && `url=${encodeURIComponent(url)}`,
		hashtags && `hashtags=${hashtags.join(',')}`,
		via && `via=${encodeURIComponent(via)}`,
		related && `related=${encodeURIComponent(related)}`
	]
		.filter(Boolean)
		.join('&');

	$: href = `https://twitter.com/intent/tweet?${query}`;

	function open(e: Event) {
		e.preventDefault();

		const w = 600;
		const h = 400;
		const x = (screen.width - w) / 2;
		const y = (screen.height - h) / 2;
		const features = `width=${w},height=${h},left=${x},top=${y}`;

		window.open(href, '_blank', features);
	}
</script>

<a
	class="btn btn-outline btn-info btn-sm print:hidden gap-2"
	target="_blank"
	rel="noopener noreferrer"
	{href}
	on:click={open}
>
	<Twitter class="fill-current" />
	Tweet
</a>
