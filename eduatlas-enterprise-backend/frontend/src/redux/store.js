import { applyMiddleware, createStore, compose } from 'redux';
import { isProd } from '../config.json';

import thunk from 'redux-thunk';
import promise from 'redux-promise-middleware';

import reducer from './reducers/rootReducer';

const prodMiddleware = compose(applyMiddleware(promise(), thunk));
const devMiddleware = compose(applyMiddleware(promise(), thunk), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

let store;

if (isProd) {
	store = createStore(reducer, prodMiddleware);
} else {
	store = createStore(reducer, devMiddleware);
}

export default store;
