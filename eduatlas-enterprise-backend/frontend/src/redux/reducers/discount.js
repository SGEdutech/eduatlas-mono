const initState = {
	discounts: []
};

function discountReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED':
			return { ...state, discounts: action.payload.data.discounts };
		case 'ADD_DISCOUNT_FULFILLED':
			return { ...state.discounts, discounts: [...state.discounts, action.payload.data] };
		case 'EDIT_DISCOUNT_FULFILLED': {
			const editedDiscount = action.payload.data;
			const { _id } = editedDiscount;
			const newCourses = state.discounts.map(discount => discount._id === _id ? editedDiscount : discount);
			return { ...state, discounts: newCourses };
		}
		case 'DELETE_DISCOUNT_FULFILLED':
			return { ...state, discounts: state.discounts.filter(discount => discount._id !== action.payload.data._id) };
		default:
			return state;
	}
}

export default discountReducer;
