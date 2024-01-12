/**
 * Enables horizontal scrolling behavior on the specified HTML element.
 * @param node - The HTML element to enable horizontal scrolling on.
 */
export const horizontalScroll = (node: HTMLElement) => {
	function handleScroll(event: WheelEvent) {
		event.preventDefault();
		node.scrollTo({ left: node.scrollLeft + event.deltaY, behavior: 'smooth' });
	}

	node.addEventListener('wheel', handleScroll);
};
