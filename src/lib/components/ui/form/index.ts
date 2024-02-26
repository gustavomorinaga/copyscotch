import * as FormPrimitive from 'formsnap';
import Root from './form.svelte';
import Description from './form-description.svelte';
import Label from './form-label.svelte';
import FieldErrors from './form-field-errors.svelte';
import Field from './form-field.svelte';
import Fieldset from './form-fieldset.svelte';
import Legend from './form-legend.svelte';
import ElementField from './form-element-field.svelte';
import Button from './form-button.svelte';
import Join from './form-join.svelte';

const Control = FormPrimitive.Control;

export {
	Root,
	Field,
	Control,
	Label,
	Button,
	FieldErrors,
	Description,
	Fieldset,
	Legend,
	ElementField,
	Join,
	//
	Root as Form,
	Field as FormField,
	Control as FormControl,
	Description as FormDescription,
	Label as FormLabel,
	FieldErrors as FormFieldErrors,
	Fieldset as FormFieldset,
	Legend as FormLegend,
	ElementField as FormElementField,
	Button as FormButton,
	Join as FormJoin
};
