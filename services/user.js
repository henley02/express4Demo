const express = require('express');
app = express();
const MongoClient = require('mongodb').MongoClient;
const {DBUrl, DBName} = require('./config');
const router = express.Router();
const session = require('express-session');

router.post('/doLogin', function (req, res) {
    let params = req.body;
    if (params.username.trim() == '' || params.password.trim() == '') {
        res.json({msg: '用户名或者密码不能为空', code: -1, data: ''});
        return;
    }
    MongoClient.connect(DBUrl, {useNewUrlParser: true}, function (dbError, client) {
        if (dbError) {
            res.json({msg: '系统异常', code: -1, data: ''});
            return;
        }
        const db = client.db(DBName);
        const result = db.collection('user').find(params);
        result.toArray(function (err, data) {
            if (data.length === 0) {
                res.json({msg: '用户名不存在或者密码错误', code: -1, data: ''});
            } else {
                session.userInfo = data[0];
                res.json({msg: '登录成功', code: 1, data: ''});
            }
            client.close();
        });
    })
})


module.exports = router;