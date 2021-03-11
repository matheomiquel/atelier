const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const auth = require('./middleware/auth')
const strategy = auth.strategy;
const catController = require('./controller/cat')
const passport = require(`passport`);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(passport.initialize());
passport.use(strategy);

app.use('/api', catController)
app.listen(8000, function () {
    console.log(`Express is running on port 8000`);
});

module.exports = app
