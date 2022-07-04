<script context="module" lang="ts">
	import type { CategoryObject } from '$lib/_db/mongoose.gen';
	import type { Load } from '@sveltejs/kit';

	export const load: Load = async ({ fetch, session }) => {
		if (!session.user) {
			return {
				redirect: '/',
				status: 302
			};
		}
		const url = `/api/category`;
		const res = await fetch(url, {
			method: 'GET',
			headers: {
				accept: 'application/json'
			}
		});
		const {
			itemList: categories,
			currentPage,
			hasNextPage,
			hasPrevPage,
			pageCount,
			prev,
			next
		} = await res.json();

		//console.log(userData);
		return {
			props: {
				categories,
				currentPage,
				hasNextPage,
				hasPrevPage,
				pageCount,
				prev,
				next
			}
		};
	};
</script>

<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import { z } from 'zod';
	import { getCategoryStore } from '$lib/data/stores/categories';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import { CategoryPOSTType } from '$lib/const';
	import List from '$lib/ux/category/List.svelte';
	import Tooltip from '$lib/ux/forms/Tooltip.svelte';
	export let categories: CategoryObject[],
		currentPage: number,
		hasPrevPage: boolean,
		hasNextPage: boolean,
		pageCount: number,
		prev: number,
		next: number;

	const notifications = getNotificationsStore();

	const loadContent = (page: number) => {
		if (!page) return;
		return fetch(`/api/category?pg=${page}`)
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
				catStore.set(tempItems);
				currentPage = tempCurrentPage;
				hasPrevPage = tempHasPrev;
				hasNextPage = tempHasNext;
				pageCount = tempPgCount;
				prev = tempPrev;
				next = tempNext;
			});
	};

	const prevPaginated = () => {
		return loadContent(prev);
	};

	const nextPaginated = () => {
		return loadContent(next);
	};

	const schema = z.object({
		name: z.string().min(3, 'Category `name` must have at least 3 character(s)')
	});
	const catStore = getCategoryStore();
	catStore.set(categories.map((cat) => ({ ...cat, checked: false })));

	const { form, errors, isValid } = createForm<z.infer<typeof schema>>({
		onSubmit: (values) => {
			return fetch('/api/category', {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'content-type': 'application/json'
				},
				body: JSON.stringify({ ...values, type: CategoryPOSTType.ADD })
			}).then(async (res) => {
				if (res.status === 200) {
					const { cat } = await res.json();
					catStore.update((val) => [...val, cat]);
					notifications.success('Category added successfully');
				} else {
					const { error } = await res.json();
					notifications.error(error);
				}
			});
		},
		extend: validator({ schema })
	});
</script>

<div class="flex flex-col gap-4 mx-auto sm:container">
	<div class="text-sm breadcrumbs">
		<ul>
			<li><a href="/profile" sveltekit:prefetch>Profile</a></li>
			<li>Settings</li>
		</ul>
	</div>
	<div class="flex flex-wrap justify-center gap-4">
		<div class="collapse">
			<input type="checkbox" />
			<div class="collapse-title text-xl font-medium">Show/Hide + Category</div>
			<div class="collapse-content">
				<form class="flex flex-col gap-4 pt-4" use:form>
					<div>
						<label for="name" class="label cursor-pointer gap-4">
							<span class="label-text">Category Name:</span>
						</label>
						<Tooltip errors={$errors.name}>
							<input type="text" id="name" name="name" class="form-field" />
						</Tooltip>
					</div>
					<button
						type="submit"
						class="btn w-1/2 self-center btn-sm btn-primary"
						disabled={!$isValid}>Add</button
					>
				</form>
			</div>
		</div>
	</div>
	<List {currentPage} {hasPrevPage} {pageCount} {hasNextPage} {nextPaginated} {prevPaginated} />
</div>
