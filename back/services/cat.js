const model = require('../models');
const catModel = model.cat
const fs = require('fs')
let dirname = __dirname.split('/').slice(0, -1).join('/')
const multer = require('multer');
let idArray = [];
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'cat/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`)
    }
})
const upload = multer({
    dest: 'cat/',
    preservePath: true,
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
            req.fileValidationError = "le format d'image n'est pas le bon, format accepter jpeg,png";
            return cb(null, false, new Error("le format d'image n'est pas le bon"));
        }
        cb(null, true);
    },
    storage: storage
})

function getRandomInt(max, expection) {
    const result = Math.floor(Math.random() * Math.floor(max));
    if (result === expection) {
        return getRandomInt(max, expection)
    }
    return result;
}

const getAllId = async function () {
    const catId = await catModel.findAll({
        attributes: ['id']
    });
    idArray = catId.map(id => id.id);
}
getAllId();

const twoCats = async function () {
    if (idArray.length < 2) {
        return undefined
    }
    const firstId = getRandomInt(idArray.length, -1)
    const secondId = getRandomInt(idArray.length, firstId)
    const cat = await catModel.findAll({
        where: {
            id: [idArray[firstId], idArray[secondId]]
        }
    });
    return cat;
}

const catById = async function (id) {
    const cat = await catModel.findOne({
        where: {
            id: id
        },
        attributes: ["path"]
    });
    return cat;
}

const limitsOffset = async function getCatsByLimitsAndOffset(offset, limit) {
    const limits = {
        offset: offset,
        limit: limit,
    }
    const cat = await catModel.findAll({
        ...limits
    });
    return cat;
}
const countCat = async function () {
    return await catModel.count();
}

const create = async function (name, description, path) {
    const data = {
        name: name,
        description: description,
        path: path,
        vote: 0,
    }
    const cat = await catModel.create(data);
    idArray.push(cat.id);
    return cat;
}

const vote = async function (id) {
    const cat = await catModel.findOne({
        where: {
            id: id
        }
    })
    if (!cat)
        return undefined
    cat.update({
        vote: cat.vote + 1
    })
    return cat;
}
const remove = async function (id) {
    const cat = await catModel.findOne({
        where: {
            id: id
        }
    })
    if (!cat)
        return undefined;
    await catModel.destroy({
        where: {
            id: id
        }
    })
    const index = idArray.indexOf(id);
    if (index > -1) {
        idArray.splice(index, 1);
    }
    fs.unlinkSync(`${dirname}/${cat.path}`)
    return;
}
module.exports = {
    upload,
    dirname,
    twoCats,
    catById,
    limitsOffset,
    countCat,
    create,
    vote,
    remove
}
