module.exports = callback => (req, res) => {
    let users = req.app.get('users');
    let currentUser = users.find(req.session.user);
    let distUser = req.param('user');

    if (!currentUser || currentUser.level < 2 && req.session.user !== distUser) {
        res.jsonp({
            err: 403,
            msg: '权限不足。'
        })
    } else {
        callback(req, res)
    }
};
