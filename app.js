const express = require('express');
const path = require('path');
// const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

// const index = require('./routes/index');
// const users = require('./routes/users');

const app = express();

const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('./webpack.config');
// const expressMongoDb = require('express-mongo-db');
const MongoClient = require('mongodb').MongoClient;

app.use(webpackDevMiddleware(webpack(webpackConfig), {
    publicPath: '/public'
}));

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendfile('public/index.html', { root: __dirname });
});

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

let db;
// app.use(expressMongoDb('mongodb://localhost:27017/test'),(req,res)=>{
//   console.log(req.db);
// });

MongoClient.connect('mongodb://localhost:27017/test', function (err, database) {
    if (err) {
        return console.log(err);
    }
    db = database;
});
app.get('/movie', function (req, res) {
    db.collection('movie').find().toArray(function (err, docs) {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        }
        res.send(docs);
    })
});

app.get('/gettext', function (req, res) {
    res.send('My api useful text');
});

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// app.use('/', index);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
