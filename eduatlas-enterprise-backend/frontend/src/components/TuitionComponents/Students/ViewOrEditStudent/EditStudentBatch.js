import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import getTuitionIdFromUrl from '../../../../scripts/getTuitionIdFromUrl';

import {
	Avatar,
	Button,
	Card,
	List,
	Modal,
	Row
} from 'antd';
const confirm = Modal.confirm;
const { Meta } = Card;

class EditStudentBatch extends Component {
	state = { visible: false }

	handleAddBatch = () => {
		this.setState({ visible: false });
	}

	handleAddBatchClick = e => {
		const { batches, addStudentInBatch, match: { params: { studentId }, url } } = this.props;
		const batchId = e.currentTarget.id;
		const batchInfo = batches.find(batch => batch._id === batchId);
		const courseId = batchInfo.courseId;
		const tuitionId = getTuitionIdFromUrl(url);
		addStudentInBatch(tuitionId, courseId, batchId, studentId);
		this.setState({ visible: false });
	}

	handleCancel = () => this.setState({ visible: false });

	handleRemoveFromBatchBtnClick = batchId => {
		const { batches, deleteStudentInBatch } = this.props;
		const { match: { params: { studentId }, url } } = this.props;
		const batchInfo = batches.find(batch => batch._id === batchId);
		const courseId = batchInfo.courseId;
		const tuitionId = getTuitionIdFromUrl(url);
		deleteStudentInBatch(tuitionId, courseId, batchId, studentId);
	}

	showConfirm = batchId => {
		const { handleRemoveFromBatchBtnClick } = this;
		confirm({
			title: 'Are you sure?',
			onOk() {
				handleRemoveFromBatchBtnClick(batchId);
			}
		});
	}

	showModal = () => this.setState({ visible: true });

	render() {
		const { batches, match: { params: { studentId: currentStudentId } } } = this.props;
		const batchesOfThisStudent = batches.filter(batch => Boolean(batch.students.find(studentId => currentStudentId === studentId)));
		const addBatchOptions = batches.filter(batch => Boolean(batch.students.find(studentId => currentStudentId === studentId)) === false);
		// insert a AddToBatchCard
		batchesOfThisStudent.push({ newBatchCard: true });

		return (
			<List
				className="mb-3"
				itemLayout="horizontal"
				dataSource={batchesOfThisStudent}
				renderItem={batch => (
					Boolean(batch.newBatchCard) === false ?
						<List.Item
							actions={
								[
									<Button icon="delete" onClick={() => this.showConfirm(batch._id)} shape="circle" type="danger" />
								]
							}>
							<List.Item.Meta
								avatar={<Avatar style={{ backgroundColor: '#00bcd4' }}>{batch.code.substr(0, 1).toUpperCase()}</Avatar>}
								title={batch.code} />
						</List.Item> :
						<List.Item>
							<Card
								className="h-100 w-100"
								hoverable
								onClick={this.showModal}>
								<Meta
									description={
										<Row align="middle" justify="center" type="flex">Add To Batch</Row>
									} />
							</Card>
							<Modal
								centered={true}
								footer={[
									<Button key="Cancel" onClick={this.handleCancel}>Cancel</Button>
								]}
								onCancel={this.handleCancel}
								title="Select batch to add student to:"
								visible={this.state.visible}>
								<List
									dataSource={addBatchOptions}
									itemLayout="horizontal"
									renderItem={batch => {
										return (
											<Button className="my-1" id={batch._id} key={batch._id} onClick={this.handleAddBatchClick} size="large" block>{batch.code}</Button>
										);
									}}>
								</List>
							</Modal>
						</List.Item>

				)
				} />
		);
	}
}

export default withRouter(EditStudentBatch);

