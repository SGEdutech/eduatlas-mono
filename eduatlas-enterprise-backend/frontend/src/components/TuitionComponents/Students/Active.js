import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Link } from 'react-router-relative-link';

import StudentCard from './Active/StudentCard';

import filterStudents from '../../../scripts/filterStudents';
import getTuitionIdFromUrl from '../../../scripts/getTuitionIdFromUrl';
import getRandomColor from '../../../scripts/randomColor';
import scrollToTop from '../../../scripts/scrollToTop';

import {
	Avatar,
	Button,
	Card,
	Col,
	Dropdown,
	Empty,
	Icon,
	Input,
	List,
	Menu,
	Modal,
	Pagination,
	Row,
	Skeleton
} from 'antd';
const confirm = Modal.confirm;

const colLayout = {
	xs: 24,
	sm: 12,
	md: 8,
	xl: 6,
	xxl: 6
};

const pageSize = 12;

const ifMobile = window.screen.width ? window.screen.width <= 320 : true;

class Active extends Component {
	state = {
		search: '',
		currentPage: 1,
		itemsPerPage: pageSize
	};

	componentDidMount() {
		scrollToTop();
	}

	handlePaginationChange = (currentPage, itemsPerPage) => this.setState({ currentPage, itemsPerPage });

	handleSearchInpChange = e => this.setState({ search: e.currentTarget.value, currentPage: 1 });

	showDeleteConfirm = id => {
		const { deleteStudent, match: { url } } = this.props;
		const tuitionId = getTuitionIdFromUrl(url);
		confirm({
			title: 'Are You Sure?',
			content: 'This action is permanent!',
			okText: 'Yes',
			okType: 'danger',
			cancelText: 'No',
			onOk() {
				deleteStudent(tuitionId, id);
			}
		});
	};

	render() {
		const { batches, messageInfo, students } = this.props;
		const { currentPage, itemsPerPage } = this.state;

		// filter out students without batches
		const studentsToShow = students.filter(student => {
			let isInAnyBatch = false;
			batches.forEach(batch => {
				if (batch.students.find(studentId => student._id === studentId)) isInAnyBatch = true;
			});
			if (isInAnyBatch) return student;
			return false;
		});

		const studentsToRender = filterStudents(studentsToShow, this.state.search);

		// Sort Students in Alphabetical order
		studentsToRender.sort((a, b) => {
			if (a.name < b.name) return -1;
			if (a.name > b.name) return 1;
			return 0;
		});

		const studentsToRenderOnThisPage = studentsToRender.slice(itemsPerPage * (currentPage - 1), currentPage * itemsPerPage);

		/* const studentsJsx = studentsToRenderOnThisPage.map(({ _id, name, rollNumber, email }) => (
			<Col {...colLayout} key={_id}>
				<div className="mb-3">
					<StudentCard
						id={_id}
						name={name}
						rollNumber={rollNumber}
						email={email}
						deleteStudent={this.showDeleteConfirm} />
				</div>
			</Col>
		)); */

		const studentsJsx = <List
			itemLayout="horizontal"
			dataSource={studentsToRenderOnThisPage}
			renderItem={student => (
				<List.Item actions={[
					<Dropdown trigger={['hover', 'click']} overlay={
						<Menu>

							{/* <Link to={'./' + id}><IconsWithTooltip tooltipMessage="View" iconType="eye" /></Link>,
							<Link to={'./' + id}><IconsWithTooltip tooltipMessage="Edit" iconType="edit" /></Link>,
							<IconsWithTooltip tooltipMessage="Delete" iconType="delete" onClick={() => deleteStudent(id)} /> */}

							<Menu.Item className="pb-2" key="1">
								<Link to={'./' + student._id}>
									<Icon className="mr-2" type="eye" />
									View Details
								</Link>
							</Menu.Item>
							<Menu.Item className="pb-2" key="2">
								<Link to={'./' + student._id}>
									<Icon className="mr-2" type="edit" />
									Edit Details
								</Link>
							</Menu.Item>
							<Menu.Item className="pb-2" key="3" onClick={this.showDeleteConfirm}>
								<Icon type="delete" />
								Delete Student
						  	</Menu.Item>
						</Menu>
					}>
						<Button shape="circle" icon="caret-down"></Button>
					</Dropdown>
				]}>
					<List.Item.Meta
						avatar={<Avatar style={{ backgroundColor: getRandomColor(student._id) }}>{student.name.slice(0, 1).toUpperCase()}</Avatar>}
						title={ifMobile && student.name.length > 18 ? student.name.slice(0, 15) + '...' : student.name}
						description={ifMobile && student.email.length > 18 ? student.email.slice(0, 15) + '...' : student.email}
					/>
				</List.Item>
			)}
		/>;

		const emptyJsx = <Empty className="mt-4"
			image="https://gw.alipayobjects.com/mdn/miniapp_social/afts/img/A*pevERLJC9v0AAAAAAAAAAABjAQAAAQ/original"
			description={<span>Nothing is better than something...</span>}></Empty>;

		const skeletonCards = [];
		for (let i = 0; i < 5; i++) {
			skeletonCards.push(
				<Col {...colLayout} key={i}>
					<Card className="mb-3">
						<Skeleton loading={true} active></Skeleton>
					</Card>
				</Col>
			);
		}

		return (
			<>
				<div className="container py-5">
					<Row className="mb-3">
						<Input allowClear addonAfter={<Icon type="search" />} onChange={this.handleSearchInpChange} placeholder="Search Students" />
					</Row>
					{/* <Row gutter={16}> */}
					{messageInfo.fetching ? skeletonCards : (studentsToShow.length === 0 ? emptyJsx : studentsJsx)}
					{/* </Row> */}
					<Pagination className="mb-3" current={currentPage} hideOnSinglePage={true} onChange={this.handlePaginationChange} pageSize={pageSize} total={studentsToRender.length} />
				</div>
			</>
		);
	}
}

export default withRouter(Active);
