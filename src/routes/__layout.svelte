<script lang="ts">
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { themeChange } from 'theme-change';
	import '../app.css';
	import { page } from '$app/stores';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import Nav from '$lib/ux/nav/Navbar.svelte';
	import SideNav from '$lib/ux/nav/SideNav.svelte';
	import Toast from '$lib/ux/Toast.svelte';
	const modalId = 'auth-modal',
		triggerTxt = 'login / register';
	$: segment = $page.url.pathname.split('/')[1];
	const notifications = getNotificationsStore();
	let drawercontent: any,
		drawerContentScrollY = 0,
		drawersidebar: any,
		drawerSidebarScrollY = 0,
		checked: boolean = '' as unknown as boolean;
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
		<Nav {segment} {modalId} {triggerTxt} {closeDrawer} />
		<div class="pt-6 px-2 pb-10 md:px-6">
			<slot />
		</div>
		<footer class="fixed bottom-0 footer footer-center p-2 lg:p-4 bg-base-300 text-base-content">
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
			<SideNav {closeDrawer} {segment} />
			<div
				class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"
			/>
		</aside>
	</div>
</div>
<Toast />
