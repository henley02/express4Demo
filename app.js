const express = require('express');
const path = require('path');
const app = express();

const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const connectMongo = require('connect-mongo')(session);

app.set('views', path.join(__dirname, 'views'));//
app.set('view engine', 'ejs');//设置模板引擎
app.use(express.static(path.join(__dirname, 'public')));//设置静态资源
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser('1231321'));

app.use(session({
    secret: '1231afasdf',//签名
    name: 'lisi',// key 的名字 默认是connect.sid
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false},//secure :true 只有https的时候才可以访问，
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
    if (req.session.userInfo) {
        res.send("你好" + req.session.userInfo)
    } else {
        res.send("未登录")
    }
});

app.get('/detail/:id', function (req, res) {
    let id = req.param('id');
    res.send('Hello id!' + id);
});

app.get('/loginOut', function (req, res) {
    // req.session.cookie.maxAge = 0;
    req.session.destroy(function (err) {
        cosole.log(err);
    })
    res.send("退出成功")
})
app.get('/login', function (req, res) {
    res.cookie("token", 'henley', {maxAge: 60 * 1000, signed: true});
    console.log(req.signedCookies);
    req.session.userInfo = "zhagnsan";
    res.render('login', {
        title: '登录',
        cookie1: req.signedCookies.token
    })
})
app.get('/product', function (req, res) {
    res.send('商品列表')
})
app.get('/productAdd', function (req, res) {
    res.send('添加商品')
})
app.get('/productEdit', function (req, res) {
    res.send('编辑商品列表')
})

app.post('/doLogin', function (req, res) {
    console.log(req.body);
})

app.use(function (req, res) {
    res.status(404).send('这个是404 路由没有匹配到');
});

app.listen(3000, '127.0.0.1');
