import dateToMoment from '../../scripts/dateToMoment';

const initState = { schedules: [] };

function scheduleReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED': {
			const schedules = action.payload.data.schedules;
			dateToMoment(schedules);
			return { ...state, schedules };
		}
		case 'ADD_SCHEDULE_FULFILLED': {
			const newSchedules = action.payload.data;
			dateToMoment(newSchedules);
			return { ...state, schedules: [...state.schedules, ...newSchedules] };
		}
		case 'EDIT_SCHEDULE_FULFILLED': {
			const editedSchedule = action.payload.data;
			const { _id: editedScheduleId } = editedSchedule;
			const schedules = state.schedules.map(schedule => schedule._id === editedScheduleId ? editedSchedule : schedule);
			dateToMoment(schedules);
			return { ...state, schedules };
		}
		case 'DELETE_SCHEDULE_FULFILLED': {
			const schedules = state.schedules.filter(schedule => schedule._id !== action.payload.data._id);
			dateToMoment(schedules);
			return { ...state, schedules };
		}
		case 'DELETE_COURSE_FULFILLED': {
			const schedules = state.schedules.filter(schedule => schedule.courseId === action.payload.data._id);
			dateToMoment(schedules);
			return { ...state, schedules };
		}
		case 'DELETE_BATCH_FULFILLED': {
			const schedules = state.schedules.filter(schedule => schedule.batchId === action.payload.data._id);
			dateToMoment(schedules);
			return { ...state, schedules };
		}
		default:
			return state;
	}
}

export default scheduleReducer;
