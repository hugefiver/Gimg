const express = require('express');
const router = express.Router();

// Logout
router.use('/', (req, res) => {
    if (req.session['user']) {
        req.session.destroy(err => {
            if (err) {
                res.jsonp({
                    err: 2,
                    msg: '登出失败'
                })
            } else {
                res.jsonp({
                    err: 0,
                    msg: "Success."
                })
            }
        })
    } else {
        res.jsonp({
            err: 1,
            msg: "未登录。"
        })
    }
});

module.exports = router;
