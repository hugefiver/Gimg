const fs = require('fs');
const fspath = require('path');
const express = require('express');
const router = express.Router();

router.get('/:img', (req, res) => {
    const pics = req.app.get('pics');
    let imgName = req.param('img');

    let img = pics.getPic(imgName);
    if (img === null) {
        res.status(404).send('No Such Picture.');
    } else {
        let filepath = fspath.join(__dirname, '../files', img);

        fs.readFile(filepath, (err, data) => {
            if (err) {
                res.status(403).send("Can't find file.");
            } else {
                res.type(req.url.match(/.(\w+)$/)[1]);
                res.send(data);
            }
        })
    }
});

router.get('/:img/hot', (req, res) => {
    const pics = req.app.get('pics');
    let imgName = req.param('img');

    let img = pics.find(imgName);
    if (!img) {
        res.jsonp({
            err: 1,
            msg: '无此图片'
        })
    } else {
        res.jsonp({
            err: 0,
            hot: img.hot
        })
    }
});

router.get('/:img/time', (req, res) => {
    const pics = req.app.get('pics');
    let imgName = req.param('img');

    let img = pics.find(imgName);
    if (!img) {
        res.jsonp({
            err: 1,
            msg: '无此图片'
        })
    } else {
        res.jsonp({
            err: 0,
            time: img.time
        })
    }
});

router.get('/:img/md5', (req, res) => {
    const pics = req.app.get('pics');
    let imgName = req.param('img');

    let img = pics.find(imgName);
    if (!img) {
        res.jsonp({
            err: 1,
            msg: '无此图片'
        })
    } else {
        res.jsonp({
            err: 0,
            md5: img.file
        })
    }
});

module.exports = router;
