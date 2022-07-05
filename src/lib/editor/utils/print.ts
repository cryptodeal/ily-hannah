import type { EditorView } from 'prosemirror-view';
import Logger from './logger';

const getBlobURL = (code: string, type: string) => {
	const blob = new Blob([code], { type });
	return URL.createObjectURL(blob);
};

function printHtml(dom: Element) {
	const style: string = Array.from(document.querySelectorAll('style, link')).reduce(
		(str, style) => str + style.outerHTML,
		''
	);

	const content: string = style + dom.outerHTML;

	const iframe: HTMLIFrameElement = document.createElement('iframe');

	iframe.id = 'el-tiptap-iframe';
	iframe.setAttribute('style', 'position: absolute; width: 0; height: 0; top: -10px; left: -10px;');
	document.body.appendChild(iframe);

	const frameWindow = iframe.contentWindow;
	const doc = iframe.contentDocument || (iframe.contentWindow && iframe.contentWindow.document);

	if (doc) {
		doc.open();
		doc.write(content);
		doc.close();
	}

	if (frameWindow) {
		iframe.onload = function () {
			const link = document.createElement('link');
			link.href = getBlobURL(`@page { size: auto;  margin: 0mm; }`, 'text/css');
			link.rel = 'stylesheet';
			link.type = 'text/css';
			frameWindow.document.head.appendChild(link);
			try {
				setTimeout(() => {
					frameWindow.focus();
					try {
						if (!frameWindow.document.execCommand('print', false)) {
							frameWindow.print();
						}
					} catch (e) {
						frameWindow.print();
					}
					frameWindow.close();
				}, 10);
			} catch (err: unknown) {
				Logger.error(err as string);
			}

			setTimeout(function () {
				document.body.removeChild(iframe);
			}, 100);
		};
	}
}

export function printEditorContent(view: EditorView) {
	const editorContent = view.dom.closest('.el-tiptap-editor__content');
	if (editorContent) {
		printHtml(editorContent);
		//console.log(true)
		return true;
	}
	//console.log(false)
	return false;
}
