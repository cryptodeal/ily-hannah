<script lang="ts">
	import { fly, fade } from 'svelte/transition';
	export let confirmTitle = 'Confirm';
	export let cancelTitle = 'Cancel';
	let showDialog = false;
	type ConfirmAction = (opts?: never[]) => void;
	let functionToCall: {
		func: ConfirmAction;
		args: never[];
	} = {
		func: () => {
			return;
		},
		args: []
	};
	function callFunction() {
		showDialog = false;
		functionToCall['func'](...functionToCall['args']);
	}
	function confirm(func: ConfirmAction, ...args: never[]) {
		functionToCall = { func, args };
		showDialog = true;
	}
</script>

<slot {confirm} />

{#if showDialog}
	<div class="overlay" in:fade={{ duration: 200 }} out:fade={{ delay: 200, duration: 200 }} />
	<div
		class="confirm-dialog bg-base-100"
		in:fly={{
			y: -10,
			delay: 200,
			duration: 200
		}}
		out:fly={{
			y: -10,
			duration: 200
		}}
	>
		<div class="flex flex-col gap-4 text-base-content">
			<div class="text-base-content flex flex-col gap-1">
				<slot name="title">Are you sure you want to perform this action?</slot>
			</div>
			<div class="text-base-content">
				<slot name="description">This action can't be undone!</slot>
			</div>
		</div>

		<div class="modal-action gap-1">
			<button class="btn btn-sm btn-outline btn-error" on:click={() => (showDialog = false)}>
				<slot name="cancel">
					{cancelTitle}
				</slot>
			</button>
			<button class="btn btn-sm btn-primary" on:click={callFunction}>
				<slot name="confirm">
					{confirmTitle}
				</slot>
			</button>
		</div>
	</div>
{/if}

<style lang="postcss">
	.confirm-dialog {
		max-height: calc(100vh - 9.5em);
		width: 91.666667%;
		max-width: 32rem;
		border-top-left-radius: var(--rounded-box, 1rem);
		border-top-right-radius: var(--rounded-box, 1rem);
		border-bottom-left-radius: var(--rounded-box, 1rem);
		border-bottom-right-radius: var(--rounded-box, 1rem);
		box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
		overflow-y: auto;
		overscroll-behavior: contain;
		font-family: sans-serif;
		position: absolute;
		z-index: 999;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		padding: 1.5rem;
	}

	.overlay {
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		position: fixed;
		user-select: none;
		z-index: 998;
		background: hsla(0, 0%, 0%, 80%);
	}
</style>
