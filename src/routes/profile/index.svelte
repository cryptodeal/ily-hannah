<script context="module" lang="ts">
	import type { Load } from '@sveltejs/kit';
	export const load: Load = async ({ fetch, session }) => {
		if (!session.user) {
			return {
				redirect: '/',
				status: 302
			};
		}
		const url = `/profile.json?userId=${session.user.id}`;
		const res = await fetch(url);
		const { userData, contentData } = await res.json();

		//console.log(userData);
		return {
			props: {
				user: userData,
				contentData
			}
		};
	};
</script>

<script lang="ts">
	import Tiptap from '$lib/editor/Tiptap.svelte';
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { z } from 'zod';
	import dayjs from 'dayjs';
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import IconEdit from '~icons/fluent/document-edit-24-regular';
	import IconSave from '~icons/fluent/save-24-regular';
	import IconPerson from '~icons/fluent/person-24-regular';
	import List from '$lib/ux/content/List.svelte';
	import Tabs from '$lib/ux/tabs/Tabs.svelte';
	import TabList from '$lib/ux/tabs/TabList.svelte';
	import TabPanel from '$lib/ux/tabs/TabPanel.svelte';
	import SettingsIcon from '~icons/fluent/settings-24-filled';
	import type { PaginatedContentData, ContentObjectSelect } from '$lib/_db/controllers/content';
	import type { UserDocument } from '$lib/_db/mongoose.gen';
	import Tooltip from '$lib/ux/forms/Tooltip.svelte';
	import TooltipReg from '$lib/ux/Tooltip.svelte';
	import Confirm from '$lib/ux/modal/Confirm.svelte';

	export let user: UserDocument, contentData: PaginatedContentData;
	let { currentPage, hasPrevPage, hasNextPage, pageCount, prev, next, itemList } = contentData;
	const contentDataStore = writable<ContentObjectSelect[]>(itemList);
	setContext('content-list', contentDataStore);
	if (!user.name) {
		user.name = {
			first: '',
			last: ''
		};
	}

	const schema = z.object({
		name: z.object({
			first: z.string().min(2, 'First name must have at least 2 character(s)').trim(),
			last: z.string().min(2, 'Last name must have at least 2 character(s)').trim()
		})
	});

	const loadContent = (page?: number) => {
		if (!page) return;
		return fetch(`/profile.json?pg=${page}`)
			.then((res) => res.json())
			.then((res) => {
				const {
					currentPage: tempCurrentPage,
					hasPrevPage: tempHasPrev,
					hasNextPage: tempHasNext,
					pageCount: tempPgCount,
					prev: tempPrev,
					next: tempNext,
					itemList: tempItems
				} = res.contentData;
				contentDataStore.set(tempItems);
				currentPage = tempCurrentPage;
				hasPrevPage = tempHasPrev;
				hasNextPage = tempHasNext;
				pageCount = tempPgCount;
				prev = tempPrev;
				next = tempNext;
			});
	};

	const updateState = (state: 'draft' | 'published' | 'archived') => {
		return fetch(`/api/content`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				state,
				id: $contentDataStore.filter((i) => i.checked).map((i) => i._id)
			})
		}).then((res) => {
			if (res.status === 200) {
				loadContent(currentPage);
				notifications.success(
					state === 'archived' || state === 'published'
						? `Successfully ${state} item(s)!`
						: `Successfully marked item(s) as ${state}!`
				);
			} else {
				notifications.error('Error updating content items');
			}
		});
	};

	const flagPub = () => updateState('published');

	const flagDraft = () => updateState('draft');

	const flagArchive = () => updateState('archived');

	const prevPaginated = () => {
		return loadContent(prev);
	};

	const nextPaginated = () => {
		return loadContent(next);
	};

	const delContent = () => {
		return fetch(`/api/content`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				ids: $contentDataStore.filter((i) => i.checked).map((i) => i._id)
			})
		}).then((res) => {
			if (res.status === 200) {
				loadContent(currentPage);
				notifications.success('Successfully deleted requested content items');
			} else {
				notifications.error('Error deleting content items');
			}
		});
	};

	const notifications = getNotificationsStore();
	const { form, errors, isValid, handleSubmit } = createForm<z.infer<typeof schema>>({
		onSubmit: (values) => {
			edit = !edit;
			return fetch('/profile.json', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(values)
			}).then((res) => {
				if (res.status === 200) {
					notifications.success('Successfully updated your user data!');
				} else {
					notifications.error('Error; failed to update your user data!');
				}
			});
		},
		extend: validator({ schema })
	});

	let edit = false;
	$: if (user.name.first === '' || user.name.last === '') edit = true;
	$: selected = $contentDataStore.filter((i) => i.checked);
</script>

<Tabs>
	<div class="w-full md:container mx-auto">
		<div class="flex flex-wrap md:flex-nowrap justify-between items-center gap-4">
			<div class="hidden md:inline-flex md:w-1/3" />
			<TabList links={[{ title: 'Profile' }, { title: 'My Works' }, { title: '+ Content' }]} />
			<div class="w-full justify-center md:justify-end md:w-1/3 inline-flex">
				<a class="btn btn-sm gap-2" href="/profile/settings"><SettingsIcon /> Settings</a>
			</div>
		</div>
		<!-- Schedule Data Tab -->
		<TabPanel>
			<div class="md:flex no-wrap md:-mx-2">
				<!-- Left Side -->
				<div class="w-full md:w-3/12">
					<!-- Profile Card -->
					<div class="glassmorphicBg p-3 my-4 border-t-4 border-primary">
						<div class="image overflow-hidden">
							<!--
                  <img class="h-auto w-full mx-auto"
                      src="https://lavinephotography.com.au/wp-content/uploads/2017/01/PROFILE-Photography-112.jpg"
                      alt="">
                -->
						</div>
						<h1 class="font-bold text-xl leading-8 my-1">{user.name.first} {user.name.last}</h1>
						<!--
                  <h3 class="text-lg text-semibold leading-6">Owner at Her Company Inc.</h3>
                  <p class="text-sm text-gray-700 leading-6 dark:text-gray-300">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Reprehenderit, eligendi
                    dolorum sequi illum qui unde aspernatur non deserunt
                  </p>
                -->
						<ul class="glassmorphicBg gap-4 p-4 rounded shadow-sm">
							<li class="flex items-center">
								<span class="font-semibold">Status</span>
								<div class="badge badge-lg badge-success ml-auto">
									<span class="text-sm">Active</span>
								</div>
							</li>
							<div class="divider" />
							<li class="flex items-center">
								<span class="font-semibold">Member since</span>
								<span class="ml-auto">{dayjs(user.createdAt).format('MMM DD, YYYY')}</span>
							</li>
						</ul>
					</div>
				</div>

				<!-- Right Side -->
				<div class="w-full md:w-9/12 md:px-2 mb-4">
					<!-- Profile tab -->
					<!-- About Section -->
					<div class="glassmorphicBg p-3 shadow-sm rounded-sm my-4">
						<form use:form>
							<div class="flex my-2 gap-4 items-center font-semibold leading-8">
								<div class="flex-1 inline-flex items-center">
									<IconPerson class="mr-2 fill-current" />
									<span class="tracking-wide">About</span>
								</div>
								<TooltipReg color={edit ? 'primary' : undefined} dataTip={edit ? 'Save' : 'Edit'}>
									<button
										class="btn btn-sm gap-2"
										class:btn-disabled={edit && !$isValid}
										class:btn-primary={edit}
										type="submit"
										on:click={edit ? handleSubmit : () => (edit = !edit)}
									>
										{#if !edit}
											<IconEdit />
										{:else}
											<IconSave />
										{/if}
									</button>
								</TooltipReg>
							</div>
							<div class="grid text-sm md:grid-cols-2 md:gap-4 md:gap-y-4">
								{#if edit}
									<div class="form-control w-full max-w-xs">
										<label for="name.first" class="label">
											<span class="label-text">First Name</span>
										</label>
										<Tooltip errors={$errors.name?.first}>
											<input
												type="text"
												placeholder="First name..."
												id="name.first"
												name="name.first"
												class="form-field"
												value={user.name.first}
											/>
										</Tooltip>
									</div>
									<div class="form-control w-full max-w-xs">
										<label for="name.last" class="label">
											<span class="label-text">Last Name</span>
										</label>
										<Tooltip errors={$errors.name?.last}>
											<input
												type="text"
												placeholder="Last name..."
												id="name.last"
												name="name.last"
												class="form-field"
												value={user.name.last}
											/>
										</Tooltip>
									</div>
								{:else}
									<div class="form-control w-full max-w-xs">
										<div class="label">
											<span class="label-text">First Name</span>
										</div>
										<div
											class="inline-flex flex-shrink items-center justify-start h-12 px-8 pl-4 w-full max-w-xs"
										>
											{user.name.first}
										</div>
									</div>

									<div class="form-control w-full max-w-xs">
										<div class="label">
											<span class="label-text">Last Name</span>
										</div>
										<div
											class="inline-flex flex-shrink justify-start items-center h-12 px-8 pl-4 w-full max-w-xs"
										>
											{user.name.last}
										</div>
									</div>
								{/if}
								<div class="form-control w-full max-w-xs">
									<div class="label">
										<span class="label-text">Email</span>
									</div>
									<div
										class="inline-flex flex-shrink items-center justify-start h-12 px-8 pl-4 w-full max-w-xs"
									>
										{user.email}
									</div>
								</div>
							</div>
						</form>
						<!--
              <button
                class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">Show
                Full Information
              </button>
            -->
					</div>

					<!-- End of profile tab -->
				</div>
			</div>
		</TabPanel>

		<!-- Roster Data Tab -->
		<TabPanel>
			<div class="glassmorphicBg p-3 shadow-sm rounded-sm my-4">
				<div class="flex flex-col gap-4">
					<h2 class="text-center">Posts</h2>
					<div class="flex justify-center flex-wrap gap-4">
						<Confirm confirmTitle="Delete" cancelTitle="Cancel" let:confirm={confirmThis}>
							<button
								class="btn btn-error"
								class:btn-disabled={!selected.length}
								on:click={() => confirmThis(delContent)}
							>
								Delete
							</button>
							<div class="flex flex-col gap-2" slot="title">
								<div class="text-lg font-bold">
									Are you sure you want to delete the following item(s)?
								</div>
								<div class="max-h-40 overflow-scroll">
									<ol class="ml-4 list-decimal list-inside">
										{#each selected as { title }}
											<li>{title}</li>
										{/each}
									</ol>
								</div>
							</div>
							<span slot="description">Once deleted, these works cannot be recovered...</span>
						</Confirm>

						<Confirm confirmTitle="Publish" cancelTitle="Cancel" let:confirm={confirmThis}>
							<button
								class="btn btn-primary"
								class:btn-disabled={!selected.length}
								on:click={() => confirmThis(flagPub)}
							>
								Publish
							</button>
							<div class="flex flex-col gap-2" slot="title">
								<div class="text-lg font-bold">
									Are you sure you want to set state of the following item(s) to `Published`?
								</div>
								<div class="max-h-40 overflow-scroll">
									<ol class="ml-4 list-decimal list-inside">
										{#each selected as { title }}
											<li>{title}</li>
										{/each}
									</ol>
								</div>
							</div>
							<span slot="description"
								>Once flagged as `published`, this content is publicly accessible...</span
							>
						</Confirm>

						<Confirm confirmTitle="Draft" cancelTitle="Cancel" let:confirm={confirmThis}>
							<button
								class="btn btn-secondary"
								class:btn-disabled={!selected.length}
								on:click={() => confirmThis(flagDraft)}
							>
								Draft
							</button>
							<div class="flex flex-col gap-2" slot="title">
								<div class="text-lg font-bold">
									Are you sure you want to set state of the following item(s) to `Draft`?
								</div>
								<div class="max-h-40 overflow-scroll">
									<ol class="ml-4 list-decimal list-inside">
										{#each selected as { title }}
											<li>{title}</li>
										{/each}
									</ol>
								</div>
							</div>
							<span slot="description"
								>Once flagged as `Draft`, this content is no longer publicly accessible...</span
							>
						</Confirm>

						<Confirm confirmTitle="Archive" cancelTitle="Cancel" let:confirm={confirmThis}>
							<button
								class="btn btn-accent"
								class:btn-disabled={!selected.length}
								on:click={() => confirmThis(flagArchive)}
							>
								Archive
							</button>
							<div class="flex flex-col gap-2" slot="title">
								<div class="text-lg font-bold">
									Are you sure you want to set state of the following item(s) to `Archived`?
								</div>
								<div class="max-h-40 overflow-scroll">
									<ol class="ml-4 list-decimal list-inside">
										{#each selected as { title }}
											<li>{title}</li>
										{/each}
									</ol>
								</div>
							</div>
							<span slot="description"
								>Once flagged as `Archived`, this content is no longer publicly accessible...</span
							>
						</Confirm>
					</div>
					<List
						{currentPage}
						{hasPrevPage}
						{pageCount}
						{hasNextPage}
						{nextPaginated}
						{prevPaginated}
					/>
				</div>
			</div>
		</TabPanel>

		<TabPanel>
			<div class="glassmorphicBg p-3 shadow-sm rounded-sm my-4">
				<Tiptap />
			</div>
		</TabPanel>
	</div>
</Tabs>
