import moment from 'moment';
import React, { Component } from 'react';
import { parse } from 'papaparse';
import { withRouter } from 'react-router-dom';

import { schemeAndAuthority } from '../../../config.json';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop.js';

import {
	Button,
	Col,
	Collapse,
	Icon,
	List,
	notification,
	Row,
	Upload
} from 'antd';
const { Panel } = Collapse;

const uploadInstructions = [
	'Don\'t change sample CSV file headers',
	'No duplicate entries should be there',
	'Name, Phone Number must be provided for each entry',
	'Phone Number must be a number, no characters allowed',
	'Valid Scources are: eduatlas.com, school campaign, pamphlets, facebook, walkin, sulekha, justdial, urbanpro, shiksha, google maps, other',
	'Valid Strength are: hot, cold, warm',
	'Valid Status are: active, enrolled, closed',
	'Email Address (if provided) must be valid. Example: text@text.text',
	'Dates must be of format: DD/MM/YY or DD/MM/YYYY'
];

class ExcelLeadUpload extends Component {
	state = {
		selectedFile: null,
		selectedFileList: []
	};

	componentDidMount() {
		scrollToTop();
	}

	addLeads = async values => {
		// TODO: backend path for adding multiple leads does not exist
		const { addMultipleLeads, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		try {
			addMultipleLeads(tuitionId, values);
		} catch (error) {
			console.error(error);
		}
	}

	dummyRequest = ({ onSuccess }) => setTimeout(() => onSuccess('ok'), 0);

	getLeadObjects = leadsData => {
		return leadsData.map(lead => {
			const studentObj = {
				email: lead['E-Mail'],
				name: lead['Name'],
				phone: parseInt(lead['Phone']),
				message: lead['Query'],
				source: lead['Source'],
				leadStrength: lead['Strength'],
				status: lead['Status'],
				createdAt: moment(lead['Date'], ['DD/MM/YY', 'DD/MM/YYYY']),
				nextFollowUp: moment(lead['Next Follow-Up Date'], ['DD/MM/YY', 'DD/MM/YYYY'])
			};
			return studentObj;
		});
	}

	handleEmptyLastObj = leadsData => {
		const lastLeadData = leadsData[leadsData.length - 1];
		if (Boolean(lastLeadData['Name']) === false && Boolean(lastLeadData['Query']) === false && Boolean(lastLeadData['E-Mail']) === false && Boolean(lastLeadData['Phone']) === false) leadsData.pop();
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
		const { state: { selectedFile: { originFileObj } }, validateAndAddLeads } = this;
		parse(originFileObj, {
			header: true,
			complete: res => validateAndAddLeads(res.data)
		});
	}

	showErrorMessage = message => {
		notification.error({
			description: message,
			duration: 0,
			message: 'Lead can\'t be added'
		});
	}

	validateAndAddLeads = leadDataJson => {
		const isValid = this.validateLeadsData(leadDataJson);
		if (isValid === false) return;
		// Reordering every lead to send to database
		const leadObjs = this.getLeadObjects(leadDataJson);
		this.addLeads(leadObjs);
		this.setState({ selectedFile: null, selectedFileList: [] });
	}

	validateDate = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			// regex for validating DD/MM/YYYY
			const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2,4})$/;
			const isDateValid = dateRegex.test(leadData['Date']);
			if (isDateValid === false) {
				this.showErrorMessage(`Date at row ${index + 2} is not valid. Valid format is: DD/MM/YYYY`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateDuplicateEntries = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			const leadIndex = leadsData.findIndex(lead => lead['Phone'] === leadData['Phone'] || lead['E-Mail'] === leadData['E-Mail']);
			if (leadIndex !== index) {
				this.showErrorMessage(`Phone or E-Mail at row ${index + 2} has another entry with same value in in csv file`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateEmail = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			// regex for validating email
			const isEmailValid = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(leadData['E-Mail']);
			if (isEmailValid === false) {
				this.showErrorMessage(`Email at row ${index + 2} is not valid`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateFollowUpDate = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			// regex for validating DD/MM/YYYY
			const dateRegex = /^(\d{2})\/(\d{2})\/(\d{2,4})$/;
			const isDateValid = dateRegex.test(leadData['Next Follow-Up Date']);
			if (isDateValid === false) {
				this.showErrorMessage(`Next Follow-Up Date at row ${index + 2} is not valid. Valid format is: DD/MM/YYYY`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateLeadsData = leadsData => {
		this.handleEmptyLastObj(leadsData);
		const isAnyEntryDuplicate = this.validateDuplicateEntries(leadsData);
		const areRequiredFieldsValid = this.validateRequiredFields(leadsData);
		const arePhoneNumberValid = this.validatePhoneNumber(leadsData);
		const areSourceValid = this.validateLeadSource(leadsData);
		const areStrengthValid = this.validateLeadStrength(leadsData);
		const areStatusValid = this.validateLeadStatus(leadsData);
		const areEmailValid = this.validateEmail(leadsData);
		const areDatesValid = this.validateDate(leadsData);
		const areFollowUpDatesValid = this.validateFollowUpDate(leadsData);
		return isAnyEntryDuplicate && areRequiredFieldsValid && arePhoneNumberValid && areSourceValid && areStrengthValid && areStatusValid && areEmailValid && areDatesValid && areFollowUpDatesValid;
	}

	validateLeadSource = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			let isLeadSourceValid;
			switch (leadData['Source']) {
				case 'eduatlas.com':
					isLeadSourceValid = true;
					break;
				case 'school campaign':
					isLeadSourceValid = true;
					break;
				case 'pamphlets':
					isLeadSourceValid = true;
					break;
				case 'facebook':
					isLeadSourceValid = true;
					break;
				case 'walkin':
					isLeadSourceValid = true;
					break;
				case 'sulekha':
					isLeadSourceValid = true;
					break;
				case 'justdial':
					isLeadSourceValid = true;
					break;
				case 'upbanpro':
					isLeadSourceValid = true;
					break;
				case 'shiksha':
					isLeadSourceValid = true;
					break;
				case 'google maps':
					isLeadSourceValid = true;
					break;
				case 'other':
					isLeadSourceValid = true;
					break;
				default:
					isLeadSourceValid = false;
					break;
			}
			if (isLeadSourceValid === false) {
				this.showErrorMessage(`Source at row ${index + 2} is not valid, refer to valid source options`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateLeadStatus = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			let isLeadStatusValid;
			switch (leadData['Status']) {
				case 'active':
					isLeadStatusValid = true;
					break;
				case 'enrolled':
					isLeadStatusValid = true;
					break;
				case 'closed':
					isLeadStatusValid = true;
					break;
				default:
					isLeadStatusValid = false;
					break;
			}
			if (isLeadStatusValid === false) {
				this.showErrorMessage(`Status at row ${index + 2} is not valid, valid options are: active, enrolled, closed`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateLeadStrength = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			let isLeadStrengthValid;
			switch (leadData['Strength']) {
				case 'hot':
					isLeadStrengthValid = true;
					break;
				case 'cold':
					isLeadStrengthValid = true;
					break;
				case 'warm':
					isLeadStrengthValid = true;
					break;
				default:
					isLeadStrengthValid = false;
					break;
			}
			if (isLeadStrengthValid === false) {
				this.showErrorMessage(`Strength at row ${index + 2} is not valid, valid options are: hot, cold, warm`);
				isValid = false;
			}
		});
		return isValid;
	}

	validatePhoneNumber = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			const isPhoneNumberValid = Boolean(leadData['Phone'].length <= 12);
			if (isPhoneNumberValid === false) {
				this.showErrorMessage(`Phone Number at row ${index + 2} is not valid, use only numbers`);
				isValid = false;
			}
		});
		return isValid;
	}

	validateRequiredFields = leadsData => {
		let isValid = true;
		leadsData.forEach((leadData, index) => {
			if (Boolean(leadData['Name']) === false || Boolean(leadData['Phone']) === false) {
				this.showErrorMessage(`Lead data at row ${index + 2} is missing some compulsary field(s)!`);
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
					<a href={`${schemeAndAuthority}/excel-template/add-lead`} download="add-lead.csv">
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
						Upload
					</Button>
				</Col>
				<Row>
					<Collapse className="my-5">
						<Panel header="Instructions" key="1">
							<List
								size="large"
								dataSource={uploadInstructions}
								renderItem={item => <List.Item>{item}</List.Item>}
							/>
						</Panel>
					</Collapse>
				</Row>
			</>
		);
	}
}

export default withRouter(ExcelLeadUpload);

