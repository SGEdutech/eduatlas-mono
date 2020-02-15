import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { Redirect, Route, Switch } from 'react-router-dom';
import Router from './Router';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import store from './redux/store';

import { tuitionId, primaryColor } from './config.json';

const theme = createMuiTheme({
	palette: {
		primary: {
			main: primaryColor
		},
		background: {
			default: 'white'
		}
	}
});

const rootElement = (
	<>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Provider store={store}>
				<Router>
					<Switch>
						<Route exact path="/" component={() => <Redirect to={`/app/${tuitionId}`} />}></Route>
						<Route path="/app/:tuitionId" component={App}></Route>
					</Switch>
				</Router>
			</Provider>
		</MuiThemeProvider>
	</>);

const startApp = () => ReactDOM.render(rootElement, document.getElementById('root'));

if (window.cordova) {
	document.addEventListener('deviceready', startApp, false);
	serviceWorker.register();
} else {
	startApp();
	serviceWorker.unregister();
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
