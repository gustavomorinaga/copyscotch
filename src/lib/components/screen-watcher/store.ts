export class ScreenStore {
	innerWidth = $state<Window['innerWidth']>(0);
	innerHeight = $state<Window['innerHeight']>(0);
}
