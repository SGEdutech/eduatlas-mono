import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import { parse } from 'papaparse';

import {
	Button,
	Col,
	Icon,
	notification,
	Row,
	Upload
} from 'antd';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';
import { schemeAndAuthority } from '../../../../config.json';

class ExcelAttendanceUpload extends Component {
	state = {
		selectedFile: null,
		selectedFileList: []
	};

	dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0);

	filterNullEntries = arr => arr.filter(item => item);

	getAbsentStudentIds = (batchId, presentRollnumbers) => {
		const { batches, students } = this.props;
		const batchInfo = batches.find(batch => batch._id === batchId);
		const presentStudentIds = presentRollnumbers.map(presentRollNumber => students.find(student => student.rollNumber === presentRollNumber)._id);
		return batchInfo.students.filter(studentId => Boolean(presentStudentIds.find(presentStudentId => presentStudentId === studentId)) === false);
	}

	getRollNumbersArray = parsedArr => parsedArr.map(parsedObj => parsedObj['Roll Number']);

	handleEmptyLastObj = studentsData => {
		const lastStudentData = studentsData[studentsData.length - 1];
		if (Boolean(lastStudentData['Roll Number']) === false) studentsData.pop();
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
		const { state: { selectedFile: { originFileObj } }, validateAndAddAttendance } = this;
		parse(originFileObj, {
			header: true,
			complete: res => validateAndAddAttendance(res.data)
		});
	}

	showErrorMessage = message => {
		notification.error({
			description: message,
			duration: 0,
			message: 'Student can\'t be added',
		});
	}

	validateAndAddAttendance = presentRollnumbers => {
		const { editSchedule, match: { params: { scheduleId }, url }, schedules } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		const scheduleInfo = schedules.find(schedule => schedule._id === scheduleId);
		const { batchId, courseId } = scheduleInfo;
		this.handleEmptyLastObj(presentRollnumbers);
		presentRollnumbers = this.filterNullEntries(presentRollnumbers);
		presentRollnumbers = this.getRollNumbersArray(presentRollnumbers);
		const areStudentIdsValid = this.validateStudentRollNumbers(presentRollnumbers);
		if (areStudentIdsValid === false) return;
		const absentStudentIds = this.getAbsentStudentIds(batchId, presentRollnumbers);
		editSchedule(tuitionId, courseId, batchId, scheduleId, { studentsAbsent: absentStudentIds });
		this.setState({ selectedFile: null, selectedFileList: [] });
	}

	validateStudentRollNumbers = rollNumbers => {
		const { students } = this.props;
		let isValid = true;
		rollNumbers.forEach((rollNumber, index) => {
			const isRollNumberValid = Boolean(students.find(student => student.rollNumber === rollNumber));
			if (isRollNumberValid === false) {
				this.showErrorMessage(`No student with roll number at row ${index + 2} found!`);
				isValid = false;
			}
		});
		return isValid;
	}

	render() {
		const { selectedFileList } = this.state;
		return (
			<>
				<Col className="my-1">
					<a href={`${schemeAndAuthority}/excel-template/mark-attendance`} download="mark-attendance.csv">
						<Button block
							type="primary">
							Download Sample File
						</Button>
					</a>
				</Col>
				<Row justify="center" type="flex">
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
				<Col className="my-1">
					<Button
						block
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

export default withRouter(ExcelAttendanceUpload);

