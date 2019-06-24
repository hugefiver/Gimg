const express = require('express');
const router = express.Router();

const adminableMiddle = require('../../middles/adminable');
const adminonlyMiddle = require('../../middles/adminonly');

const deletePic = require('../../utils').deletePic;

router.get('/:user', adminableMiddle((req, res) => {
    let users = req.app.get('users');
    let distUser = users.find(req.param('user'));

    if (distUser) {
        res.jsonp({
            err: 0,
            name: distUser.name,
            level: distUser.level,
            pics: distUser.pics
        })
    } else {
        res.jsonp({
            err: 1,
            msg: '无此用户。'
        })
    }
}));

router.post('/:user/changeName', adminonlyMiddle((req, res) => {
    let users = req.app.get('users');

    let id = req.param('user');
    let name = req.body.name;

    if (name === '' || id==='') {
        res.jsonp({
            err: 2,
            msg: '不能为空。'
        });
        return ;
    }

    let user = users.find(id);
    if (!user) {
        res.jsonp({
            err: 1,
            msg: '无此用户。'
        })
    } else {
        user.name = name;
        users.changed = true;
        res.jsonp({
            err: 0
        })
    }
}));

router.post('/add', adminonlyMiddle((req, res) => {
    let pics = req.app.get('pics');
    let users = req.app.get('users');

    let name = req.body.name;
    let time = req.body.time;
    let md5 = req.body.md5;
    let hot = req.body.hot;
    let user = req.body.user;

    if (!name || !time || !md5) {
        res.jsonp({
            err: 1,
            msg: "所有字段不能为空"
        })
    } else if (hot < 0 || hot > 10) {
        res.jsonp({
            err: 1,
            msg: "hot: 0.0~10.0"
        })
    } else {
        if (user && users.find(user)) {
            users.find(user).pics.push(name);
            users.changed = true;
        }
        pics.data[name] = {
            file: md5,
            time: time,
            hot: parseFloat(hot)
        };
        pics.changed = true;
        res.jsonp({
            err: 0
        })
    }
}))

router.get('/:user/pics', adminableMiddle((req, res) => {
    let users = req.app.get('users');
    let pics = req.app.get('pics');

    let disttime = parseInt(req.query['before']);
    let fromtime = parseInt(req.query['after']);

    let filter = disttime||fromtime ? (v) => {
        let pic = pics.find(v);
        if (!pic)
            return false;

        if (!disttime)
            disttime = new Date('9999-1-1').getTime();
        if (!fromtime)
            fromtime = 0;

        return fromtime <= new Date(pic.time).getTime() && new Date(pic.time).getTime() <= disttime;
    } : null;

    let picDict = {};

    users.getUserPics(req.param('user'), filter).forEach((v) => {
        let p = pics.find(v);
        if (p)
            picDict[v] = pics.find(v).time;
    });

    res.jsonp({
        err: 0,
        pics: picDict
    })
}));

router.post('/delete/pic', adminonlyMiddle((req, res) => {
    let users = req.app.get('users');
    let pics = req.app.get('pics');

    let ps = req.body.pics;
    for (const v of ps) {
        deletePic(v, pics, users);
    }
    res.jsonp({
        err: 0
    })
}));

router.post('/delete/user', adminonlyMiddle((req, res) => {
    let users = req.app.get('users');
    let pics = req.app.get('pics');

    let user = req.body.user;
    if (users.find(user)) {
        if (users.find(user).pics.length > 0) {
            for (let p of users.find(user).pics) {
                delete pics.data[p];
            }
            pics.changed = true;
        }
        delete users.data[user];
        users.changed = true;
        res.jsonp({
            err: 0
        })
    } else {
        res.jsonp({
            err: 1,
            msg: '无此用户'
        })
    }
}));

router.post('/changeTime', adminonlyMiddle((req, res) => {
    let pics = req.app.get('pics');

    let pic = pics.find(req.body.pic);
    let time = req.body.time;

    if (!pic) {
        res.jsonp({
            err: 1,
            msg: '无此用户'
        })
    } else {
        if (time < new Date('1971-1-1').getTime() || time < new Date().getTime()) {
            res.jsonp({
                err: 1,
                msg: '时间不合理'
            })
        } else {
            pic.time = time;
            res.jsonp({
                err: 0
            })
        }
    }
}));

router.post('/changeMD5', adminonlyMiddle((req, res) => {
    let pics = req.app.get('pics');
    let patt = /^[0123456789abcdefABCDEF]{32}$/

    let pic = pics.find(req.body.pic);
    let md5 = req.body.md5;

    if (!pic) {
        res.jsonp({
            err: 1,
            msg: '无此图片'
        })
    } else if (!patt.test(md5)) {
        res.jsonp({
            err: 2,
            msg: 'MD5不正确'
        })
    } else {
        pic.file = md5;
        pics.changed = true;
        res.jsonp({
            err: 0
        })
    }
}));

router.post('/changeHot', adminonlyMiddle((req, res) => {
    let pics = req.app.get('pics');

    if (req.body.pic === '') {
        res.jsonp({
            err: 1,
            msg: '图片不能为空'
        });
        return;
    } else if (isNaN(req.body.hot)) {
        res.jsonp({
            err: 1,
            msg: '请输入数字.'
        });
        return;
    } else if (req.body.hot < 0 || req.body.hot > 10) {
        res.jsonp({
            err: 1,
            msg: '热度大小不合法: 0.0~10.0'
        });
        return;
    }

    let pic = pics.find(req.body.pic);
    let hot = parseFloat(req.body.hot);
    if (pic) {
        pic.hot = hot;
        pics.changed = true;
        res.jsonp({
            err: 0,
        })
    } else {
        res.jsonp({
            err: 2,
            msg: '无目标图片'
        })
    }
}));



module.exports = router;
