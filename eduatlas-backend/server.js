const express = require('express');
const path = require('path');
const PORT = require('./config').SERVER.PORT;
const cookieDomain = require('../database-and-auth/config.json').COOKIE.DOMAIN;
const databaseURI = require('../database-and-auth/config.json').MONGO.URI;
const cors = require('cors');
const keys = require('../database-and-auth/oauth/_config').keys;
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
const { passwordHashMiddleware } = require('../database-and-auth/scripts/hash-password');
const { redirectUnknownHostMiddlewareEduatlas } = require('../database-and-auth/scripts/redirect-unknown-host-middleware');
const sanitizeDemandsMiddleware = require('../database-and-auth/scripts/sanatize-demands');
require('../database-and-auth/database/connection');
const { passport, session } = require('../database-and-auth/oauth/passport-and-session');
const MongoDBStore = require('connect-mongodb-session')(session);
require('../database-and-auth/oauth/local');
require('../database-and-auth/oauth/google');
require('../database-and-auth/oauth/facebook');

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

store.on('connected', () => console.log('Sessions have connected to the database!'));

const app = express();

// Default origin is * which messes up with axios
const corsOptions = {
	origin: (origin, cb) => cb(null, true),
	exposedHeaders: true,
	credentials: true
};

app.use(cors(corsOptions));

app.use(session({
	secret: keys.CookieKey,
	cookie: {
		maxAge: 7 * 24 * 60 * 60 * 1000,
		domain: cookieDomain
	},
	maxAge: Date.now() + 7 * 86400 * 1000,
	store
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/zohoverify/verifyforzoho.html', (req, res) => res.send('1574501235861'));
app.use('/images', express.static(path.join(process.cwd(), 'images')));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ extended: true, limit: '100mb' }));

//temp routes
app.use('/add/tuition', (req, res) => res.redirect('/add-tuition.html'));
app.use('/add/school', (req, res) => res.redirect('/add-school.html'));
app.use('/admin/tuition', (req, res) => res.redirect('/Admin-tuition.html'));
app.use('/add/notes', (req, res) => res.redirect('/solution.html'));

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
app.use('/notification', notificationMiddleware);

app.get('/*', sanitizeDemandsMiddleware);

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

app.get('/*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => console.log(`Yo dawg! Server's at http://localhost:${PORT}`));
