module.exports = callback => (req, res) => {
    let users = req.app.get('users');

    let currUser = req.session.user;
    if (!currUser || users.find(currUser).level < 2) {
        res.jsonp({
            err: 403,
            msg: '仅允许管理员执行此操作。'
        })
    } else {
        callback(req, res)
    }
};
