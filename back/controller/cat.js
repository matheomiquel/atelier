const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs')
const model = require('../models');
const catModel = model.cat
const multer = require('multer');
let dirname = __dirname.split('/').slice(0, -1).join('/')
const {
    Op
} = require("sequelize");
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'cat/')
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}.${file.mimetype.split('/')[1]}`) //Appending .jpg
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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
let idArray = [];

const getAllId = async function () {
    const catId = await catModel.findAll({
        attributes: ['id']
    });
    idArray = catId.map(id => id.id);
}
getAllId();

/**
 * @swagger
 * /api/justify:
 *  post:
 *    description: inscrit un utilisateur
 *    tags: [Justify]
 *    requestBody:
 *        required: true
 *        content:
 *            text/plain:
 *                schema:
 *                  type: string
 *    responses:
 *      '200':
 *        description: Renvoie le text envoyé au format justifié.
 *      '401':
 *        description: L'utilisateur n'est pas connecté.
 *      '402':
 *        description: L'utilisateur a dépassé sa limite journalière.
 */
function getRandomInt(max, expection) {
    const result = Math.floor(Math.random() * Math.floor(max));
    if (result === expection) {
        return getRandomInt(max, expection)
    }
    return result;
}
app.get('/twoCats', async function (req, res) {
    if (idArray.length < 2) {
        return res.json("il n'y a pas assez de chat pour faire la compétition").status(200)
    }
    const firstId = getRandomInt(idArray.length, -1)
    const secondId = getRandomInt(idArray.length, firstId)
    const cat = await catModel.findAll({
        where: {
            id: [idArray[firstId], idArray[secondId]]
        }
    });
    res.json(cat).status(200)
})
app.get('/file/:id', async function (req, res) {
    const cat = await catModel.findOne({
        where: {
            id: req.params.id
        },
        attributes: ["path"]
    });
    if (!cat) {
        return res.json("le chat n'a pas été trouver", 404)
    }
    res.sendFile(`${dirname}/${cat.path}`);
})

app.get('/readLimit/:offset/:limit', async function (req, res) {
    const limits = {
        offset: Number(req.params.offset),
        limit: Number(req.params.limit),
    }
    const cat = await catModel.findAll({
        ...limits
    });
    res.json(cat);
})

app.get('/count', async function (req, res) {
    const cat = await catModel.count();
    res.json(cat);
})
app.post('/create', upload.single('avatar'), async function (req, res) {
    console.log({
        body: req.body
    })
    if (req.fileValidationError) {
        return res.json(req.fileValidationError).status(400)
    }
    console.log(req.file)
    const data = {
        name: req.body.name,
        description: req.body.description,
        path: req.file.path,
        vote: 0,
    }
    const cat = await catModel.create(data);
    idArray.push(cat.id)
    res.json(`Le chat ${cat.name} a bien été ajouté`).status(201);
})
app.put('/vote/:id', async function (req, res) {
    const cat = await catModel.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!cat) {
        return res.json("Le chat n'a pas été trouvé", 404).status(404)
    }
    cat.update({
        vote: cat.vote + 1
    })
    res.json(`
                        le vote est maintenant à $ {
                            cat.vote
                        }
                        `).status(200)
})
app.delete('/delete/:id', async function (req, res) {
    const result = await catModel.findOne({
        where: {
            id: req.params.id
        }
    })
    if (!result) {
        return res.json("Le chat n'a pas été trouvé").status(404)
    }
    await catModel.destroy({
        where: {
            id: req.params.id
        }
    })
    const index = idArray.indexOf(Number(req.params.id));
    if (index > -1) {
        idArray.splice(index, 1);
    }
    fs.unlinkSync(`. / $ {
                            result.path
                        }
                        `)
    res.json("le chat à été supprimer")
})
module.exports = app;
