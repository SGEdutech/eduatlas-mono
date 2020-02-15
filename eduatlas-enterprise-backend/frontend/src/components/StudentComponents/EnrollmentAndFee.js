import React, { Component } from 'react';

import scrollToTop from '../../scripts/scrollToTop';

import Navbar from '../StudentNavbar';
import PaymentCard from './EnrollmentAndFee/PaymentCard';

import {
	Avatar,
	Card,
	Col,
	Divider,
	Form,
	Icon,
	Input,
	InputNumber,
	Row
} from 'antd';
const { Meta } = Card;

const formItemLayout = {
	labelCol: {
	},
	wrapperCol: {
	}
};

const colLayout = {
	xs: 24,
	md: 12
};

class EnrollmentAndFee extends Component {
	componentDidMount() {
		scrollToTop();
	}
	render() {
		const { courses, studentInfo } = this.props;
		const { name, rollNumber, email, contactNumber, address, payments } = studentInfo;

		return (
			<>
				<Navbar renderBackBtn={true} navText="Enrollment And Fee" />
				<div className="container below-nav">
					<Row gutter={16}>
						<Col className="pt-3">
							<Meta
								avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
								title={<span className="text-capitalize" style={{ fontWeight: 'bold' }}>{name}</span>}
								description={<small>EA ID: DWAD2324DAD</small>} />
							<Divider orientation="left"><small>Personal Details<Icon type="arrow-down" /></small></Divider>
						</Col>
						<Col>
							<Form className="pt-3">
								<Col {...colLayout}>
									<Form.Item
										{...formItemLayout}
										label="Name">
										<Input disabled={true} value={name} placeholder="name of student" />
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										{...formItemLayout}
										label="Email">
										<Input disabled={true} value={email} placeholder="email of student" />
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										{...formItemLayout}
										label="Roll Number">
										<Input disabled={true} value={rollNumber} placeholder="roll-number" />
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										{...formItemLayout}
										label="Phone Number">
										<InputNumber value={contactNumber} disabled={true} className="w-100" max={99999999999} />
									</Form.Item>
								</Col>
								<Col {...colLayout}>
									<Form.Item
										{...formItemLayout}
										label="Address">
										<Input value={address} disabled={true} />
									</Form.Item>
								</Col>
							</Form>
							<Divider orientation="left"><small>Course Payments<Icon type="arrow-down" /></small></Divider>
						</Col>
						<Col className="mb-3">
							{payments && payments.map(payment => <PaymentCard courses={courses} payment={payment} key={payment._id} />)}
						</Col>
					</Row>
				</div>
			</>
		);
	}
}

export default EnrollmentAndFee;

