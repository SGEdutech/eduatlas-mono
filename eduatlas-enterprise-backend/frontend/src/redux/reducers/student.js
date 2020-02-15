import dateToMoment from '../../scripts/dateToMoment';

const initState = {
	students: []
};

function studentReducer(state = initState, action) {
	switch (action.type) {
		case 'FETCH_ALL_FULFILLED': {
			const students = action.payload.data.students;
			dateToMoment(students);
			return { ...state, students };
		}
		case 'ADD_STUDENT_FULFILLED': {
			let newStudents = action.payload.data;
			if (Array.isArray(newStudents) === false) newStudents = [newStudents];
			newStudents = JSON.parse(JSON.stringify(newStudents));
			dateToMoment(newStudents);
			newStudents.forEach(student => delete student.batchAdded);
			return { ...state, students: [...state.students, ...newStudents] };
		}
		case 'EDIT_STUDENT_FULFILLED': {
			const editedStudent = action.payload.data;
			dateToMoment(editedStudent);
			const { _id } = editedStudent;
			const newStudents = state.students.map(student => student._id === _id ? editedStudent : student);
			return { ...state, students: newStudents };
		}
		case 'DELETE_STUDENT_FULFILLED':
			return { ...state, students: state.students.filter(student => student._id !== action.payload.data._id) };
		case 'ADD_PAYMENT_FULFILLED': {
			const newPayment = action.payload.data;
			dateToMoment(newPayment);
			const { studentId } = newPayment;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			studentInfo.payments.push(newPayment);
			return { ...state, students };
		}
		case 'EDIT_PAYMENT_FULFILLED': {
			const editedPayment = action.payload.data;
			dateToMoment(editedPayment);
			const editedPaymentId = editedPayment._id;
			const { studentId } = editedPayment;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			studentInfo.payments = studentInfo.payments.map(paymentObj => paymentObj._id === editedPaymentId ? editedPayment : paymentObj);
			return { ...state, students };
		}
		case 'DELETE_PAYMENT_FULFILLED': {
			const { _id: deletedPaymentId, studentId } = action.payload.data;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			studentInfo.payments = studentInfo.payments.filter(paymentObj => paymentObj._id !== deletedPaymentId);
			return { ...state, students };
		}
		case 'ADD_INSTALLMENT_FULFILLED': {
			const newInstallment = action.payload.data;
			dateToMoment(newInstallment);
			const { studentId, paymentId } = newInstallment;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			const paymentInfo = studentInfo.payments.find(paymentObj => paymentObj._id === paymentId);
			paymentInfo.installments.push(newInstallment);
			return { ...state, students };
		}
		case 'EDIT_INSTALLMENT_FULFILLED': {
			const editedInstallment = action.payload.data;
			dateToMoment(editedInstallment);
			const { studentId, paymentId, _id: editedInstallmentId } = editedInstallment;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			const paymentInfo = studentInfo.payments.find(paymentObj => paymentObj._id === paymentId);
			paymentInfo.installments = paymentInfo.installments.map(installmentObj => installmentObj._id === editedInstallmentId ? editedInstallment : installmentObj);
			return { ...state, students };
		}
		case 'DELETE_INSTALLMENT_FULFILLED': {
			const { studentId, paymentId, _id: deletedInstallmentId } = action.payload.data;
			const students = [...state.students];
			const studentInfo = students.find(studentObj => studentObj._id === studentId);
			const paymentInfo = studentInfo.payments.find(paymentObj => paymentObj._id === paymentId);
			paymentInfo.installments = paymentInfo.installments.filter(installmentObj => installmentObj._id !== deletedInstallmentId);
			return { ...state, students };
		}
		default:
			return state;
	}
}

export default studentReducer;
