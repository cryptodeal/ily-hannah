<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { themeChange } from 'theme-change';
	import * as yup from 'yup';
	import { Form, Field, ErrorMessage } from 'svelte-forms-lib';
	import { page } from '$app/stores';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import Nav from '$lib/ux/nav/Navbar.svelte';
	import SideNav from '$lib/ux/nav/SideNav.svelte';
	import Toast from '$lib/ux/Toast.svelte';

	const modalId = 'auth-modal',
		triggerTxt = 'login / register';
	$: segment = $page.url.pathname.split('/')[1];
	const notifications = getNotificationsStore();
	let drawercontent: { scrollTop: number },
		drawerContentScrollY = 0,
		drawersidebar: { scrollTop: number },
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

	const formProps = {
		initialValues: { email: '' },
		validationSchema: yup.object().shape({
			email: yup.string().email().required()
		}),
		onSubmit: (values: Record<string, unknown>) => {
			fetch('/api/auth.json', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			}).then((res) => {
				if (res.status === 200) {
					notifications.success('Success; check your email!');
				} else if (res.status === 401) {
					notifications.error('Error... Please try again!');
				} else {
					notifications.error('Error; not authorized persons... or check spelling ;)');
				}
			});
		}
	};
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
		<Nav {modalId} {triggerTxt} {segment} {closeDrawer} />
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
			<SideNav {modalId} {triggerTxt} {closeDrawer} {segment} />
			<div
				class="from-base-200 pointer-events-none sticky bottom-0 flex h-20 bg-gradient-to-t to-transparent"
			/>
		</aside>
	</div>
</div>
<Toast {notifications} />

<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal modal-bottom sm:modal-middle cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold text-center py-4">Login / Register</h3>
		<div class="flex flex-col gap-4 items-center p-1">
			<Form class="content" {...formProps}>
				<div class="flex flex-col gap-4 items-center">
					<div class="form-control w-full max-w-xs">
						<label for="email" class="label cursor-pointer gap-4">
							<span class="label-text">Email:</span>
						</label>
						<Field class="form-field" id="email" name="email" type="email" />
					</div>
					<ErrorMessage class="form-error" name="email" />
					<button class="btn" type="submit">submit</button>
				</div>
			</Form>
		</div>
	</label>
</label>
