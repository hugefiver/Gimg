const express = require('express');
const router = express.Router();

// Login
router.post('/', (req, res) => {
    let users = req.app.get('users');
    let id = req.body['id'];
    if (req.session['user']) {
        res.jsonp({
            err: 2,
            msg: "已登录，请注销后重试。"
        });
        return
    }
    let password = req.body['password'];
    let user = users.find(id);
    if (user !== null && user.id !== 'guest' && users.isPasswordMatched(password, user['password'])) {
        req.session['user'] = id;
        res.jsonp({
            err: 0,
            msg: user['name'] + " 已登录"
        })
    } else {
        res.jsonp({
            err: 1,
            msg: '用户不存在或密码错误'
        })
    }
});

module.exports = router;
