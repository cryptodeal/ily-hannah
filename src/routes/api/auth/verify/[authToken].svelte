<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ params }) => {
		const url = `/api/auth/verify/${params.authToken}.json`;

		return {
			props: {
				url
			}
		};
	};
</script>

<script lang="ts">
	export let url: string;

	const auth = () => {
		return fetch(url)
			.then((res) => res.json())
			.then(() => (window.location.href = '/profile'));
	};
</script>

<div class="flex w-full h-[50vh] justify-center items-center">
	<div class="card w-96 bg-primary text-primary-content">
		<div class="card-body gap-3">
			<h2 class="card-title">Click to Authenticate</h2>
			<p class="text-sm">
				As<a class="link" href="https://news.ycombinator.com/item?id=31892299" target="_blank"
					>Microsoft Outlook indexes magic links</a
				>, i.e. follows the link, for Bing Search, you must click the following button to verify
				this authentication request.
			</p>
			<div class="card-actions justify-end">
				<button class="btn" on:click={auth}>Click to Auth</button>
			</div>
		</div>
	</div>
</div>
