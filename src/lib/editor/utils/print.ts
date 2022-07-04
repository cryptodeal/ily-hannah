import Logger from './logger';

function printHtml(content: string) {
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

export function printEditorContent(htmlString?: string) {
	if (htmlString) {
		printHtml(htmlString);
		return true;
	}
	return false;
}
