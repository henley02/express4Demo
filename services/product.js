const express = require('express');
app = express();
const {find} = require('./../modules/db');
const router = express.Router();

router.get('/list', function (req, res) {
    find('product', {}, function (error, data) {
        res.render('product', {
            title: '商品列表',
            list: data,
        })
    })
});

module.exports = router;