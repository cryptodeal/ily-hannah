import { generateHTML } from '@tiptap/html';
import { Heading } from '@tiptap/extension-heading';
import { Blockquote } from '@tiptap/extension-blockquote';
import { ListItem } from '@tiptap/extension-list-item';
import { Document } from '@tiptap/extension-document';
import { HardBreak } from '@tiptap/extension-hard-break';
import { HorizontalRule } from '@tiptap/extension-horizontal-rule';
import { OrderedList } from '@tiptap/extension-ordered-list';
import { Paragraph } from '@tiptap/extension-paragraph';
import { BulletList } from '@tiptap/extension-bullet-list';
import { Text } from '@tiptap/extension-text';
import { Bold } from '@tiptap/extension-bold';
import { Italic } from '@tiptap/extension-italic';
import { Strike } from '@tiptap/extension-strike';

import type { JSONContent } from '@tiptap/core';

export function resolve(
	path: string | string[],
	obj: typeof self | object = self,
	separator = '.'
) {
	const properties = Array.isArray(path) ? path : path.split(separator);
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	return properties.reduce((prev: any, curr: any) => prev && prev[curr], obj);
}

export const genHTML = (content: JSONContent) =>
	generateHTML(content, [
		Heading as any,
		BulletList,
		Blockquote,
		ListItem,
		Document,
		HardBreak,
		HorizontalRule,
		OrderedList,
		Paragraph,
		Text,
		Bold,
		Italic,
		Strike
	]);
