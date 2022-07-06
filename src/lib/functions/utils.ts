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
import { TextAlign } from '@tiptap/extension-text-align';
import { Image } from '@tiptap/extension-image';

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
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
		TextAlign.configure({
			types: ['heading', 'paragraph']
		}),
		Image.configure({
			HTMLAttributes: {
				class: 'h-auto max-w-full mx-auto center'
			}
		}),
		Strike
	]);

function padZero(str: string, len?: number) {
	len = len || 2;
	const zeros = new Array(len).join('0');
	return (zeros + str).slice(-len);
}

export const invertColor = (hex: string, bw?: boolean): string => {
	if (hex.indexOf('#') === 0) {
		hex = hex.slice(1);
	}
	/* convert 3-digit hex to 6-digits */
	if (hex.length === 3) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	if (hex.length !== 6) {
		throw new Error('Invalid HEX color.');
	}
	let r: string | number = parseInt(hex.slice(0, 2), 16),
		g: string | number = parseInt(hex.slice(2, 4), 16),
		b: string | number = parseInt(hex.slice(4, 6), 16);

	/* See: https://stackoverflow.com/a/3943023/112731 */
	if (bw) {
		return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
	}
	r = (255 - r).toString(16);
	g = (255 - g).toString(16);
	b = (255 - b).toString(16);

	/* pad result */
	return '#' + padZero(r) + padZero(g) + padZero(b);
};
