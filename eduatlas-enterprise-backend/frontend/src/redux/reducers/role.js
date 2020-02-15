const initState = {
	roles: []
};

function rolesReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED':
			return { ...state, roles: action.payload.data.roles };
		case 'ADD_ROLE_FULFILLED':
			return { ...state, roles: [...state.roles, action.payload.data] };
		case 'DELETE_ROLE_FULFILLED':
			return { ...state, roles: state.roles.filter(role => role._id !== action.payload.data._id) };
		default:
			return state;
	}
}

export default rolesReducer;
