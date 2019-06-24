const getRandString = require('../../utils').getRandomStringFunction('0123456789abcdef');
const express = require('express');
const router = express.Router();
const fs = require('fs');

function randName(num, extName) {
    return num.toString(16).toLowerCase() + getRandString(9) + '.' + extName;
}

router.post('/', (req, res) => {
    let users = req.app.get('users');
    let pics = req.app.get('pics');
    let time = new Date();

    let id = req.session.user;
    id = id ? id : 'guest';
    let user = users.find(id);

    let file = req.files.file;
    if (!file) {
        res.jsonp({
            err: 1,
            msg: "上传失败。"
        });
        return;
    }

    let ext = file.originalFilename.match(/^.*\.(\w+)$/)[1];
    let name = randName(time.getTime(), ext);
    fs.readFile(file.path, (err, data) => {
        if (err) {
            console.log("Panic.");
        } else {
            pics.addPic(name, data, time)
        }
    });

    user.pics.push(name);
    users.changed = true;

    res.jsonp({
        err: 0,
        picName: name
    })
});

module.exports = router;
