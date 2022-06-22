<script lang="ts">
	import { onMount } from 'svelte';
	import StarterKit from '@tiptap/starter-kit';
	import Header1 from '~icons/fluent/text-header-1-20-filled';
	import Header2 from '~icons/fluent/text-header-2-20-filled';
	import Header3 from '~icons/fluent/text-header-3-20-filled';
	import Bold from '~icons/fluent/text-bold-20-filled';
	import Italic from '~icons/fluent/text-italic-20-filled';
	import Paragraph from '~icons/fluent/text-paragraph-20-filled';
	import BlockQuote from '~icons/fluent/text-quote-20-filled';
	import { createEditor, EditorContent, type Editor } from 'svelte-tiptap';
	import type { Editor as CoreEditor } from '@tiptap/core';
	import type { Readable } from 'svelte/store';

	let editor: Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			extensions: [StarterKit],
			editorProps: {
				attributes: {
					class:
						'prose min-h-[300px] max-h-[70vh] sm:max-h-[75vh] lg:max-h-[80vh] overflow-scroll prose-sm sm:prose md:container mx-auto border-2 border-black rounded-b-md p-3 outline-none'
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
		<div class="tooltip tooltip-primary" data-tip="Heading 1">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('heading', { level: 1 })}
				on:click={toggleHeading(1)}
			>
				<Header1 />
			</button>
		</div>

		<div class="tooltip tooltip-primary" data-tip="Heading 2">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('heading', { level: 2 })}
				on:click={toggleHeading(2)}
			>
				<Header2 />
			</button>
		</div>

		<div class="tooltip tooltip-primary" data-tip="Heading 3">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('heading', { level: 3 })}
				on:click={toggleHeading(3)}
			>
				<Header3 />
			</button>
		</div>

		<div class="tooltip tooltip-primary" data-tip="Bold">
			<button class="btn btn-square btn-sm" class:active={isActive('bold')} on:click={toggleBold}>
				<Bold />
			</button>
		</div>

		<div class="tooltip tooltip-primary" data-tip="Italic">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('italic')}
				on:click={toggleItalic}
			>
				<Italic />
			</button>
		</div>

		<div class="tooltip tooltip-primary" data-tip="Paragraph">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('paragraph')}
				on:click={setParagraph}
			>
				<Paragraph />
			</button>
		</div>
		<div class="tooltip tooltip-primary" data-tip="Blockquote">
			<button
				class="btn btn-square btn-sm"
				class:active={isActive('blockquote')}
				on:click={setBlockquote}
			>
				<BlockQuote />
			</button>
		</div>
	</div>
{/if}

<EditorContent editor={$editor} />

<style lang="postcss">
	button.active {
		@apply bg-primary text-primary-content;
	}
</style>
