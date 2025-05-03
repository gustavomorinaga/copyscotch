import { fireEvent, render } from '@testing-library/svelte';
import { describe, expect, it } from 'vitest';
import InputSearch from './input-search.component.svelte';

describe('input-search component', () => {
	it('should render the input field with placeholder', () => {
		const { getByPlaceholderText } = render(InputSearch, { value: '' });
		const input = getByPlaceholderText('Search');
		expect(input).toBeInTheDocument();
	});

	it('should update the value on input', async () => {
		const { getByPlaceholderText } = render(InputSearch, { value: '' });
		const input = getByPlaceholderText('Search') as HTMLInputElement;
		await fireEvent.input(input, { target: { value: 'test' } });
		expect(input.value).toBe('test');
	});

	it('should clear the input value when the clear button is clicked', async () => {
		const { getByPlaceholderText, getByLabelText } = render(InputSearch, { value: 'test' });
		const input = getByPlaceholderText('Search') as HTMLInputElement;
		const clearButton = getByLabelText('Clean Search');
		await fireEvent.click(clearButton);
		expect(input.value).toBe('');
	});

	it('should disable the clear button when input is empty', () => {
		const { getByLabelText } = render(InputSearch, { value: '' });
		const clearButton = getByLabelText('Clean Search');
		expect(clearButton).toBeDisabled();
	});
});
