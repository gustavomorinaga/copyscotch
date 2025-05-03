import { render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import FeedbackNotFound from './feedback-not-found.component.svelte';

describe('feedback-not-found component', () => {
	it('should render the search icon', () => {
		const { container } = render(FeedbackNotFound, { term: 'example' });
		expect(container.querySelector('svg')).toBeInTheDocument();
	});

	it('should display the correct term in the message', () => {
		const term = 'example';
		const { getByText } = render(FeedbackNotFound, { term });
		expect(getByText(`Nothing found for "${term}"`)).toBeInTheDocument();
	});
});
