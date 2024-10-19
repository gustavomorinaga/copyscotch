import { Dialog as DialogPrimitive } from 'bits-ui';
import type { ComponentProps } from 'svelte';

import Title from './dialog-title.svelte';
import Portal from './dialog-portal.svelte';
import Footer from './dialog-footer.svelte';
import Header from './dialog-header.svelte';
import Overlay from './dialog-overlay.svelte';
import Content from './dialog-content.svelte';
import Description from './dialog-description.svelte';

const Root = DialogPrimitive.Root;
const Trigger = DialogPrimitive.Trigger;

type RootProps = DialogPrimitive.Props;
type TriggerProps = DialogPrimitive.TriggerProps;
type TitleProps = DialogPrimitive.TitleProps;
type PortalProps = DialogPrimitive.PortalProps;
type FooterProps = ComponentProps<Footer>;
type HeaderProps = ComponentProps<Header>;
type OverlayProps = DialogPrimitive.OverlayProps;
type ContentProps = DialogPrimitive.ContentProps;
type DescriptionProps = DialogPrimitive.DescriptionProps;

export {
	Root,
	Title,
	Portal,
	Footer,
	Header,
	Trigger,
	Overlay,
	Content,
	Description,
	//
	Root as Dialog,
	Title as DialogTitle,
	Portal as DialogPortal,
	Footer as DialogFooter,
	Header as DialogHeader,
	Trigger as DialogTrigger,
	Overlay as DialogOverlay,
	Content as DialogContent,
	Description as DialogDescription,
	//
	type RootProps as Props,
	type TriggerProps,
	type TitleProps,
	type PortalProps,
	type FooterProps,
	type HeaderProps,
	type OverlayProps,
	type ContentProps,
	type DescriptionProps,
	//
	type RootProps as DialogProps,
	type TriggerProps as DialogTriggerProps,
	type TitleProps as DialogTitleProps,
	type PortalProps as DialogPortalProps,
	type FooterProps as DialogFooterProps,
	type HeaderProps as DialogHeaderProps,
	type OverlayProps as DialogOverlayProps,
	type ContentProps as DialogContentProps,
	type DescriptionProps as DialogDescriptionProps
};
