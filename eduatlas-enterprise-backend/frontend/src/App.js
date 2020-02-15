/* global FCMPlugin */
import './core/css/material-kit.css';
import './App.css';

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Route, Switch, withRouter } from 'react-router-dom';
import Router from './Router';
import PullRefresh from 'react-pullrefresh';

// Tuition components
import AddOrEditBatch from './components/TuitionComponents/Configure/AddOrEditBatch';
import AddOrEditCourse from './components/TuitionComponents/Configure/AddOrEditCourse';
import AddOrEditDiscount from './components/TuitionComponents/Configure/AddOrEditDiscount';
import AddOrEditTest from './components/TuitionComponents/PerformanceReport/Test/AddOrEditTest';
import AddSchedule from './components/TuitionComponents/Schedule/AddSchedule';
import AddStudent from './components/TuitionComponents/Students/AddStudent';
import AddStudyMaterial from './components/TuitionComponents/StudyMaterial/AddStudyMaterial';
import Announcements from './components/TuitionComponents/Communicator/Announcements';
import AttendanceDetails from './components/TuitionComponents/Attendance/AttendanceDetails';
import Communicator from './components/TuitionComponents/Communicator';
import Configure from './components/TuitionComponents/Configure';
import EditInstituteProfile from './components/TuitionComponents/EditInstituteProfile';
import EditProfile from './components/EditProfile';
import EditSchedule from './components/TuitionComponents/Schedule/EditSchedule';
import Leads from './components/TuitionComponents/Leads';
import NewAnnouncement from './components/TuitionComponents/Communicator/NewAnnouncement';
import PerformanceReport from './components/TuitionComponents/PerformanceReport';
import Requests from './components/TuitionComponents/Students/Requests';
import RolesManagement from './components/TuitionComponents/RolesManagement';
import Students from './components/TuitionComponents/Students';
import TuitionManager from './components/TuitionComponents/TuitionManager';
import ViewAnnouncement from './components/TuitionComponents/Communicator/Announcements/ViewAnnouncement';
import ViewOrEditStudent from './components/TuitionComponents/Students/ViewOrEditStudent';
import Reports from './components/TuitionComponents/Reports';

// Shared components
import Loading from './components/Loading';
import Login from './components/Login';
import Signup from './components/Signup';
import ReceiptConfig from './components/ReceiptConfig';

// Student components
import EnrollmentAndFee from './components/StudentComponents/EnrollmentAndFee';
import StudentManager from './components/StudentComponents/StudentManager';
import FreeResource from './components/StudentComponents/FreeResource';
import StudentPerformanceReport from './components/StudentComponents/PerformanceReport';
import SendRequest from './components/StudentComponents/SendRequest';

// AntD Components
import { message } from 'antd';

// Actions
import fetchAll from './redux/actions/fetchAllAction';
import { addNotification } from './redux/actions/notificationActions';
import { addStudent } from './redux/actions/studentActions';
import { addRequest, deleteRequest } from './redux/actions/requestActions';
import { resetSandesh } from './redux/actions/mesageActions';
import { addLead } from './redux/actions/leadActions';
import { addResource, fakeAddResourceFulfilled, fakeAddResourcePending, fakeAddResourceRejected } from './redux/actions/resourceActions';

// Scripts
import refreshRegistrationId from './scripts/refreshRegistrationId';
import getTuitionIdFromUrl from './scripts/getTuitionIdFromUrl';

class App extends Component {
	componentDidMount() {
		if (this.props.messageInfo.fetched) return;
		const { fetchAll, match: { params: { tuitionId } } } = this.props;
		fetchAll(tuitionId);
		setInterval(() => fetchAll(tuitionId), 2 * 60 * 1000);
		// Firebase service
		if (window.cordova) {
			window.cordova.plugins.autoStart.enable();
			// TODO: Fix memory leak
			FCMPlugin.onTokenRefresh(refreshRegistrationId);
		}
	}

	componentDidUpdate() {
		const { fetchAll, match: { params: { tuitionId } }, messageInfo } = this.props;
		if (messageInfo.kaamChaluHai) {
			message.loading('Action in progress..', 0);
		} else if (messageInfo.fetchFailed) {
			setTimeout(() => fetchAll(tuitionId), 5000);
		} else if (messageInfo.kaamHoGaya) {
			message.destroy();
			message[messageInfo.lifafa.level](messageInfo.lifafa.sandesh);
			this.props.resetSandesh();
		}
	}

	handleRefresh = async () => {
		const { fetchAll, match: { params: { tuitionId } } } = this.props;
		await fetchAll(tuitionId);
	}

	render() {
		const { match: { url }, students, courses, batches, tests, user } = this.props;
		const { primaryEmail } = user;
		const studentInfo = students.find(student => student.email === primaryEmail);
		return (
			<PullRefresh
				onRefresh={this.handleRefresh}
				zIndex={102}
			>
				<Router>
					<Switch>
						<Route exact path={url + '/'} render={() => <Loading messageInfo={this.props.messageInfo} roles={this.props.roles} user={this.props.user} students={this.props.students} />}></Route>
						<Route exact path={url + '/send-request'} render={() => <SendRequest addRequest={this.props.addRequest} requests={this.props.requests} userInfo={this.props.user} />}></Route>
						<Route exact path={url + '/tuition'} component={TuitionManager}></Route>
						<Route exact path={url + '/tuition/roles-management'} component={RolesManagement}></Route>
						<Route exact path={url + '/tuition/configure/add-course'} component={AddOrEditCourse}></Route>
						<Route exact path={url + '/tuition/configure/add-batch'} component={AddOrEditBatch}></Route>
						<Route exact path={url + '/tuition/configure/add-discount'} component={AddOrEditDiscount}></Route>
						<Route exact path={url + '/tuition/configure/edit-course/:courseId'} render={() => <AddOrEditCourse edit={true} />}></Route>
						<Route exact path={url + '/tuition/configure/edit-batch/:batchId'} render={() => <AddOrEditBatch edit={true} />}></Route>
						<Route exact path={url + '/tuition/configure/edit-discount/:discountId'} render={() => <AddOrEditDiscount edit={true} />}></Route>
						<Route exact path={url + '/tuition/students/:studentId/payment/:paymentId/add-installment'} render={() => <AddStudent task="add-installment" />}></Route>
						<Route exact path={url + '/tuition/students/:studentId/add-payment'} render={() => <AddStudent task="add-payment" />}></Route>
						<Route exact path={url + '/tuition/students/:studentId'} render={() => <ViewOrEditStudent />}></Route>
						<Route exact path={url + '/tuition/edit-schedule/:scheduleId'} render={() => <EditSchedule />}></Route>
						<Route exact path={url + '/tuition/attendance/:scheduleId'} render={() => <AttendanceDetails />}></Route>
						<Route exact path={url + '/edit-profile/:userId'} render={() => <EditProfile />}></Route>
						<Route exact path={url + '/login'} component={Login}></Route>
						<Route exact path={url + '/signup'} component={Signup}></Route>
						<Route exact path={url + '/student'} component={StudentManager}></Route>
						<Route exact path={url + '/student/free-resource'} render={() => <FreeResource messageInfo={this.props.messageInfo} resources={this.props.resources} />}></Route>
						<Route exact path={url + '/student/enrollment-fee'} render={() => <EnrollmentAndFee courses={courses} studentInfo={studentInfo} />}></Route>
						<Route exact path={url + '/student/test-report'} render={() => <StudentPerformanceReport batches={batches} studentInfo={studentInfo} tests={tests} />}></Route>
						<Route exact path={url + '/receipt-config'} component={ReceiptConfig}></Route>
						<Route exact path={url + '/tuition/performance-report/add-test'} component={AddOrEditTest}></Route>
						<Route exact path={url + '/tuition/performance-report/edit-test/:testId'} render={() => <AddOrEditTest edit={true} />}></Route>
						<Route exact path={url + '/tuition/communicator/view-announcement/:announcementId'} render={() => <ViewAnnouncement notifications={this.props.notifications} students={this.props.students} />}></Route>
						<Route exact path={url + '/tuition/communicator/add-announcement'} render={() => <NewAnnouncement messageInfo={this.props.messageInfo} batches={this.props.batches} students={this.props.students} addNotification={this.props.addNotification} />}></Route>
						<Route exact path={url + '/tuition/add-schedule'} component={AddSchedule}></Route>
						<Route exact path={url + '/tuition/add-resource'} render={() => <AddStudyMaterial addResource={this.props.addResource} batches={this.props.batches} fakeAddResourceFulfilled={this.props.fakeAddResourceFulfilled} fakeAddResourcePending={this.props.fakeAddResourcePending} fakeAddResourceRejected={this.props.fakeAddResourceRejected} resources={this.props.resources} showDelete={true} students={this.props.students} />}></Route>
						<Route exact path={url + '/tuition/configure'} component={Configure}></Route>
						<Route exact path={url + '/tuition/students'} component={Students}></Route>
						<Route exact path={url + '/tuition/communicator'} render={() => <Announcements messageInfo={this.props.messageInfo} announcements={this.props.notifications} />}></Route>
						<Route exact path={url + '/tuition/performance-report'} component={PerformanceReport}></Route>
						<Route exact path={url + '/tuition/app-downloads'} render={() => <Requests addLead={this.props.addLead} students={this.props.students} requests={this.props.requests} addStudent={this.props.addStudent} deleteRequest={this.props.deleteRequest} batches={this.props.batches} courses={this.props.courses} />}></Route>
						<Route exact path={url + '/tuition/leads'} component={Leads}></Route>
						<Route exact path={url + '/tuition/edit-institute'} component={EditInstituteProfile}></Route>
						<Route exact path={url + '/tuition/reports'} render={props => <Reports {...props} courses={courses} batches={batches} students={students} />}></Route>
					</Switch>
				</Router>
			</PullRefresh>
		);
	}
}

function mapStateToProps(state) {
	return {
		batches: state.batch.batches,
		courses: state.course.courses,
		messageInfo: state.messageInfo,
		notifications: state.notification.notifications,
		requests: state.request.requests,
		resources: state.resource.resources,
		roles: state.role.roles,
		students: state.student.students,
		tests: state.test.tests,
		user: state.user.userInfo
	};
}

export default compose(connect(mapStateToProps, { addLead, addNotification, addRequest, addResource, addStudent, deleteRequest, resetSandesh, fetchAll }), withRouter)(App);
