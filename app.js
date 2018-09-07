const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo')(session);
const {DBUrl, DBName} = require('./services/config');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');//设置模板引擎
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser(''));

const user = require('./services/user');
const product = require('./services/product');


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
        url: `${DBUrl}/${DBName}`,
        touchAfter: 24 * 3600,
    })
}))

//自定义中间件，判断用户登录情况
app.use(function (req, res, next) {
    if (req.url === '/login' || req.url === '/user/doLogin') {
        next();
    } else {
        if (req.session.userInfo && req.session.userInfo.username !== '') {
            //ejs 设置全局数据，所有的页面 都能看到
            app.locals['userInfo'] = req.session.userInfo;
            next();
        } else {
            res.redirect('/login');
        }
    }
})


app.get('/', function (req, res) {
    res.redirect('/product/list');
})


app.get('/login', function (req, res) {
    res.render('login', {
        title: '登录',
    })
})


app.get('/productEdit', function (req, res) {
    res.render('edit', {title: '编辑商品列表'});
})

app.use('/product', product);
app.use('/user', user);

app.use(function (req, res) {
    res.status(404).send('这个是404 路由没有匹配到');
});

app.listen(3000, '127.0.0.1');
