/**
 * Enables horizontal scrolling behavior on the specified HTML element.
 * @param node - The HTML element to enable horizontal scrolling on.
 * @param velocity - The velocity of the scroll. Default is 10.
 */
export function horizontalScroll(node: HTMLElement, velocity = 10) {
	function handleScroll(event: WheelEvent) {
		event.preventDefault();
		node.scrollLeft += event.deltaY * velocity;
	}

	node.addEventListener('wheel', handleScroll, { passive: false });
}
