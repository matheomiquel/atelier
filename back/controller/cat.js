const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {
    upload,
    dirname,
    twoCats,
    catById,
    limitsOffset,
    countCat,
    create,
    vote,
    remove
} = require('../services/cat.js')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));


app.get('/twoCats', async function (req, res) {
    const cat = await twoCats()
    if (!cat) {
        return res.json("il n'y a pas assez de chat pour faire la compétition").status(200)
    }
    res.json(cat).status(200)
})
app.get('/file/:id', async function (req, res) {
    const cat = await catById(req.params.id)
    console.log(cat)
    if (!cat) {
        return res.json("le chat n'a pas été trouver", 404)
    }
    res.sendFile(`${dirname}/${cat.path}`);
})

app.get('/readLimit/:offset/:limit', async function (req, res) {
    const cat = await limitsOffset(Number(req.params.offset), Number(req.params.limit))
    console.log(cat)
    res.json(cat);
})

app.get('/count', async function (req, res) {
    const cat = await countCat()
    res.json(cat);
})
app.post('/create', upload.single('avatar'), async function (req, res) {
    if (req.fileValidationError) {
        return res.json(req.fileValidationError).status(400)
    }
    const cat = await create(req.body.name, req.body.description, req.file.path);
    res.json({
        message: `Le chat ${cat.name} a bien été ajouté`,
        id: cat.id
    }, 201);
})
app.put('/vote/:id', async function (req, res) {
    const cat = await vote(req.params.id);
    if (!cat) {
        return res.json("Le chat n'a pas été trouvé", 404).status(404)
    }
    res.json(`le vote est maintenant à ${cat.vote}`).status(200)
})
app.delete('/delete/:id', async function (req, res) {
    const cat = await remove(Number(req.params.id));
    if (!cat) {
        return res.json("Le chat n'a pas été trouvé").status(404)
    }
    res.json("le chat à été supprimer")
})
module.exports = app;
