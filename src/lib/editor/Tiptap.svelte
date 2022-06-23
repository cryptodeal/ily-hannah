<script lang="ts">
	import { onMount } from 'svelte';
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
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';

	import type { Editor as CoreEditor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	let editor: Readable<Editor>,
		isApple = false,
		showHotKeys = false;

	onMount(() => {
		const { vendor, type } = new UAParser(navigator.userAgent).getDevice();
		if (vendor === 'Apple') isApple = true;
		if (type === 'console' || type === 'tablet') showHotKeys = true;
		editor = createEditor({
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class:
						'prose text-base min-h-[300px] max-h-[70vh] sm:max-h-[75vh] lg:max-h-[80vh] overflow-scroll prose-sm sm:prose md:container mx-auto border-2 border-black rounded-b-md p-3 outline-none'
				}
			},
			content: `Hannah, I love you more than anything in the freakin' world and hope you're having a great day at work! ❤️❤️❤️❤️ Cannot wait to come pick you up later and spend tonight all cuddled up watching some TV together. ❤️❤️❤️❤️❤️`
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

	$: isActive = (name: string, attrs = {}) =>
		($editor as unknown as CoreEditor).isActive(name, attrs);
</script>

{#if editor}
	<div
		class="prose prose-sm sm:prose md:container mx-auto border-black border-2 border-b-0 rounded-t-md p-2 flex gap-2"
	>
		<div class="btn-group">
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
		<div class="btn-group">
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

		<div class="btn-group">
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

			<div class="tooltip tooltip-primary" data-tip="Sink List Item{showHotKeys ? ' (Tab)' : ''}">
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
{/if}

<EditorContent editor={$editor} />

<style lang="postcss">
	button.active {
		@apply bg-primary text-primary-content;
	}
</style>
