<script lang="ts">
	import { createForm } from 'felte';
	import { validator } from '@felte/validator-zod';
	import reporter from '@felte/reporter-tippy';
	import { z } from 'zod';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import Tooltip from '$lib/ux/forms/Tooltip.svelte';
	export let modalId: string;

	const notifications = getNotificationsStore();

	const schema = z.object({
		email: z.string().email()
	});

	const { form, errors, isValid } = createForm<z.infer<typeof schema>>({
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
		},
		extend: validator({ schema })
	});
</script>

<input type="checkbox" id={modalId} class="modal-toggle" />
<label for={modalId} class="modal modal-bottom sm:modal-middle cursor-pointer">
	<label class="modal-box relative" for="">
		<h3 class="text-lg font-bold text-center py-4">Login / Register</h3>
		<div class="flex flex-col gap-4 items-center p-1">
			<form use:form>
				<div class="flex flex-col gap-4 items-center">
					<div class="form-control w-full max-w-xs">
						<label for="email" class="label cursor-pointer gap-4">
							<span class="label-text">Email:</span>
						</label>
						<Tooltip errors={$errors.email}>
							<input type="email" id="email" name="email" class="form-field" />
						</Tooltip>
					</div>
					<button class="btn" class:btn-disabled={!isValid} type="submit">submit</button>
				</div>
			</form>
		</div>
	</label>
</label>
