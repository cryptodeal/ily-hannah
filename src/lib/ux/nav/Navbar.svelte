<script lang="ts">
	import ThemeToggle from '$lib/ux/nav/ThemeToggle.svelte';
	import AuthButton from '$lib/ux/nav/AuthButton.svelte';
	export let segment: string, modalId: string, triggerTxt: string, closeDrawer: () => void;
</script>

<div
	class="sticky top-0 z-30 flex h-16 w-full justify-center bg-opacity-90 backdrop-blur bg-base-100 text-base-content shadow-sm"
>
	<!-- Navbar -->
	<nav class="w-full navbar">
		<div class="flex-none lg:hidden">
			<label for="navDrawer" class="btn btn-square btn-ghost">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					class="inline-block w-6 h-6 stroke-current"
				>
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M4 6h16M4 12h16M4 18h16"
					/>
				</svg>
			</label>
		</div>
		<div class="hidden lg:flex navbar-start bg-base-100">
			<a sveltekit:prefetch href="/" class="btn btn-ghost normal-case text-xl">ILY Hannah ❤️</a>
		</div>
		<div class="navbar-start lg:hidden bg-base-100">
			<a
				sveltekit:prefetch
				href="/"
				on:click={closeDrawer}
				class="btn btn-ghost normal-case text-xl">ILY Hannah ❤️</a
			>
		</div>

		<div class="navbar-center hidden lg:flex">
			<ul class="menu menu-horizontal p-0">
				<!-- Navbar menu content here -->
				<li>
					<a
						sveltekit:prefetch
						href="/about"
						class="uppercase"
						class:active={segment === 'about' ? true : false}
					>
						about
					</a>
				</li>
			</ul>
		</div>
		<div class="navbar-end gap-4">
			<div class="hidden lg:flex">
				<AuthButton {modalId} {triggerTxt} />
			</div>
			<ThemeToggle />
		</div>
	</nav>
</div>

<style lang="postcss">
	:root {
		--primary-light: #a6f9d6;
		--primary: #5be2a9;
		--primary-dark: #53ce9a;
		--secondary: #1e2145;
		--white: #fff;
		--grey: #e6e6ff;
		--grey-dark: #6d7098;
		--red: #ff6b6b;
	}
</style>
