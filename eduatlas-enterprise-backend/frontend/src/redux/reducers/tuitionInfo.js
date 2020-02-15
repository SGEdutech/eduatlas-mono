const initState = {};

function tuitionInfoReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED':
			const tuitionInfo = action.payload.data.tuitionInfo || {};
			return tuitionInfo;
		case 'EDIT_TUITION_INFO_FULFILLED': {
			return action.payload.data;
		}
		default:
			return state;
	}
}

export default tuitionInfoReducer;
