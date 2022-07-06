import prntr from 'prntr';
import css from '$lib/editor/styles.css?url';

export function printEditorContent(htmlStr: string) {
	prntr({
		printable: htmlStr,
		type: 'raw-html',
		css: css
	});
}
