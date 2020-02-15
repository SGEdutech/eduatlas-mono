const initState = {
	fetching: true,
	fetched: false,
	fetchFailed: false,
	kaamChaluHai: false,
	kaamHoGaya: false,
	lifafa: {}
};

const pendingRegex = new RegExp('_PENDING$');
const rejectedRegex = new RegExp('_REJECTED$');
const fulfilledRegex = new RegExp('_FULFILLED$');

function messageReducer(state = initState, action) {
	if (action.type === 'FETCH_ALL_PENDING') {
		return { ...state, fetching: true, fetchFailed: false };
	} else if (action.type === 'FETCH_ALL_REJECTED') {
		return {
			...state,
			fetchFailed: true,
			fetching: false,
			lifafa: {
				sandesh: 'There was a problem connecting to the server.',
				level: 'error'
			}
		};
	} else if (action.type === 'FETCH_ALL_FULFILLED') {
		return {
			...state,
			fetchedFailed: false,
			fetched: true,
			fetching: false
		};
	} else if (pendingRegex.test(action.type)) {
		return { ...state, kaamChaluHai: true };
	} else if (rejectedRegex.test(action.type)) {
		// FIXME: send proper error messages from backend
		let errorMessageReceived = null;
		if (action.payload.response && action.payload.response.data) {
			errorMessageReceived = action.payload.response.data.includes('<pre>') ? action.payload.response.data.split('<pre>')[1].split('</pre>')[0] : action.payload.response.data;
		}
		return {
			...state,
			kaamChaluHai: false,
			kaamHoGaya: true,
			lifafa: {
				sandesh: errorMessageReceived ? errorMessageReceived : 'There was a problem connecting to the server.',
				level: 'error'
			}
		};
	} else if (fulfilledRegex.test(action.type)) {
		return {
			...state,
			kaamChaluHai: false,
			kaamHoGaya: true,
			lifafa: {
				sandesh: 'Done',
				level: 'success'
			}
		};
	} else if (action.type === 'RESET_SANDESH') {
		return {
			...state,
			kaamHoGaya: false,
			lifafa: {}
		};
	}
	return state;
}

export default messageReducer;
