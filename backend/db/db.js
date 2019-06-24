const fs = require('fs');
const fspath = require('path');
const crypto = require('crypto');



class DB {
    constructor(file) {
        this.data = {};
        this.file = file;
        this.changed = false;
        if (fs.existsSync(file)) {
            this.data = JSON.parse(fs.readFileSync(file).toString());
        } else {
            this.data = {};
            this.write();
        }
        setTimeout(this.daemon.bind(this), 300);
    }

    daemon() {
        if (this.changed === true) {
            this.write();
            this.changed = false;
        }
        setTimeout(this.daemon.bind(this), 300);
    }

    write() {
        fs.writeFileSync(this.file, JSON.stringify(this.data, null, 4));
    }
}

class UserDB extends DB {
    constructor(file) {
        super(file);
        this.getRandomString = require('../utils').getRandomStringFunction("0123456789abcdefghijklmnopqrstuvwxyz");
        this.passwordPattern = /\$(.*)\$(.*)/;
    }

    generatePassword(password) {
        let salt = this.getRandomString(3);
        let hash = crypto.createHash('md5')
            .update(salt + '$' + password)
            .digest('hex')
            .toString()
            .toUpperCase();
        return `$${salt}$${hash}`;
    }

    isPasswordMatched(password, hashed) {
        let x = hashed.match(this.passwordPattern);
        if (x === null)
            return password === hashed;
        else
            return crypto.createHash('md5')
                .update(`${x[1]}$${password}`)
                .digest('hex')
                .toUpperCase() === x[2];
    }

    find(id) {
        return id in this.data ? this.data[id] : null;
    }

    insert(id, value) {
        this.data[id] = value;
        this.changed = true;
    }

    getUserPics(user, filter) {
        if (this.data[user]) {
            let pics = Array.from(this.data[user].pics);
            if (filter) {
                return pics.filter(filter);
            }
            return pics;
        } else {
            return null;
        }
    }

    insertDefault(id, name, password, level) {
        /*
        levels:
        0 - guest
        1 - user
        2 - admin
         */
        this.insert(id, {
            name: name,
            password: this.generatePassword(password),
            level: level,
            pics: []
        })
    }
}

class PicDB extends DB {
    constructor(dbfile, picPath) {
        super(dbfile);
        this.path = picPath;
    }

    getPic(name) {
        if (name in this.data) {
            return this.data[name].file;
        } else {
            return null;
        }
    }

    find(name) {
        return this.data[name] ? this.data[name] : null;
    }

    delete(name, callback) {
        if (this.data[name]) {
            delete this.data[name];
            this.changed = true;
            if (callback) {
                callback();
            }
        }
    }

    addPic(name, file, time) {
        let filename = crypto.createHash('md5')
            .update(file)
            .digest('hex')
            .toString()
            .toLowerCase();
        fs.exists(fspath.join(this.path, filename), exists => {
            if (!exists)
                fs.writeFile(fspath.join(this.path, filename), file, _=>{});
            this.data[name] = {
                file: filename,
                time: time,
                hot: 0
            };
            this.changed = true;
        });
    }
}

module.exports = {
    PicDB,
    UserDB
};
