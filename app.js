const express = require('express');
const path = require('path');
const app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

console.log(new Date());
app.use(function (req, res, next) {
    console.log('--------');
    console.log(new Date());
    next();
})
app.get('/', function (req, res) {
    res.render('index', {
        title: '1231dfa',
        list: [1, 2, 3, 4, 5, 6, 7],
    });
});

app.get('/detail/:id', function (req, res) {
    let id = req.param('id');
    res.send('Hello id!' + id);
});

app.get('/product', function (req, res) {
    let params = req.query;
    console.log(params)
    res.send('product' + params.a);
})

app.listen(3000, '127.0.0.1');
