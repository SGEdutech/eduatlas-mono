export function changeTabs(primaryTabsValue, secondaryTabsValue) {
	return {
		type: 'CHANGE_TABS',
		payload: { primaryTabsValue, secondaryTabsValue }
	};
}
