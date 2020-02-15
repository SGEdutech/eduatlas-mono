import dateToMoment from '../../scripts/dateToMoment';

const initState = { tests: [] };

function testReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED': {
			const tests = action.payload.data.tests;
			dateToMoment(tests);
			return { ...state, tests };
		}
		case 'ADD_TEST_FULFILLED': {
			const newTest = action.payload.data;
			dateToMoment(newTest);
			return { ...state, tests: [...state.tests, newTest] };
		}
		case 'CLEAR_MARKS_FULFILLED': {
			const editedTest = action.payload.data;
			const { _id: editedTestId } = editedTest;
			const newTests = state.tests.map(test => test._id === editedTestId ? editedTest : test);
			dateToMoment(newTests);
			return { ...state, tests: newTests };
		}
		case 'EDIT_TEST_FULFILLED': {
			const editedTest = action.payload.data;
			const { _id: editedTestId } = editedTest;
			const newTests = state.tests.map(test => test._id === editedTestId ? editedTest : test);
			dateToMoment(newTests);
			return { ...state, tests: newTests };
		}
		case 'DELETE_TEST_FULFILLED': {
			const tests = state.tests.filter(test => test._id !== action.payload.data._id);
			dateToMoment(tests);
			return { ...state, tests };
		}
		case 'DELETE_BATCH_FULFILLED': {
			const deletedBatchId = action.payload.data._id;
			const tests = [...state.tests];
			tests.forEach(test => test.batchIds = test.batchIds.filter(batchId => batchId !== deletedBatchId));
			return { ...state, tests };
		}
		default: {
			return state;
		}
	}
}

export default testReducer;
