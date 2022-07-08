<script lang="ts">
	import MultiSelect from 'svelte-multiselect';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import CatSlot from './SelectSlot.svelte';
	import CatOptSlot from './OptSlot.svelte';
	import { writable } from 'svelte/store';
	import type { CatObjectOption } from '$lib/types';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	const notifications = getNotificationsStore();
	export let selectedCats = writable<CatObjectOption[]>([]),
		saveBtn = false;

	const categories = getCategoryStore();
	const saveTeamSubs = () => {
		const postData = {
			type: 'Update',
			teamSubs: $selectedCats.map((t) => t.value)
		};
		return fetch('/profile.json', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(postData)
		}).then((res) => {
			if (res.status === 200) {
				notifications.success('Successfully saved your Team Subscriptions!');
			} else {
				notifications.error('Error; failed to update your Team Subscriptions!');
			}
		});
	};
</script>

<label for="teamSubsList" class="text-lg font-bold text-center">Categories</label>
<MultiSelect
	id="teamSubsList"
	options={$categories}
	placeholder="Select categories..."
	bind:selected={$selectedCats}
>
	<CatSlot let:option {option} slot="selected" />
	<CatOptSlot let:option {option} slot="option" />
</MultiSelect>
{#if saveBtn}
	<button class="btn" on:click={saveTeamSubs}>Save</button>
{/if}
