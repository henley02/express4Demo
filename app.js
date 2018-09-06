const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo')(session);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//设置模板引擎
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(''));

const user = require('./services/user');

app.use(session({
    secret: '1231afasdf',//签名
    name: 'express4Demo',// key 的名字 默认是connect.sid
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,//secure :true 只有https的时候才可以访问，
        maxAge: 1000 * 60 * 30
    },
    rolling: true,//在每次请求时强行设置 cookie，这将重置 cookie 过期时间（默认：false）

    store: new connectMongo({
        url: 'mongodb://127.0.0.1:27017/test',
        touchAfter: 24 * 3600,
    })
}))

app.use(function (req, res, next) {
    console.log('--------');
    console.log(new Date());
    next();
})

app.get('/', function (req, res) {
    res.redirect('/product');
})

app.get('/product', function (req, res) {
    res.render('product', {
        title: '商品列表',
    })
});

app.get('/loginOut', function (req, res) {
    req.session.destroy(function (err) {
        cosole.log(err);
    })
    res.send("退出成功")
})

app.get('/login', function (req, res) {
    res.render('login', {
        title: '登录',
    })
})

app.get('/productEdit', function (req, res) {
    res.render('edit', {title: '编辑商品列表'});
})

app.use('/user', user);

app.use(function (req, res) {
    res.status(404).send('这个是404 路由没有匹配到');
});

app.listen(3000, '127.0.0.1');
