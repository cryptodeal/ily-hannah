import prntr from 'prntr';

export function printEditorContent() {
	prntr({
		printable: 'el-tiptap-editor__content',
		type: 'html',
		scanStyles: true
	});
}
