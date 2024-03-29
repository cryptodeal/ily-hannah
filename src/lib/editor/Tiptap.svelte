<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { getCategoryStore } from '$lib/data/stores/baseCategories';
	import type { CatObjectOption } from '$lib/types';
	import { printEditorContent } from './utils/print';
	import { session } from '$app/stores';
	import { getNotificationsStore } from '$lib/data/stores/notifs';
	import { shortcut } from '$lib/ux/shortcut';
	import UAParser from 'ua-parser-js';
	import { TextAlign } from '@tiptap/extension-text-align';
	import { Heading } from '@tiptap/extension-heading';
	import { Blockquote } from '@tiptap/extension-blockquote';
	import { Dropcursor } from '@tiptap/extension-dropcursor';
	import { Image } from '@tiptap/extension-image';
	import { ListItem } from '@tiptap/extension-list-item';
	import { TitledDoc } from '$lib/editor/extensions/TitledDoc';
	import { Placeholder } from '@tiptap/extension-placeholder';
	import { HardBreak } from '@tiptap/extension-hard-break';
	import { BulletList } from '@tiptap/extension-bullet-list';
	import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
	import { OrderedList } from '@tiptap/extension-ordered-list';
	import { Paragraph } from '@tiptap/extension-paragraph';
	import { Text } from '@tiptap/extension-text';
	import { Bold } from '@tiptap/extension-bold';
	import { Italic } from '@tiptap/extension-italic';
	import { Strike } from '@tiptap/extension-strike';
	import { History } from '@tiptap/extension-history';
	import Info from '~icons/fluent/info-20-regular';
	import Header2 from '~icons/fluent/text-header-2-20-filled';
	import Header3 from '~icons/fluent/text-header-3-20-filled';
	import BoldIcon from '~icons/fluent/text-bold-20-filled';
	import ItalicIcon from '~icons/fluent/text-italic-20-filled';
	import ParagraphIcon from '~icons/fluent/text-paragraph-20-filled';
	import BlockQuote from '~icons/fluent/text-quote-20-filled';
	import BulletListIcon from '~icons/fluent/apps-list-20-filled';
	import OrderedListIcon from '~icons/fluent/text-number-list-ltr-20-filled';
	import SplitList from '~icons/fluent/arrow-split-20-filled';
	import Indent from '~icons/fluent/keyboard-tab-20-filled';
	import Undo from '~icons/dashicons/undo';
	import Redo from '~icons/dashicons/redo';
	import Save from '~icons/fluent/save-20-regular';
	import PrintIcon from '~icons/fluent/print-20-filled';
	import TextAlignLeft from '~icons/fluent/text-align-left-20-filled';
	import TextAlignCenter from '~icons/fluent/text-align-center-20-filled';
	import TextAlignRight from '~icons/fluent/text-align-right-20-filled';
	import TextAlignJustify from '~icons/fluent/text-align-justify-20-filled';
	import ResetAlign from '~icons/fluent/arrow-reset-20-regular';
	import ImageIcon from '~icons/fluent/image-20-filled';
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';
	import type { Content } from '@tiptap/core';
	import type { Readable, Writable } from 'svelte/store';
	import type { CategoryDocument, CategoryObject, UserDocument } from '$lib/_db/mongoose.gen';
	import type { ContentObjectSelect } from '$lib/_db/controllers/content';
	import Tooltip from '$lib/ux/Tooltip.svelte';
	import CatSelect from './utils/CatSelect.svelte';

	export let content: Content = null,
		brief: string | undefined = undefined,
		_id: string | undefined = undefined,
		state = 'draft',
		authors: UserDocument['_id'][] = [],
		categories: (CategoryDocument['_id'] | CategoryDocument)[] = [];
	let editor: Readable<Editor>,
		isApple = false,
		showHotKeys = true;
	const notifications = getNotificationsStore();
	const catList = getCategoryStore();
	const selectedCats = writable<CatObjectOption[]>([]);

	onMount(() => {
		const {
			os: { name },
			device: { type }
		} = new UAParser().getResult();
		if (name?.includes('Mac')) isApple = true;
		if (type === 'mobile' || type === 'smarttv' || type === 'wearable' || type === 'embedded')
			showHotKeys = false;
		editor = createEditor({
			extensions: [
				Heading,
				History,
				Blockquote,
				ListItem,
				TitledDoc,
				HardBreak,
				HorizontalRule,
				BulletList,
				OrderedList,
				Paragraph,
				Text,
				Image.configure({
					HTMLAttributes: {
						class: 'h-auto max-w-full mx-auto center'
					}
				}),
				Placeholder.configure({
					placeholder: ({ node }) => {
						if (node.type.name === 'heading' && node.attrs.level === 1) {
							return 'What’s the title?';
						}

						return '';
					}
				}),
				Dropcursor,
				TextAlign.configure({
					types: ['heading', 'paragraph']
				}),
				Bold,
				Italic,
				Strike
			],
			editorProps: {
				attributes: {
					id: 'el-tiptap-editor__content',
					class:
						'prose min-h-[300px] text-base print:border-none print:max-h-content print:overflow-visible max-h-[70vh] sm:max-h-[75vh] lg:max-h-[80vh] overflow-scroll prose-sm sm:prose md:container mx-auto border-2 border-black rounded-b-md p-3 outline-none'
				}
			},
			content
		});
		fetch(`/api/category?type=all`)
			.then((res) => res.json())
			.then((data: { categories: CategoryObject[] }) => {
				const { categories: cats } = data;
				catList.set(cats.map((c) => ({ label: c.name, value: c._id })));
				const selected = cats.filter(
					(c) =>
						categories.filter((cat) =>
							cat._id
								? cat._id.toString() === c._id.toString()
								: cat.toString() === c._id.toString()
						).length
				);
				console.log(selected);
				selectedCats.set(selected.map((c) => ({ label: c.name, value: c._id })));
			});
	});

	const setImage = (src: string) => {
		$editor.chain().focus().setImage({ src }).run();
	};
	const addImage = () => {
		const url = window.prompt('URL');
		if (url) setImage(url);
	};
	const toggleHeading = (level: 2 | 3) => {
		return () => {
			$editor.chain().focus().toggleHeading({ level }).run();
		};
	};
	const toggleBold = () => {
		$editor.chain().focus().toggleBold().run();
	};
	const toggleItalic = () => {
		$editor.chain().focus().toggleItalic().run();
	};
	const toggleBulletList = () => {
		$editor.chain().focus().toggleBulletList().run();
	};
	const toggleOrderedList = () => {
		$editor.chain().focus().toggleOrderedList().run();
	};
	const splitListItem = () => {
		$editor.chain().focus().splitListItem('listItem').run();
	};
	const sinkListItem = () => {
		$editor.chain().focus().sinkListItem('listItem').run();
	};
	const liftListItem = () => {
		$editor.chain().focus().liftListItem('listItem').run();
	};
	const setParagraph = () => {
		$editor.chain().focus().setParagraph().run();
	};
	const setBlockquote = () => {
		$editor.chain().focus().setBlockquote().run();
	};
	const textAlignLeft = () => {
		$editor.chain().focus().setTextAlign('left').run();
	};
	const textAlignCenter = () => {
		$editor.chain().focus().setTextAlign('center').run();
	};
	const textAlignRight = () => {
		$editor.chain().focus().setTextAlign('right').run();
	};
	const textAlignJustify = () => {
		$editor.chain().focus().setTextAlign('justify').run();
	};
	const unsetTextAlign = () => {
		$editor.chain().focus().unsetTextAlign().run();
	};
	const exportJSON = () => {
		return $editor.getJSON();
	};
	const print = () => {
		return printEditorContent();
	};
	const contentList: Writable<ContentObjectSelect[]> = getContext('content-list');
	function save() {
		const content = {
			extended: exportJSON(),
			brief
		};
		const tempId = $session.user?.id;
		const authorData =
			authors.length && tempId && authors.filter((a) => a.toString() === tempId)
				? [authors]
				: [tempId];
		return fetch('/api/content', {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				_id,
				state,
				title: tempTitle,
				authors: authorData,
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
	const undo = () => {
		$editor.chain().focus().undo().run();
	};
	const redo = () => {
		$editor.chain().focus().redo().run();
	};
	$: isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	$: tempTitle = $editor?.view.state.doc.content.firstChild?.content.firstChild?.text || '';
</script>

{#if editor}
	<div class="md:container mx-auto flex flex-col gap-10">
		<div
			class="print:hidden card card-compact p-0 overflow-visible bg-transparent text-base-content shadow-xl"
		>
			<div class="card-body">
				<div class="card-title">
					Title
					<Tooltip color={'primary'} dataTip="Edit title in document">
						<Info class="stroke-primary h-5 w-5" />
					</Tooltip>
				</div>
				<h1 class="break-words py-1">{tempTitle}</h1>

				<div class="card-title">Content Metadata</div>

				<div class="flex flex-wrap gap-2 md:gap-10">
					<div
						class="card overflow-visible card-compact w-full sm:w-auto bg-primary text-primary-content shadow-xl"
					>
						<div class="card-body max-w-full">
							<CatSelect {selectedCats} />
						</div>
					</div>

					<div class="card card-compact w-full sm:w-auto bg-primary text-primary-content shadow-xl">
						<div class="card-body gap-1">
							<h2 class="card-title">State</h2>
							<div class="form-control">
								<label class="label gap-2 cursor-pointer">
									<span class="text-primary-content label-text">Draft</span>
									<input
										type="radio"
										class="radio border-primary-content"
										bind:group={state}
										name="state"
										value={'draft'}
									/>
								</label>
							</div>
							<div class="form-control">
								<label class="label gap-2 cursor-pointer">
									<span class="text-primary-content label-text">Published</span>
									<input
										type="radio"
										class="radio border-primary-content"
										bind:group={state}
										name="state"
										value={'published'}
									/>
								</label>
							</div>
							<div class="form-control">
								<label class="label gap-2 cursor-pointer">
									<span class="text-primary-content label-text">Archived</span>
									<input
										type="radio"
										class="radio border-primary-content"
										bind:group={state}
										name="state"
										value={'archived'}
									/>
								</label>
							</div>
						</div>
					</div>
					<div
						class="card overflow-visible card-compact w-full sm:w-auto bg-primary text-primary-content shadow-xl"
					>
						<div class="card-body">
							<h2 class="card-title">
								Brief
								<Tooltip color={'secondary'} dataTip="Brief Summary">
									<Info class="h-5 w-5 stroke-primary-content" />
								</Tooltip>
							</h2>
							<textarea
								class="textarea text-base textarea-bordered text-base-content textarea-secondary h-auto"
								bind:value={brief}
								name="Content_Brief"
								id="Content_Brief"
								placeholder="TL;DR..."
							/>
						</div>
					</div>
				</div>

				<div class="card-actions justify-center">
					<button
						class="btn btn-accent gap-1"
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
		<div class="hidden print:text-center print:prose print:block">
			<h1 class="break-words">{tempTitle}</h1>
		</div>
		<div
			class="prose prose-sm print:hidden sm:prose md:container mx-auto border-black border-2 border-b-0 rounded-t-md p-2 flex flex-wrap gap-2"
		>
			<div class="btn-group flex-row">
				<Tooltip
					color={'primary'}
					dataTip="Heading 2{showHotKeys && isApple
						? ' (CMD + Alt + 2)'
						: showHotKeys && !isApple
						? ' (CTRL + Alt + 2)'
						: ''}"
				>
					<button
						class="btn rounded-r-none btn-square btn-sm"
						class:active={isActive('heading', { level: 2 })}
						on:click={toggleHeading(2)}
					>
						<Header2 />
					</button>
				</Tooltip>

				<Tooltip
					color={'primary'}
					dataTip="Heading 3{showHotKeys && isApple
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
				</Tooltip>
			</div>

			<Tooltip
				color={'primary'}
				dataTip="Paragraph{showHotKeys && isApple
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
					<ParagraphIcon />
				</button>
			</Tooltip>

			<Tooltip
				color={'primary'}
				dataTip="Bold{showHotKeys && isApple
					? ' (CMD + B)'
					: showHotKeys && !isApple
					? ' (CTRL + B)'
					: ''}"
			>
				<button class="btn btn-square btn-sm" class:active={isActive('bold')} on:click={toggleBold}>
					<BoldIcon />
				</button>
			</Tooltip>

			<Tooltip
				color={'primary'}
				dataTip="Italic{showHotKeys && isApple
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
					<ItalicIcon />
				</button>
			</Tooltip>

			<Tooltip
				color={'primary'}
				dataTip="Blockquote{showHotKeys && isApple
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
			</Tooltip>

			<div class="flex gap-2 items-center">
				<div class="btn-group flex-row">
					<Tooltip
						color={'primary'}
						dataTip="Bulleted List{showHotKeys && isApple
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
							<BulletListIcon />
						</button>
					</Tooltip>

					<Tooltip
						color={'primary'}
						dataTip="Ordered List{showHotKeys && isApple
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
							<OrderedListIcon />
						</button>
					</Tooltip>
				</div>
				<div class="btn-group flex-row">
					<Tooltip color={'primary'} dataTip="Split List Item{showHotKeys ? ' (Enter)' : ''}">
						<button
							class="btn rounded-r-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().splitListItem('listItem')}
							on:click={splitListItem}
						>
							<SplitList class="rotate-90" />
						</button>
					</Tooltip>

					<Tooltip color={'primary'} dataTip="Sink List Item{showHotKeys ? ' (Tab)' : ''}">
						<button
							class="btn rounded-l-none rounded-r-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().sinkListItem('listItem')}
							on:click={sinkListItem}
						>
							<Indent />
						</button>
					</Tooltip>

					<Tooltip color={'primary'} dataTip="Lift List Item{showHotKeys ? ' (Shift + Tab)' : ''}">
						<button
							class="btn rounded-l-none btn-square btn-sm"
							class:btn-disabled={!$editor.can().liftListItem('listItem')}
							on:click={liftListItem}
						>
							<Indent class="rotate-180" />
						</button>
					</Tooltip>
				</div>
			</div>

			<div class="btn-group flex-row">
				<Tooltip
					color={'primary'}
					dataTip="Align Left{showHotKeys && isApple
						? ' (CMD + Shift + L)'
						: showHotKeys && !isApple
						? ' (CTRL + Shift + L)'
						: ''}"
				>
					<button
						class="btn rounded-r-none btn-square btn-sm"
						class:active={$editor.isActive({ textAlign: 'left' })}
						on:click={textAlignLeft}
					>
						<TextAlignLeft />
					</button>
				</Tooltip>

				<Tooltip
					color={'primary'}
					dataTip="Align Center{showHotKeys && isApple
						? ' (CMD + Shift + E)'
						: showHotKeys && !isApple
						? ' (CTRL + Shift + E)'
						: ''}"
				>
					<button
						class="btn rounded-l-none rounded-r-none btn-square btn-sm"
						class:active={$editor.isActive({ textAlign: 'center' })}
						on:click={textAlignCenter}
					>
						<TextAlignCenter />
					</button>
				</Tooltip>

				<Tooltip
					color={'primary'}
					dataTip="Align Right{showHotKeys && isApple
						? ' (CMD + Shift + R)'
						: showHotKeys && !isApple
						? ' (CTRL + Shift + R)'
						: ''}"
				>
					<button
						class="btn rounded-l-none rounded-r-none btn-square btn-sm"
						class:active={$editor.isActive({ textAlign: 'right' })}
						on:click={textAlignRight}
					>
						<TextAlignRight />
					</button>
				</Tooltip>

				<Tooltip
					color={'primary'}
					dataTip="Align Justify{showHotKeys && isApple
						? ' (CMD + Shift + J)'
						: showHotKeys && !isApple
						? ' (CTRL + Shift + J)'
						: ''}"
				>
					<button
						class="btn rounded-l-none btn-square btn-sm"
						class:active={$editor.isActive({ textAlign: 'justify' })}
						on:click={textAlignJustify}
					>
						<TextAlignJustify />
					</button>
				</Tooltip>

				<Tooltip color={'primary'} dataTip="Reset Alignment">
					<button class="ml-1 btn btn-square btn-sm" on:click={unsetTextAlign}>
						<ResetAlign />
					</button>
				</Tooltip>
			</div>

			<Tooltip color={'primary'} dataTip="Add Image">
				<button class="btn btn-square btn-sm" on:click={addImage}>
					<ImageIcon />
				</button>
			</Tooltip>

			<div class="btn-group flex-row">
				<Tooltip
					color={'primary'}
					dataTip="Undo{showHotKeys && isApple
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
				</Tooltip>

				<Tooltip
					color={'primary'}
					dataTip="Redo{showHotKeys && isApple
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
				</Tooltip>
			</div>

			<Tooltip
				color={'primary'}
				dataTip="Save{showHotKeys && isApple
					? ' (CMD + S)'
					: showHotKeys && !isApple
					? ' (CTRL + S)'
					: ''}"
			>
				<button
					class="btn btn-square btn-sm"
					disabled={!$editor.can().undo()}
					use:shortcut={{ control: true, code: 'KeyS' }}
					on:click={save}
				>
					<Save />
				</button>
			</Tooltip>

			<Tooltip
				color={'primary'}
				dataTip="Print{showHotKeys && isApple
					? ' (CMD + P)'
					: showHotKeys && !isApple
					? ' (CTRL + P)'
					: ''}"
			>
				<button
					class="btn btn-square btn-sm"
					use:shortcut={{ control: true, code: 'KeyP' }}
					on:click={print}
				>
					<PrintIcon />
				</button>
			</Tooltip>
		</div>
	</div>
{/if}
<div>
	<EditorContent editor={$editor} />
</div>

<style lang="postcss">
	button.active {
		@apply bg-primary text-primary-content;
	}
</style>
