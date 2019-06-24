const express = require('express');
const router = express.Router();

// Check
router.get('/', (req, res) => {
    let users = req.app.get('users');
    let id = req.session['user'];
    if (id) {
        let user = users.find(id);
        if (user) {
            res.jsonp({
                err: 0,
                user: {
                    id: id,
                    name: user.name,
                    level: user.level,
                    pics: user.pics
                },
            })
        } else {
            res.jsonp({
                err:2,
                msg: '无法获取用户信息。'
            })
        }
    } else {
        res.jsonp({
            err: 1,
            msg: '未登录。'
        })
    }
});

module.exports = router;
