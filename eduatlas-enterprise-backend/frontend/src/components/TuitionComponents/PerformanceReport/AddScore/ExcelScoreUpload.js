import { parse } from 'papaparse';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { schemeAndAuthority } from '../../../../config.json';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';

import {
	Button,
	Col,
	Icon,
	notification,
	Row,
	Upload
} from 'antd';


class ExcelScoreUpload extends Component {
	state = {
		selectedFile: null,
		selectedFileList: []
	};

	dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0);

	getStudentObjects = studentsData => {
		const { currentTestStudents } = this.props;
		return studentsData.map(studentData => {
			const studentInfo = currentTestStudents.find(student => student.rollNumberAndBatches.rollNumber === studentData['Roll Number']);
			return { studentId: studentInfo._id, marksObtained: parseFloat(studentData['Score']) };
		});
	}

	handleEmptyLastObj = studentsData => {
		const lastStudentData = studentsData[studentsData.length - 1];
		if (Boolean(lastStudentData['Roll Number']) === false && Boolean(lastStudentData['Score']) === false) studentsData.pop();
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
		const { state: { selectedFile: { originFileObj } }, validateAndEditScore } = this;
		parse(originFileObj, {
			header: true,
			complete: res => validateAndEditScore(res.data)
		});
	}

	showErrorMessage = message => {
		notification.error({
			description: message,
			duration: 0,
			message: 'Score can\'t be added'
		});
	}

	trimFieldsAndFixCasing = studentsData => {
		studentsData.forEach(studentData => {
			if (studentData['Roll Number']) studentData['Roll Number'] = studentData['Roll Number'].trim().toLowerCase();
			if (studentData['Score']) studentData['Score'] = studentData['Score'].trim();
		});
	}

	validateAndEditScore = studentDataJson => {
		const { currentTestId, editTest, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		this.trimFieldsAndFixCasing(studentDataJson);
		const isValid = this.validateStudentsData(studentDataJson);
		if (isValid === false) return;
		// Reordering every student to send to database
		const reports = this.getStudentObjects(studentDataJson);
		editTest(tuitionId, currentTestId, { reports });
		this.setState({ selectedFile: null, selectedFileList: [] });
	}

	validateRequiredFields = studentsData => {
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			if (Boolean(studentData['Roll Number']) === false || Boolean(studentData['Score']) === false) {
				this.showErrorMessage(`Student data at row ${index + 2} is missing some compulsary field(s)!`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateRollNumber = studentsData => {
		const { currentTestStudents } = this.props;
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			const doesRollNumberExists = Boolean(currentTestStudents.find(student => student.rollNumberAndBatches.rollNumber === studentData['Roll Number']));
			if (doesRollNumberExists === false) {
				this.showErrorMessage(`Student with roll-number ${studentData['Roll Number']} at row ${index + 2} doesn't belong in batches selected for this test.`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateScore = studentsData => {
		const { allTests, currentTestId } = this.props;
		const currentTestDetails = allTests.find(test => test._id === currentTestId);
		const { maxMarks } = currentTestDetails;
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			let isScoreInRange = (typeof parseFloat(studentData['Score']) === 'number') && studentData['Score'] <= maxMarks;
			if (studentData['Score'] === 'a' || studentData['Score'] === 'A' || studentData['Score'] === 'Absent' || studentData['Score'] === 'absent') {
				// handle special case
				studentData['Score'] = -(Number.MAX_VALUE - 1);
				isScoreInRange = true;
			}
			if (isScoreInRange === false) {
				this.showErrorMessage(`Student with roll-number ${studentData['Roll Number']} at row ${index + 2} has score more than maximum marks or marks contain illegal character`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateStudentsData = studentsData => {
		this.handleEmptyLastObj(studentsData);
		const areUniqueFieldsValid = this.validateUniqueFields(studentsData);
		const areRequiredFieldsValid = this.validateRequiredFields(studentsData);
		const areRollNumbersValid = this.validateRollNumber(studentsData);
		const areScoreValid = this.validateScore(studentsData);
		return areRequiredFieldsValid && areUniqueFieldsValid && areRollNumbersValid && areScoreValid;
	}

	validateUniqueFields = studentsData => {
		let isValid = true;
		studentsData.forEach((studentData, index) => {
			const studentIndex = studentsData.findIndex(student => student['Roll Number'] === studentData['Roll Number']);
			if (studentIndex !== index) {
				this.showErrorMessage(`Roll number at row ${index + 2} has another entry in csv file`);
				isValid = false;
			}
		});
		return isValid;
	}

	render() {
		const { selectedFileList } = this.state;
		const { currentTestId } = this.props;

		return (
			<>
				<Col className="my-1">
					<a href={`${schemeAndAuthority}/excel-template/add-score`} download="add-score.csv">
						<Button block
							type="primary">
							Download Sample File
						</Button>
					</a>
				</Col>
				<Row type="flex" justify="center">
					<Col className="my-1">
						<Upload
							accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
							customRequest={this.dummyRequest}
							disabled={Boolean(currentTestId) === false}
							fileList={this.state.selectedFileList}
							onChange={this.onChange}>
							<Button disabled={Boolean(currentTestId) === false} block><Icon type="upload" /> Choose File</Button>
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

export default withRouter(ExcelScoreUpload);

