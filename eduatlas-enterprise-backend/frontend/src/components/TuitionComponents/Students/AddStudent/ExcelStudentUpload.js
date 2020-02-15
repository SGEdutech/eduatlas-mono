import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { schemeAndAuthority } from '../../../../config.json';
import { parse } from 'papaparse';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';

import {
	Button,
	Col,
	Icon,
	notification,
	Row,
	Upload
} from 'antd';

class ExcelStudentUpload extends Component {
	state = {
		selectedFile: null,
		selectedFileList: []
	};

	calibrateCourseAndBatchCodeCasing = studentsData => {
		studentsData.forEach(studentData => {
			if (studentData['Batch Code(optional)']) studentData['Batch Code(optional)'] = studentData['Batch Code(optional)'].trim().toLowerCase();
			if (studentData['Course Code']) studentData['Course Code'] = studentData['Course Code'].trim().toLowerCase();
		});
	}

	dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0);

	getStudentObjects = studentsData => {
		const { batches, courses } = this.props;
		return studentsData.map(student => {
			const courseInfo = courses.find(course => course.code === student['Course Code']);
			const studentObj = {
				email: student['E-Mail'],
				name: student['Name'],
				payments: [{ courseCode: courseInfo.code, courseFee: courseInfo.fees }],
				rollNumber: student['Roll Number']
			};
			const batchCode = student['Batch Code(optional)'];
			if (Boolean(batchCode) === false) return studentObj;
			const batchInfo = batches.find(batch => batch.code === batchCode);
			studentObj.batchInfo = { batchId: batchInfo._id, courseId: courseInfo._id };
			return studentObj;
		});
	}

	handleEmptyLastObj = studentsData => {
		const lastStudentData = studentsData[studentsData.length - 1];
		if (Boolean(lastStudentData['Roll Number']) === false && Boolean(lastStudentData['Name']) === false && Boolean(lastStudentData['E-Mail']) === false && Boolean(lastStudentData['Course Code']) === false) studentsData.pop();
	}

	onChange = info => {
		const nextState = {};
		switch (info.file.status) {
			case 'uploading':
				nextState.selectedFileList = [info.file];
				break;
			case 'done':
				nextState.selectedFile = info.file;
				nextState.selectedFileList = [info.file];
				break;

			default:
				// error or removed
				nextState.selectedFile = null;
				nextState.selectedFileList = [];
		}
		this.setState(() => nextState);
	};

	parseCsv = () => {
		const { state: { selectedFile: { originFileObj } }, validateAndAddStudents } = this;
		parse(originFileObj, {
			header: true,
			complete: res => validateAndAddStudents(res.data)
		});
	}

	showErrorMessage = message => {
		notification.error({
			description: message,
			duration: 0,
			message: 'Student can\'t be added'
		});
	}

	validateAndAddStudents = studentDataJson => {
		const { addStudent, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		this.calibrateCourseAndBatchCodeCasing(studentDataJson);
		const isValid = this.validateStudentsData(studentDataJson);
		if (isValid === false) return;
		// Reordering every student to send to database
		const studentObjs = this.getStudentObjects(studentDataJson);
		addStudent(tuitionId, { students: studentObjs });
		this.setState({ selectedFile: null, selectedFileList: [] });
	}

	validateBatchCode = studentsData => {
		const { batches } = this.props;
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			if (Boolean(studentData['Batch Code(optional)']) === false) return;
			const doesCourseCodeExists = Boolean(batches.find(batch => batch.code === studentData['Batch Code(optional)']));
			if (doesCourseCodeExists === false) {
				this.showErrorMessage(`Batch with code ${studentData['Batch Code(optional)']} at row ${index + 2} does not exists`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateCourseCode = studentsData => {
		const { courses } = this.props;
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			const doesCourseCodeExists = Boolean(courses.find(course => course.code === studentData['Course Code']));
			if (doesCourseCodeExists === false) {
				this.showErrorMessage(`Course with code ${studentData['Course Code']} at row ${index + 2} does not exists`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateDuplicateEntries = studentsData => {
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			const studentIndex = studentsData.findIndex(student => student['Roll Number'] === studentData['Roll Number'] || student['E-Mail'] === studentData['E-Mail']);
			if (studentIndex !== index) {
				this.showErrorMessage(`Roll number or email at row ${index + 2} has another entry with same value in in csv file`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateRequiredFields = studentsData => {
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			if (Boolean(studentData['Roll Number']) === false || Boolean(studentData['Name']) === false || Boolean(studentData['E-Mail']) === false || Boolean(studentData['Course Code']) === false) {
				this.showErrorMessage(`Student data at row ${index + 2} is missing some compulsary field(s)!`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateStudentsData = studentsData => {
		this.handleEmptyLastObj(studentsData);
		const isAnyEntryDuplicate = this.validateDuplicateEntries(studentsData);
		const areRequiredFieldsValid = this.validateRequiredFields(studentsData);
		const areUniqueFieldsValid = this.validateUniqueFields(studentsData);
		const areCourseCodeValid = this.validateCourseCode(studentsData);
		const areBatchCodeValid = this.validateBatchCode(studentsData);
		return isAnyEntryDuplicate && areRequiredFieldsValid && areUniqueFieldsValid && areCourseCodeValid && areBatchCodeValid;
	}

	validateUniqueFields = studentsData => {
		const { students } = this.props;
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			students.forEach(student => {
				if (student.rollNumber === studentData['Roll Number'] || student.email === studentData['E-Mail']) {
					this.showErrorMessage(`Email or roll number at row ${index + 2} already exists`);
					isValid = false;
				}
			});
		});
		return isValid;
	}

	render() {
		const { selectedFileList } = this.state;
		return (
			<>
				<Col className="my-1">
					<a href={`${schemeAndAuthority}/excel-template/add-student`} download="add-student.csv">
						<Button block type="primary">
							Download Sample File
						</Button>
					</a>
				</Col>
				<Row type="flex" justify="center">
					<Col className="my-1">
						<Upload
							accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							customRequest={this.dummyRequest}
							fileList={this.state.selectedFileList}
							onChange={this.onChange}>
							<Button block><Icon type="upload" /> Choose File</Button>
						</Upload>
					</Col>
				</Row>
				<Col className="my-1" >
					<Button block
						disabled={selectedFileList.length === 0}
						onClick={this.parseCsv}
						type="primary">
						Save
					</Button>
				</Col>
			</>
		);
	}
}

export default withRouter(ExcelStudentUpload);

