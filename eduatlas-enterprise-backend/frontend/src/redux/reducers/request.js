const initState = {
	requests: []
};

function requestReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED': {
			return { ...state, requests: action.payload.data.requests };
		}
		case 'ADD_REQUEST_FULFILLED': {
			return { ...state, requests: [...state.requests, action.payload.data] };
		}
		case 'DELETE_REQUEST_FULFILLED': {
			return { ...state, requests: state.requests.filter(request => request._id !== action.payload.data._id) };
		}
		case 'ADD_STUDENT_FULFILLED': {
			const { email } = action.payload.data;
			return { ...state, requests: state.requests.filter(request => request.email !== email) };
		}
		case 'EDIT_STUDENT_FULFILLED': {
			const { email } = action.payload.data;
			return { ...state, requests: state.requests.filter(request => request.email !== email) };
		}
		default:
			return state;
	}
}

export default requestReducer;
