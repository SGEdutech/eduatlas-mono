const express = require('express');
const cors = require('cors');
const path = require('path');
const assert = require('assert');
const PORT = require('./config').SERVER.PORT;
const keys = require('../database-and-auth/oauth/_config').keys;
const {
	passport,
	session
} = require('../database-and-auth/oauth/passport-and-session');
const {
	eventPicsMiddleware,
	schoolPicsMiddleware,
	tuitionPicsMiddleware,
	userCoverPicMiddleware,
	solutionPdfMiddleware,
	notificationMiddleware,
	resourcesMiddleware
} = require('../database-and-auth/storage-engine');
const { nestingMiddleware } = require('../database-and-auth/scripts/nesting');
const MongoDBStore = require('connect-mongodb-session')(session);
const { passwordHashMiddleware } = require('./scripts/hash-password');
const { redirectUnknownHostMiddlewareEduatlasEnterprise } =
	require('../database-and-auth/scripts/redirect-unknown-host-middleware');
const databaseURI = require('../database-and-auth/config.json').MONGO.URI;
const cookieDomain = require('../database-and-auth/config.json').COOKIE.DOMAIN;
require('../database-and-auth/oauth/local');
require('../database-and-auth/oauth/google');
require('../database-and-auth/oauth/facebook');
require('../database-and-auth/database/connection');

const routes = {
	blog: require('../database-and-auth/database/api/blog'),
	event: require('../database-and-auth/database/api/event'),
	school: require('../database-and-auth/database/api/school'),
	tuition: require('../database-and-auth/database/api/tuition'),
	user: require('../database-and-auth/database/api/user'),
	issue: require('../database-and-auth/database/api/issue'),
	auth: require('../database-and-auth/oauth/auth_routes'),
	forgot: require('../database-and-auth/oauth/forgot'),
	solution: require('../database-and-auth/database/api/solution'),
	promotedHome: require('../database-and-auth/database/api/promoted-home'),
	promotedSearch: require('../database-and-auth/database/api/promoted-search'),
	promotedRelated: require('../database-and-auth/database/api/promoted-related'),
	forumPost: require('../database-and-auth/database/api/forum-post'),
	notification: require('../database-and-auth/database/api/notification')
};

const store = new MongoDBStore({
	uri: databaseURI,
	collection: 'sessions'
});

store.on('connected', () => console.log('Session has connected to the database'));

store.on('error', error => {
	assert.ifError(error);
	assert.ok(false);
});

const app = express();

app.use(redirectUnknownHostMiddlewareEduatlasEnterprise);

const corsOptions = {
	origin: (origin, cb) => cb(null, true),
	exposedHeaders: true,
	credentials: true
};

app.use(cors(corsOptions));

app.use('/images', express.static(path.join(process.cwd(), 'images')));

app.get('/excel-template/add-score', (req, res) => res.sendFile(path.join(__dirname, 'excel-templates', 'add-score.csv')));
app.get('/excel-template/add-student', (req, res) => res.sendFile(path.join(__dirname, 'excel-templates', 'add-student.csv')));
app.get('/excel-template/mark-attendance', (req, res) => res.sendFile(path.join(__dirname, 'excel-templates', 'mark-attendance.csv')));
app.get('/excel-template/add-lead', (req, res) => res.sendFile(path.join(__dirname, 'excel-templates', 'add-lead.csv')));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({
	limit: '100mb',
	extended: true
}));

app.use(session({
	secret: keys.CookieKey,
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		domain: cookieDomain
	},
	maxAge: Date.now() + (7 * 86400 * 1000),
	store
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/app', express.static(path.join(__dirname, 'eduatlas-react', 'build')));
app.get('/app/*', (req, res) => res.sendFile(path.join(__dirname, 'eduatlas-react', 'build', 'index.html')));
app.use(express.static(path.join(__dirname, 'eduatlas-react-erp', 'build')));

app.use('/event', eventPicsMiddleware);
app.use('/school', schoolPicsMiddleware);
app.use('/tuition', (req, res, next) => {
	const pathArr = req.path.split('/');
	if (pathArr.length >= 3 && pathArr[2] === 'resource') {
		resourcesMiddleware(req, res, next);
		return;
	}
	tuitionPicsMiddleware(req, res, next);
});
app.use('/user', userCoverPicMiddleware);
app.use('/slept-through-class', solutionPdfMiddleware);
app.use('/notification', notificationMiddleware)

app.use(nestingMiddleware, passwordHashMiddleware);

app.use('/blog', routes.blog);
app.use('/event', routes.event);
app.use('/school', routes.school);
app.use('/tuition', routes.tuition);
app.use('/issue', routes.issue);
app.use('/user', routes.user);
app.use('/auth', routes.auth);
app.use('/forgot', routes.forgot);
app.use('/slept-through-classs', routes.solution);
app.use('/promoted-home', routes.promotedHome);
app.use('/promoted-search', routes.promotedSearch);
app.use('/promoted-related', routes.promotedRelated);
app.use('/forum-post', routes.forumPost);
app.use('/notification', routes.notification);

app.listen(PORT, () => console.log(`Yo dawg! Server's at http://localhost:${PORT}`));
