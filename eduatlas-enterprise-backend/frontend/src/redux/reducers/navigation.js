const initState = {
	primaryTabsValue: 0,
	secondaryTabsValue: 0
};

function navigationReducer(state = initState, action) {
	switch (action.type) {
		case 'CHANGE_TABS':
			const { primaryTabsValue, secondaryTabsValue } = action.payload;
			return { primaryTabsValue, secondaryTabsValue };
		default:
			return state;
	}
}

export default navigationReducer;
