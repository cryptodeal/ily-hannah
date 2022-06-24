export type ShortCutParams = {
	alt?: boolean;
	control?: boolean;
	shift?: boolean;
	code: string | number;
	callback?: () => void;
};

export const shortcut = (node: HTMLElement, params: ShortCutParams) => {
	let handler: (e: KeyboardEvent) => void;
	const removeHandler = () => window.removeEventListener('keydown', handler),
		setHandler = () => {
			removeHandler();
			if (!params) return;
			handler = (e) => {
				if (
					!!params.alt != e.altKey ||
					!!params.shift != e.shiftKey ||
					!!params.control != (e.ctrlKey || e.metaKey) ||
					params.code != e.code
				)
					return;
				e.preventDefault();
				params.callback ? params.callback() : node.click();
			};
			window.addEventListener('keydown', handler);
		};
	setHandler();
	return {
		update: setHandler,
		destroy: removeHandler
	};
};
