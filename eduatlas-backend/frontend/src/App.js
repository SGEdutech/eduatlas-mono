import axios from 'axios';
import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import Router from './Router';

import { BackTop } from 'antd';
import { host } from './config.json';

// CSS
import './App.css';
import './core/css/material-kit.css';

// Components
import Bookmark from './components/Bookmark';
import ComingSoon from './components/ComingSoon';
import ForgotPassword from './components/ForgotPassword';
import Home from './components/Home';
import ListingDetails from './components/ListingDetails';
import Loading from './components/Loading';
import Login from './components/Login';
import NotFound from './components/NotFound';
import PrivacyPolicy from './components/PrivacyPolicy';
import ResetPassword from './components/ResetPassword';
import Search from './components/Search';
import Signup from './components/Signup';
import TermsOfUse from './components/TermsOfUse';

class App extends Component {
	state = {
		userInfo: null
	}

	async componentDidMount() {
		try {
			const { data: userInfo } = await axios.get(`${host}/user/info`, { withCredentials: true });
			this.setState({ userInfo });
		} catch (error) {
			console.error(error);
		}
	}

	updateUserInfo = userInfo => this.setState({ userInfo });

	render() {
		const { userInfo } = this.state;
		return (
			<>
				<Router>
					<Switch>
						<Route exact path="/" render={() => <Loading userInfo={userInfo} />}></Route>
						<Route exact path="/search/:category" render={() => <Search userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/login" render={() => <Login updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/signup" component={Signup}></Route>
						<Route exact path="/tuition/:tuitionId" render={() => <ListingDetails userInfo={userInfo} listingType='tuition' updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/school/:schoolId" render={() => <ListingDetails userInfo={userInfo} listingType='school' updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/bookmarks" render={() => <Bookmark userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/event/:eventId" render={() => <ListingDetails userInfo={userInfo} listingType="event" updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/404" component={NotFound}></Route>
						<Route exact path="/home" render={() => <Home userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/soon" render={() => <ComingSoon userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/privacy-policy" render={() => <PrivacyPolicy userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/terms-of-use" render={() => <TermsOfUse userInfo={userInfo} updateUserInfo={this.updateUserInfo} />}></Route>
						<Route exact path="/forgot-password" render={() => <ForgotPassword userInfo={userInfo} />}></Route>
						<Route exact path="/reset-password/:token" render={() => <ResetPassword userInfo={userInfo} />}></Route>
					</Switch>
				</Router>
				<BackTop />
			</>
		);
	}
}

export default App;

