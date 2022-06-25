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
	import dayjs from 'dayjs';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import IconEdit from '~icons/fluent/document-edit-24-regular';
	import IconPerson from '~icons/fluent/person-24-regular';
	import type { ContentObject, UserDocument } from '$lib/_db/mongoose.gen';

	export let user: UserDocument, contentData: ContentObject[];
	$: console.log(user);
	$: console.log(contentData);
	if (!user.name)
		user.name = {
			first: '',
			last: ''
		};

	const notifications = getNotificationsStore(),
		saveUserData = () => {
			edit = !edit;
			const postData = {
				type: 'Update',
				name: {
					first: user.name.first,
					last: user.name.last
				}
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
					notifications.success('Successfully updated your user data!');
				} else {
					notifications.error('Error; failed to update your user data!');
				}
			});
		};

	let edit = false;
	$: if (user.name.first === '' || user.name.last === '') edit = true;
</script>

<div class="container mx-auto p-5">
	<div class="md:flex no-wrap md:-mx-2">
		<!-- Left Side -->
		<div class="w-full md:w-3/12 md:mx-2 md:my-auto">
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
		<div class="w-full md:w-9/12 md:px-2 h-64 mb-4">
			<!-- Profile tab -->
			<!-- About Section -->
			<div class="glassmorphicBg p-3 shadow-sm rounded-sm my-4">
				<div class="flex my-2 gap-4 items-center font-semibold leading-8">
					<div class="flex-1 inline-flex items-center">
						<IconPerson class="mr-2 fill-current" />
						<span class="tracking-wide">About</span>
					</div>
					<div class="btn-group">
						{#if edit}
							<button class="btn btn-sm btn-primary" on:click={saveUserData}>Save</button>
						{/if}
						<button class="btn btn-sm gap-2" on:click={() => (edit = !edit)}>
							<IconEdit />
							<span>Edit</span>
						</button>
					</div>
				</div>
				<div class="grid text-sm md:grid-cols-2 md:gap-4 md:gap-y-4">
					{#if edit}
						<div class="form-control w-full max-w-xs">
							<label for="firstName" class="label">
								<span class="label-text">First Name</span>
							</label>
							<input
								type="text"
								placeholder="First name..."
								id="firstName"
								name="firstName"
								class="form-field"
								bind:value={user.name.first}
							/>
						</div>
						<div class="form-control w-full max-w-xs">
							<label for="lastName" class="label">
								<span class="label-text">Last Name</span>
							</label>
							<input
								type="text"
								placeholder="Last name..."
								id="lastName"
								name="lastName"
								class="form-field"
								bind:value={user.name.last}
							/>
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
				<!--
          <button
            class="block w-full text-blue-800 text-sm font-semibold rounded-lg hover:bg-gray-100 focus:outline-none focus:shadow-outline focus:bg-gray-100 hover:shadow-xs p-3 my-4">Show
            Full Information
          </button>
        -->
			</div>
			<!-- End of about section -->
			<!-- Experience and education -->
			<div class="glassmorphicBg p-3 shadow-sm rounded-sm my-4">
				<div class="flex flex-col gap-4">
					<h2 class="text-center">Posts</h2>
					<div class="w-1/2 mx-auto">
						{#each contentData as { content, title }}
							<h5>{title}</h5>
							{#if content?.extended}
								{content.extended}
							{/if}
						{/each}
					</div>
				</div>
			</div>
			<!-- End of profile tab -->
		</div>
	</div>
</div>
