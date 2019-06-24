const app = require('./app');
const db = require('./db/db.js');
const path = require('path');
const session = require('express-session');

const apiRouter = require('./routers/api');
const imgRouter = require('./routers/img');

const users = new db.UserDB(path.join(__dirname, 'models', 'users.json'));
const pics = new db.PicDB(path.join(__dirname, 'models', 'pics.json'), path.join(__dirname, 'files'));

app.set('users', users);
app.set('pics', pics);

app.use(session({
    name: 'user-session',
    secret: 'skdnsfrjgrejoiejrio',
    saveUninitialized: false,
    resave: true,
    rolling: true,
    cookie: {
        maxAge: 20 * 60 * 1000
    }
}));

// API
app.use('/api', apiRouter);

// Get Image
app.use('/i', imgRouter);

app.get('/', (req, res) => {
    let users = req.app.get('users');
    let user = req.session.user;
    if (user) {
        user = users.find(user);
        user = {
            id: req.session.user,
            name: user.name,
            level: user.level
        }
    }
    res.render('index', {user: user})
});

app.get('/login', (req, res) => {
    let users = req.app.get('users');
    let user = users.find(req.session.user);
    let isLogined = false;
    if (user) {
        user = {
            id: req.session.user,
            name: user.name,
            level: user.level
        };
        isLogined = true;
    }
    res.render('login', {
        user: user,
        isLogined: isLogined
    })
});

app.get('*', (req, res) => {
    res.redirect('/');
});

app.listen(8080, () => console.log('Start server at 8080 port.'));
