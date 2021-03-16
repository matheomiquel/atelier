const app = require('../app')
const assert = require("assert");
const chai = require('chai');
const expect = chai.expect;
const chaiHttp = require('chai-http');
let idCat = [];
const {
    sequelize
} = require('../models');
chai.use(chaiHttp);
chai.should();
describe('Renvoie une liste de chat en fonction de leur postion dans la base de donnée', function () {
    it("", (done) => {
        chai.request(app)
            .get('/api/readLimit/0/5')
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.be.an('array')
                done();
            });
    });
});

describe('Renvoie le nombre de chat dans la base de donnée', function () {
    it("", (done) => {
        chai.request(app)
            .get('/api/count')
            .end((err, res) => {
                res.should.have.status(200);
                expect(res.body).to.equal(0)
                done();
            });
    });
});

describe('Crée un chat', function () {
    it("", (done) => {
        chai.request(app)
            .post('/api/create')
            .field('name', 'toto')
            .field('description', 'je suis toto')
            .attach('avatar', 'test/garfield.jpg')
            .end((err, res) => {
                idCat.push(res.body.id);
                res.should.have.status(201);
                done();
            });
    });
});

describe('Crée un chat', function () {
    it("", (done) => {
        chai.request(app)
            .post('/api/create')
            .field('name', 'toto')
            .field('description', 'je suis toto')
            .attach('avatar', 'test/garfield.jpg')
            .end((err, res) => {
                idCat.push(res.body.id);
                res.should.have.status(201);
                done();
            });
    });
});
describe('Renvoie 2 chat aléatoirement', function () {
    it("", (done) => {
        chai.request(app)
            .get('/api/twoCats')
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe("Renvoie l'image d'un chat en fonctin de son identifiant", function () {
    it("", (done) => {
        chai.request(app)
            .get(`/api/file/${idCat[0]}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});

describe("ajoute 1 vote à un chat en fonction de l'identifiant", function () {
    it("", (done) => {
        chai.request(app)
            .put(`/api/vote/${idCat[0]}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });
    });
});
describe("Supprime un chat en fonction de l'identifiant", function () {
    it("", (done) => {
        chai.request(app)
            .delete(`/api/delete/${idCat[0]}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });

    });
    it("", (done) => {
        chai.request(app)
            .delete(`/api/delete/${idCat[1]}`)
            .end((err, res) => {
                res.should.have.status(200);
                done();
            });

    });
});
