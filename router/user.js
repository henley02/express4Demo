const express = require('express');
app = express();
const router = express.Router();
const md5 = require('md5-node');
const {find} = require('./../modules/db');

router.get('/loginOut', function (req, res) {
    //销毁session
    req.session.destroy(function (err) {
        console.log(err);
    })
    res.redirect("/login")
})

router.post('/doLogin', function (req, res) {
    let params = req.body;
    if (params.username.trim() == '' || params.password.trim() == '') {
        res.json({msg: '用户名或者密码不能为空', code: -1, data: ''});
        return;
    }
    params.password = md5(params.password);
    find('user', params, function (error, data) {
        if (error) {
            res.json({msg: error, code: -1, data: ''});
            return;
        }
        if (data.length === 0) {
            res.json({msg: '用户名不存在或者密码错误', code: -1, data: ''});
        } else {
            req.session.userInfo = data[0];
            res.json({msg: '登录成功', code: 1, data: ''});
        }
    })
})


module.exports = router;