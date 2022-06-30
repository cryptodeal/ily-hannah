<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import { shortcut } from '$lib/ux/shortcut';
	import UAParser from 'ua-parser-js';
	import StarterKit from '@tiptap/starter-kit';
	import Header1 from '~icons/fluent/text-header-1-20-filled';
	import Header2 from '~icons/fluent/text-header-2-20-filled';
	import Header3 from '~icons/fluent/text-header-3-20-filled';
	import Bold from '~icons/fluent/text-bold-20-filled';
	import Italic from '~icons/fluent/text-italic-20-filled';
	import Paragraph from '~icons/fluent/text-paragraph-20-filled';
	import BlockQuote from '~icons/fluent/text-quote-20-filled';
	import BulletList from '~icons/fluent/apps-list-20-filled';
	import OrderedList from '~icons/fluent/text-number-list-ltr-20-filled';
	import SplitList from '~icons/fluent/arrow-split-20-filled';
	import Indent from '~icons/fluent/keyboard-tab-20-filled';
	import Undo from '~icons/dashicons/undo';
	import Redo from '~icons/dashicons/redo';
	import Save from '~icons/fluent/save-20-regular';
	import Edit from '~icons/fluent/code-text-edit-20-filled';
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';
	import type { Editor as CoreEditor, JSONContent } from '@tiptap/core';
	import type { Readable, Writable } from 'svelte/store';
	import type { CategoryDocument, UserDocument } from '$lib/_db/mongoose.gen';
	import type { ContentObjectSelect } from '$lib/_db/controllers/content';

	export let content: JSONContent | string = '',
		_id: string | undefined = undefined;
	let editor: Readable<Editor>,
		isApple = false,
		showHotKeys = true,
		editMeta = false;
	const notifications = getNotificationsStore();

	onMount(() => {
		const {
			os: { name },
			device: { type }
		} = new UAParser().getResult();
		if (name?.includes('Mac')) isApple = true;
		if (type === 'mobile' || type === 'smarttv' || type === 'wearable' || type === 'embedded')
			showHotKeys = false;
		editor = createEditor({
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class:
						'prose text-base min-h-[300px] max-h-[70vh] sm:max-h-[75vh] lg:max-h-[80vh] overflow-scroll prose-sm sm:prose md:container mx-auto border-2 border-black rounded-b-md p-3 outline-none'
				}
			},
			content
		});
	});
	const toggleHeading = (level: 1 | 2 | 3) => {
		return () => {
			($editor as unknown as CoreEditor).chain().focus().toggleHeading({ level }).run();
		};
	};
	const toggleBold = () => {
		($editor as unknown as CoreEditor).chain().focus().toggleBold().run();
	};
	const toggleItalic = () => {
		($editor as unknown as CoreEditor).chain().focus().toggleItalic().run();
	};
	const toggleBulletList = () => {
		($editor as unknown as CoreEditor).chain().focus().toggleBulletList().run();
	};
	const toggleOrderedList = () => {
		($editor as unknown as CoreEditor).chain().focus().toggleOrderedList().run();
	};
	const splitListItem = () => {
		($editor as unknown as CoreEditor).chain().focus().splitListItem('listItem').run();
	};
	const sinkListItem = () => {
		($editor as unknown as CoreEditor).chain().focus().sinkListItem('listItem').run();
	};
	const liftListItem = () => {
		($editor as unknown as CoreEditor).chain().focus().liftListItem('listItem').run();
	};
	const setParagraph = () => {
		($editor as unknown as CoreEditor).chain().focus().setParagraph().run();
	};
	const setBlockquote = () => {
		($editor as unknown as CoreEditor).chain().focus().setBlockquote().run();
	};
	let title = '',
		state = 'draft',
		authors: UserDocument['_id'][] = [],
		categories: CategoryDocument['_id'][] = [];
	const exportJSON = () => {
		return ($editor as unknown as CoreEditor).getJSON();
	};
	const contentList: Writable<ContentObjectSelect[]> = getContext('content-list');
	function save() {
		const content = {
			extended: exportJSON()
		};
		return fetch('/api/content', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				_id,
				state,
				title,
				authors,
				content,
				categories
			})
		})
			.then((res) => {
				if (res.status === 200) {
					notifications.success('Whoo! Saved Post Successfully :)');
					return res.json();
				} else if (res.status === 401) {
					notifications.error('Must login to save your content! :)');
					return false;
				} else {
					notifications.error('Error; failed to save content...');
					return false;
				}
			})
			.then((res: boolean | { content: ContentObjectSelect }) => {
				if (!res) return;
				const { content } = res as { content: ContentObjectSelect };
				contentList.update((state) => [...state.filter((s) => s._id !== content._id), content]);
				_id = content._id.toString();
			});
	}
	$: if (!title || title === '') editMeta = true;
	const undo = () => {
		($editor as unknown as CoreEditor).chain().focus().undo().run();
	};
	const redo = () => {
		($editor as unknown as CoreEditor).chain().focus().redo().run();
	};
	$: isActive = (name: string, attrs = {}) =>
		($editor as unknown as CoreEditor).isActive(name, attrs);
</script>

{#if editor}
	<div class="md:container mx-auto flex flex-col gap-10">
		<div class="card card-compact bg-primary text-primary-content shadow-xl">
			<div class="card-body">
				{#if editMeta}
					<div class="form-control bg-primary text-primary-content">
						<label for="editTitle" class="label">
							<span class="card-title">Title</span>
						</label>
						<textarea
							class="textarea bg-primary textarea-secondary text-primary-content placeholder:text-primary-content"
							class:textarea-error={!title}
							bind:value={title}
							placeholder="Title"
						/>
					</div>
				{:else}
					<h2 class="card-title">{title}</h2>
				{/if}
				<div class="card-actions justify-center">
					<button
						class="btn btn-accent gap-1"
						class:btn-disabled={!title || title === ''}
						on:click={() => (editMeta = !editMeta)}
					>
						<Edit class="w-6 h-6" />
						Edit
					</button>
					<button
						class="btn btn-secondary gap-1"
						disabled={!$editor.can().undo()}
						use:shortcut={{ control: true, code: 'KeyS' }}
						on:click={save}
					>
						<Save class="w-6 h-6" />
						Save
					</button>
				</div>
			</div>
		</div>
		<div
			class="prose prose-sm sm:prose md:container mx-auto border-black border-2 border-b-0 rounded-t-md p-2 flex flex-wrap gap-2"
		>
			<div class="btn-group flex-row">
				<div
					class="tooltip tooltip-primary"
					data-tip="Heading 1{showHotKeys && isApple
						? ' (CMD + Alt + 1)'
						: showHotKeys && !isApple
						? ' (CTRL + Alt + 1)'
						: ''}"
				>
					<button
						class="btn rounded-r-none btn-square btn-sm"
						class:active={isActive('heading', { level: 1 })}
						on:click={toggleHeading(1)}
					>
						<Header1 />
					</button>
				</div>
				<div
					class="tooltip tooltip-primary"
					data-tip="Heading 2{showHotKeys && isApple
						? ' (CMD + Alt + 2)'
						: showHotKeys && !isApple
						? ' (CTRL + Alt + 2)'
						: ''}"
				>
					<button
						class="btn rounded-l-none rounded-r-none btn-square btn-sm"
						class:active={isActive('heading', { level: 2 })}
						on:click={toggleHeading(2)}
					>
						<Header2 />
					</button>
				</div>
				<div
					class="tooltip tooltip-primary"
					data-tip="Heading 3{showHotKeys && isApple
						? ' (CMD + Alt + 3)'
						: showHotKeys && !isApple
						? ' (CTRL + Alt + 3)'
						: ''}"
				>
					<button
						class="btn rounded-l-none btn-square btn-sm"
						class:active={isActive('heading', { level: 3 })}
						on:click={toggleHeading(3)}
					>
						<Header3 />
					</button>
				</div>
			</div>
			<div
				class="tooltip tooltip-primary"
				data-tip="Paragraph{showHotKeys && isApple
					? ' (CMD + Alt + 0)'
					: showHotKeys && !isApple
					? ' (CTRL + Alt + 0)'
					: ''}"
			>
				<button
					class="btn btn-square btn-sm"
					class:active={isActive('paragraph')}
					on:click={setParagraph}
				>
					<Paragraph />
				</button>
			</div>
			<div
				class="tooltip tooltip-primary"
				data-tip="Bold{showHotKeys && isApple
					? ' (CMD + B)'
					: showHotKeys && !isApple
					? ' (CTRL + B)'
					: ''}"
			>
				<button class="btn btn-square btn-sm" class:active={isActive('bold')} on:click={toggleBold}>
					<Bold />
				</button>
			</div>
			<div
				class="tooltip tooltip-primary"
				data-tip="Italic{showHotKeys && isApple
					? ' (CMD + I)'
					: showHotKeys && !isApple
					? ' (CTRL + I)'
					: ''}"
			>
				<button
					class="btn btn-square btn-sm"
					class:active={isActive('italic')}
					on:click={toggleItalic}
				>
					<Italic />
				</button>
			</div>
			<div
				class="tooltip tooltip-primary"
				data-tip="Blockquote{showHotKeys && isApple
					? ' (CMD + Shift + B)'
					: showHotKeys && !isApple
					? ' (CTRL + Shift + B)'
					: ''}"
			>
				<button
					class="btn btn-square btn-sm"
					class:active={isActive('blockquote')}
					on:click={setBlockquote}
				>
					<BlockQuote />
				</button>
			</div>
			<div class="flex gap-2 items-center">
				<div class="btn-group flex-row">
					<div
						class="tooltip tooltip-primary"
						data-tip="Bulleted List{showHotKeys && isApple
							? ' (CMD + Shift + 8)'
							: showHotKeys && !isApple
							? ' (CTRL + Shift + 8)'
							: ''}"
					>
						<button
							class="btn btn-square btn-sm rounded-r-none"
							class:active={isActive('bulletList')}
							on:click={toggleBulletList}
						>
							<BulletList />
						</button>
					</div>
					<div
						class="tooltip tooltip-primary"
						data-tip="Ordered List{showHotKeys && isApple
							? ' (CMD + Shift + 7)'
							: showHotKeys && !isApple
							? ' (CTRL + Shift + 7)'
							: ''}"
					>
						<button
							class="btn btn-square btn-sm rounded-l-none"
							class:active={isActive('orderedList')}
							on:click={toggleOrderedList}
						>
							<OrderedList />
						</button>
					</div>
				</div>
				<div class="btn-group flex-row">
					<div
						class="tooltip tooltip-primary"
						data-tip="Split List Item{showHotKeys ? ' (Enter)' : ''}"
					>
						<button
							class="btn rounded-r-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().splitListItem('listItem')}
							on:click={splitListItem}
						>
							<SplitList class="rotate-90" />
						</button>
					</div>
					<div
						class="tooltip tooltip-primary"
						data-tip="Sink List Item{showHotKeys ? ' (Tab)' : ''}"
					>
						<button
							class="btn rounded-l-none rounded-r-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().sinkListItem('listItem')}
							on:click={sinkListItem}
						>
							<Indent />
						</button>
					</div>
					<div
						class="tooltip tooltip-primary"
						data-tip="Lift List Item{showHotKeys ? ' (Shift + Tab)' : ''}"
					>
						<button
							class="btn rounded-l-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().liftListItem('listItem')}
							on:click={liftListItem}
						>
							<Indent class="rotate-180" />
						</button>
					</div>
				</div>
			</div>
			<div class="btn-group flex-row">
				<div
					class="tooltip tooltip-primary"
					data-tip="Undo{showHotKeys && isApple
						? ' (CMD + Z)'
						: showHotKeys && !isApple
						? ' (CTRL + Z)'
						: ''}"
				>
					<button
						class="btn rounded-r-none btn-square btn-sm"
						class:btn-disabled={!$editor.can().undo()}
						on:click={undo}
					>
						<Undo />
					</button>
				</div>
				<div
					class="tooltip tooltip-primary"
					data-tip="Redo{showHotKeys && isApple
						? ' (Shift + CMD + Z)'
						: showHotKeys && !isApple
						? ' (Shift + CTRL + Z)'
						: ''}"
				>
					<button
						class="btn rounded-l-none btn-square btn-sm"
						class:btn-disabled={!$editor.can().redo()}
						on:click={redo}
					>
						<Redo />
					</button>
				</div>
			</div>
			<div
				class="tooltip tooltip-primary"
				data-tip="Save{showHotKeys && isApple
					? ' (CMD + S)'
					: showHotKeys && !isApple
					? ' (CTRL + S)'
					: ''}"
			>
				<button
					class="btn rounded-l-none btn-square btn-sm"
					disabled={!$editor.can().undo()}
					use:shortcut={{ control: true, code: 'KeyS' }}
					on:click={save}
				>
					<Save />
				</button>
			</div>
		</div>
	</div>
{/if}
<EditorContent editor={$editor} />

<style lang="postcss">
	button.active {
		@apply bg-primary text-primary-content;
	}
</style>
