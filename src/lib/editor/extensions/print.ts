import { Extension } from '@tiptap/core';
import Logger from '../utils/logger';

declare module '@tiptap/core' {
	interface Commands<ReturnType> {
		print: {
			/**
			 * print document
			 */
			print: () => ReturnType;
		};
	}
}

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

export const Print = Extension.create({
	name: 'print',

	addOptions() {
		return {
			depth: 100,
			newGroupDelay: 500
		};
	},

	addCommands() {
		return {
			print:
				() =>
				({ view }) => {
					const editorContent = view.dom.closest('.el-tiptap-editor__content');
					if (editorContent) {
						printHtml(editorContent);
						console.log(true);
						return true;
					}
					console.log(false);
					return false;
				}
		};
	},

	addKeyboardShortcuts() {
		return {
			'Mod-p': () => this.editor.commands.print()
		};
	}
});
