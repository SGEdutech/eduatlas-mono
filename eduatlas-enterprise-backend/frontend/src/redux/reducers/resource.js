const initState = {
	resources: []
};

function resourceReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED': {
			return { ...state, resources: action.payload.data.resources };
		}
		case 'ADD_RESOURCE_FULFILLED': {
			const resources = [...state.resources];
			resources.push(action.payload.data);
			return { ...state, resources };
		}
		case 'DELETE_RESOURCE_FULFILLED': {
			return { ...state, resources: state.resources.filter(resource => resource._id !== action.payload.data._id) };
		}
		default:
			return state;
	}
}

export default resourceReducer;
