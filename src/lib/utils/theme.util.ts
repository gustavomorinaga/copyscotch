import { browser } from '$app/environment';
import { AccentColorEnum, type TThemeInfer } from '$lib/validators';
import { setMode } from 'mode-watcher';

export function setTheme(theme: TThemeInfer['accentColor']) {
	if (!browser) return;

	const { options: accentOptions } = AccentColorEnum;
	const html = document.documentElement;
	const classList = [...html.classList.values()];

	for (const className of classList) {
		if ((accentOptions as Array<string>).includes(className)) {
			html.classList.remove(className);
		}
	}

	html.classList.add(theme);
}

export function setBackground(background: TThemeInfer['backgroundColor']) {
	if (background !== 'black') setMode(background);
	else {
		const html = document.documentElement;
		const classList = [...html.classList.values()];

		for (const className of classList) {
			if (className === 'black') return;
			html.classList.remove(className);
		}

		html.classList.add('black');
		localStorage.setItem('mode-watcher-mode', 'black');
	}
}
