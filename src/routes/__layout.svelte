<!--
  <script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ url }) => ({
		props: {
			path: url.pathname
		}
	});
</script>
-->
<script lang="ts">
	import '../app.css';
	import { onMount, setContext } from 'svelte';
	import AuthModal from '$lib/ux/modal/Auth.svelte';
	// import { webVitals } from '$lib/webvitals';
	import { allCategories } from '$lib/data/stores/allCats';
	import { afterNavigate } from '$app/navigation';
	import { themeChange } from 'theme-change';
	import { page } from '$app/stores';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import Nav from '$lib/ux/nav/Navbar.svelte';
	import SideNav from '$lib/ux/nav/SideNav.svelte';
	import Toast from '$lib/ux/Toast.svelte';

	// export let path: string;

	const modalId = 'auth-modal',
		triggerTxt = 'login / register';
	getNotificationsStore();
	let drawercontent: { scrollTop: number },
		drawerContentScrollY = 0,
		drawersidebar: { scrollTop: number },
		drawerSidebarScrollY = 0,
		checked: boolean = '' as unknown as boolean,
		// analyticsId = import.meta.env.VERCEL_ANALYTICS_ID as string,
		segment: string;
	allCategories.subscribe((cats) => cats);
	setContext('all_categories', allCategories);
	page.subscribe((page) => {
		const tempPage = page.url.pathname;
		//path = tempPage;
		segment = tempPage.split('/')[1];
	});

	function parseContentScroll() {
		drawerContentScrollY = drawercontent.scrollTop;
	}

	function parseSidebarScroll() {
		drawerSidebarScrollY = drawersidebar.scrollTop;
	}

	function closeDrawer() {
		checked = '' as unknown as boolean;
	}

	onMount(() => {
		themeChange(false);
		parseContentScroll();
		parseSidebarScroll();
		// if (analyticsId) webVitals({ path, analyticsId });
	});

	afterNavigate(() => {
		drawercontent.scrollTop = 0;
	});
</script>

<svelte:head>
	<script>
		(function () {
			/* return if SSR */
			if (typeof document === 'undefined') return;
			const theme = localStorage.getItem('theme');
			if (
				theme === 'night' ||
				(!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)
			) {
				document.documentElement.setAttribute('data-theme', 'night');
				localStorage.setItem('theme', 'night');
			} else {
				document.documentElement.setAttribute('data-theme', 'retro');
				localStorage.setItem('theme', 'retro');
			}
		})();
	</script>
</svelte:head>

<div class="drawer">
	<label for="navDrawer" />
	<input id="navDrawer" type="checkbox" class="drawer-toggle" bind:checked />
	<div
		bind:this={drawercontent}
		on:scroll={parseContentScroll}
		class="drawer-content flex flex-col"
		style="scroll-behavior: smooth; scroll-padding-top: 5rem;"
	>
		<Nav {modalId} {triggerTxt} {segment} {closeDrawer} {drawerContentScrollY} />
		<div class="p-6 pb-16">
			<slot />
		</div>
		<footer
			class="{segment === 'works'
				? ' print:hidden'
				: ''} fixed bottom-0 footer footer-center p-2 2xl:p-4 bg-base-300 text-base-content"
		>
			<div>
				<p>Copyright © 2022 - All right reserved by Hannah Williams</p>
			</div>
		</footer>
	</div>
	<div
		class="drawer-side"
		style="scroll-behavior: smooth; scroll-padding-top: 5rem;"
		bind:this={drawersidebar}
		on:scroll={parseSidebarScroll}
	>
		<label for="navDrawer" class="drawer-overlay" />
		<aside class="bg-base-200 w-80">
			<SideNav {modalId} {triggerTxt} {closeDrawer} {segment} />
			<div
				class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"
			/>
		</aside>
	</div>
</div>
<AuthModal {modalId} />
<Toast />
