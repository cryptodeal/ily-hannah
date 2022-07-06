import prntr from 'prntr';
import css from '$lib/editor/styles.css?url';

export function printEditorContent() {
	prntr({
		printable: 'el-tiptap-editor__content',
		type: 'html',
		css: css,
		scanStyles: false
	});
}
