/*global FileTransfer*/
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { schemeAndAuthority } from '../../../../config.json';

import {
	Card,
	Icon,
	message,
	Modal,
	notification,
	Row,
	Tag
} from 'antd';
import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl.js';
const { Meta } = Card;
const confirm = Modal.confirm;

class FileCard extends Component {
	showDeleteConfirm = resourceId => {
		const { deleteResource, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteResource(tuitionId, resourceId);
			}
		});
	};

	handleDeleteBtnClick = () => {
		const { _id } = this.props;
		this.showDeleteConfirm(_id);
	}

	handleDownloadBtnClick = e => {
		if (window.cordova) {
			e.preventDefault();
			const downloadFile = () => {
				const hideDownloadingMessage = message.loading('Downloading...', 0);
				const fileTransfer = new FileTransfer();
				// There is a bug in cordova which doesnot allow us to access currentTarget. It can be fixed with android studio though.
				// Recreating path to avoid using currentTarget for now!
				const path = `${schemeAndAuthority}/${this.props.path}`;
				const splitPath = path.split('/');
				const filename = splitPath[splitPath.length - 1];
				const uri = encodeURI(path);
				const fileUrl = `///storage/emulated/0/Download/${filename}`;
				const successCb = () => {
					hideDownloadingMessage();
					showSuccessModal('File Saved', `Your file has been saved at /Download/${filename} in internal storage`);
				};
				const failureCb = () => {
					hideDownloadingMessage();
					showErrorModal('Error', 'Your file could not be saved because of some technical error');
				};
				fileTransfer.download(uri, fileUrl, successCb, failureCb, false, {});
			};
			const showSuccessModal = (message, description) => {
				const opts = {
					message,
					description,
					type: 'success'
				};
				notification.open(opts);
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
				downloadFile();
			};
			const permissions = window.cordova.plugins.permissions;
			permissions.hasPermission(permissions.WRITE_EXTERNAL_STORAGE, status => {
				if (status.hasPermission) {
					downloadFile();
				} else {
					permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, success, error);
				}
			});
		}
	}

	render() {
		const { path, title, description, type, showDelete, students } = this.props;
		const actionsJsx = showDelete === false ? (
			[<a rel="noopener noreferrer" target="_blank" href={`${schemeAndAuthority}/${path}`} onClick={this.handleDownloadBtnClick} download><Icon type="download" /></a>]
		) : (
				[<a rel="noopener noreferrer" target="_blank" href={`${schemeAndAuthority}/${path}`} onClick={this.handleDownloadBtnClick} download><Icon type="download" /></a>, <Icon type="delete" onClick={this.handleDeleteBtnClick} />]
			);

		return (
			<Card
				className="mb-3"
				actions={actionsJsx}>
				<Meta
					avatar={<Icon style={{ fontSize: 32 }} type="file" theme="twoTone" twoToneColor="#00bcd4" />}
					title={title}
					description={
						<>
							<Row className="one-line-ellipsis">
								{description}
							</Row>
							<Row>
								<span className="font-weight-bold">Shared With: </span>{students.length} Students
							</Row>
							<Row>
								<Tag color="blue">{type}</Tag>
							</Row>
						</>
					} />
			</Card>
		);
	}
}
export default withRouter(FileCard);

