const initState = {
	leads: []
};

function leadReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED':
			return { ...state, leads: action.payload.data.leads };
		case 'ADD_LEAD_FULFILLED':
			return { ...state, leads: [...state.leads, action.payload.data] };
		case 'ADD_MULTIPLE_LEAD_FULFILLED':
			return { ...state, leads: [...state.leads, ...action.payload.data] };
		case 'EDIT_LEAD_FULFILLED':
			const editedLead = action.payload.data;
			const { _id } = editedLead;
			const newLeads = state.leads.map(lead => lead._id === _id ? editedLead : lead);
			return { ...state, leads: newLeads };
		default:
			return state;
	}
}

export default leadReducer;
