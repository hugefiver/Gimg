function getRandomStringFunction(str) {
    let charSet = Array.from(new Set(str.split('')));
    let setLength = charSet.length;
    return function (length) {
        let r = new Array(length);
        for (let i = 0; i < length; i++) {
            r[i] = charSet[Math.floor(Math.random() * setLength)]
        }
        return r.join("");
    }
}

function deletePic(name, pics, users) {
    if (delete pics.data[name])
        pics.changed = true;

    let us = users.data;
    for (let k in us) {
        let index = us[k].pics.indexOf(name);
        if(index >= 0) {
            us[k].pics.splice(index, 1)
        }
    }
    users.changed = true;
}

module.exports = {
    getRandomStringFunction,
    deletePic
};
