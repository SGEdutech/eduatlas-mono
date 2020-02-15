/* global FileUploadOptions, FileTransfer */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';

import StudentSelector from '../Communicator/NewAnnouncement/StudentSelector';
import Navbar from '../../Navbar';

import sanatizeFormObj from '../../../scripts/sanatize-form-obj';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import scrollToTop from '../../../scripts/scrollToTop';

import { schemeAndAuthority } from '../../../config.json';

import {
	Button,
	Col,
	Form,
	Icon,
	Input,
	notification,
	Row,
	Select,
	Upload
} from 'antd';

const { TextArea } = Input;
const { Option } = Select;

const colLayout = {
	xs: 24,
	md: 12
};

const dummyRequest = ({ file, onSuccess }) => {
	setTimeout(() => {
		onSuccess('ok');
	}, 0);
};

class AddStudyMaterial extends Component {
	state = {
		selectedFile: null,
		resourceType: null
	};

	componentDidMount() {
		scrollToTop();
	}

	filterOptions = (input, option) => {
		if (option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0) return true;
	}

	handleBatchChange = selectedBatches => {
		const { batches, form: { setFieldsValue }, students } = this.props;
		let studentsIdsOfSelectedBatches = [];
		selectedBatches.forEach(selectedBatchId => {
			const studentOfThisBatch = batches.find(batch => batch._id === selectedBatchId).students;
			studentsIdsOfSelectedBatches = [...new Set([...studentsIdsOfSelectedBatches, ...studentOfThisBatch])];
		});
		const studentEmailsOfSelectedBatch = studentsIdsOfSelectedBatches.map(studentId => students.find(student => student._id === studentId).email);
		setFieldsValue({ students: studentEmailsOfSelectedBatch });
	}

	handleBrowserUpload = () => {
		const { addResource, form, form: { resetFields }, match: { url } } = this.props;
		const { selectedFile } = this.state;
		const tuitionId = getTuitionIdFromUrl(url);
		form.validateFieldsAndScroll((err, values) => {
			if (err) {
				console.error(err);
				return;
			}
			sanatizeFormObj(values);
			if (selectedFile) values.file = selectedFile.originFileObj;
			addResource(tuitionId, values);
			resetFields();
			this.setState({ selectedFile: null });
		});
	}

	handleCordovaUpload = () => {
		const { fakeAddResourceFulfilled, fakeAddResourcePending, fakeAddResourceRejected, form, form: { resetFields }, match: { url } } = this.props;
		const { resourceType } = this.state;
		// If there is no file to share, browser upload function should be able to handle everything
		if (resourceType === 'video') {
			this.handleBrowserUpload();
			return;
		}
		const tuitionId = getTuitionIdFromUrl(url);
		const successCb = newResource => {
			fakeAddResourceFulfilled(JSON.parse(newResource.response));
			resetFields();
		};
		const errorCb = err => alert(err);
		const failureCb = () => fakeAddResourceRejected();
		const uploadResource = () => {
			form.validateFieldsAndScroll((err, values) => {
				window.plugins.mfilechooser.open([], uri => {
					window.resolveLocalFileSystemURL('file://' + uri, fileEntry => {
						const fileURL = fileEntry.toURL();
						if (err) {
							errorCb(err);
							return;
						}
						sanatizeFormObj(values);
						const opts = new FileUploadOptions();
						opts.fileName = fileURL.substr(fileURL.lastIndexOf('/') + 1);
						opts.httpMethod = 'POST';
						opts.params = { dataInJson: JSON.stringify(values) };
						const ft = new FileTransfer();
						fakeAddResourcePending();
						ft.upload(fileURL, encodeURI(`${schemeAndAuthority}/tuition/${tuitionId}/resource`), successCb, failureCb, opts);
					}, errorCb);
				}, errorCb);
			});
		};
		const showErrorModal = (message, description) => {
			const opts = {
				message,
				description,
				duration: 0,
				type: 'error'
			};
			notification.open(opts);
		};
		const error = () => showErrorModal('Permission not granted', 'To grant permission go to, Settings > Apps and Notification > App Name > Permissions > Storage');
		const success = status => {
			if (status.hasPermission === false) {
				error();
				return;
			}
			uploadResource();
		};
		const permissions = window.cordova.plugins.permissions;
		permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
			if (status.hasPermission) {
				uploadResource();
			} else {
				permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
			}
		});
	}

	handleStudentChange = selectedStudents => this.setState({ selectedStudents });

	handleSelectAll = isChecked => {
		const { form: { setFieldsValue }, students } = this.props;
		const allStudentsEmail = students.map(student => student.email);
		isChecked ? setFieldsValue({ students: allStudentsEmail }) : setFieldsValue({ students: [] });
	}

	handleSubmit = e => {
		e.preventDefault();
		if (window.cordova) {
			this.handleCordovaUpload();
		} else {
			this.handleBrowserUpload();
		}
	}

	onFileInpChange = info => {
		if (info.file.status === 'uploading' || info.file.status === 'done') {
			this.setState({ selectedFile: info.file });
			return;
		}
		this.setState({ selectedFile: null });
	}

	handleTypeOfMaterialChange = changedType => {
		if (changedType !== 'video') {
			this.setState({ resourceType: changedType, selectedFile: null });
			return;
		}
		this.setState({ resourceType: changedType });
	}

	validateYoutubeLink = (rule, link = '', callback) => {
		const { resources } = this.props;
		link = link.trim();
		if (Boolean(link) === false) callback('invalid!');
		const resourceInfo = resources.find(resource => resource.ytUrl === link);
		const isDuplicate = Boolean(resourceInfo);
		if (isDuplicate) callback('URL already exists');
		callback();
	}

	validateTitle = (rule, title = '', callback) => {
		const { resources } = this.props;
		title = title.trim();
		if (Boolean(title) === false) callback('Please enter something!');
		const resourceInfo = resources.find(resource => resource.title === title);
		const isDuplicate = Boolean(resourceInfo);
		if (isDuplicate) callback('Title already exists');
		callback();
	}

	render() {
		const { batches, students, form: { getFieldDecorator } } = this.props;
		const { resourceType, selectedFile } = this.state;
		let submitBtnText;
		if (resourceType === 'video') {
			submitBtnText = 'Share';
		} else if (window.cordova) {
			submitBtnText = 'Select File';
		} else {
			submitBtnText = 'Upload And Share';
		}

		return (
			<>
				<Navbar renderBackBtn={true} navText="Add Study Material" />
				<div className="container below-nav">
					<Form onSubmit={this.handleSubmit} className="pt-3">
						<Row gutter={16}>
							{this.state.resourceType !== 'free' && <StudentSelector
								fieldName="students"
								colLayout={colLayout}
								filterOptions={this.filterOptions}
								students={students}
								handleBatchChange={this.handleBatchChange}
								batches={batches}
								handleSelectAll={this.handleSelectAll}
								getFieldDecorator={getFieldDecorator} />}
							<Col {...colLayout}>
								<Form.Item
									label="Type Of Resource"
									hasFeedback={true}>
									{getFieldDecorator('type', {
										defaultValue: 'reference material',
										rules: [{ required: 'true', message: 'Must Choose Type' }]
									})(
										<Select onChange={this.handleTypeOfMaterialChange}>
											<Option className="text-uppercase" value="reference material">Reference Material</Option>
											<Option className="text-uppercase" value="homework">Homework</Option>
											<Option className="text-uppercase" value="test">Assignment/Test</Option>
											<Option className="text-uppercase" value="video">Video</Option>
											<Option className="text-uppercase" value="free">Free</Option>
										</Select>
									)}
								</Form.Item>
							</Col>
							{resourceType !== 'video' &&
								<>
									<Col {...colLayout}>
										<Form.Item
											label="Title"
											hasFeedback={true}>
											{getFieldDecorator('title', {
												rules: [
													{ required: 'true', message: 'Must provide title!!' },
													{ validator: this.validateTitle }
												]
											})(
												<Input />
											)}
										</Form.Item>
									</Col>
									<Col {...colLayout}>
										<Form.Item
											label="Description"
											hasFeedback={true}>
											{getFieldDecorator('description')(
												<TextArea autosize={{ minRows: 4 }} />
											)}
										</Form.Item>
									</Col>
									{Boolean(window.cordova) === false && (
										<Col {...colLayout}>
											<Form.Item label="File">
												<div className="dropbox">
													{getFieldDecorator('file', {
														rules: [{ required: 'true', message: 'Must Choose File' }]
													})(
														<Upload.Dragger
															fileList={selectedFile ? [selectedFile] : []}
															customRequest={dummyRequest}
															onChange={this.onFileInpChange}>
															<p className="ant-upload-drag-icon">
																<Icon type="inbox" />
															</p>
															<p className="ant-upload-text">Click or drag file to this area to upload</p>
														</Upload.Dragger>
													)}
												</div>
											</Form.Item>
										</Col>
									)}
								</>
							}

							{resourceType === 'video' &&
								<Col {...colLayout}>
									<Form.Item label="YouTube Url/Link"
										hasFeedback={true}>
										{getFieldDecorator('ytUrl', {
											rules: [
												{ required: 'true', message: 'Must Provide Link!!' },
												{ validator: this.validateYoutubeLink }
											]
										})(
											<Input
												placeholder="URL/Link"
												pattern={'^((?:https?:)?\\/\\/)?((?:www|m)\\.)?((?:youtube\\.com|youtu.be))(\\/(?:[\\w\\-]+\\?v=|embed\\/|v\\/)?)([\\w\\-]+)(\\S+)?$'}
												title="Please provide valid youtube url" />
										)}
									</Form.Item>
								</Col>
							}
							<Col span={24}>
								<Row type="flex" justify="end">
									<Form.Item>
										<Button type="primary" htmlType="submit">
											{submitBtnText}
										</Button>
									</Form.Item>
								</Row>
							</Col>
						</Row>
					</Form>
				</div>
			</>
		);
	}
}

export default compose(Form.create({ name: 'new-study-material' }), withRouter)(AddStudyMaterial);
