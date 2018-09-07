const express = require('express');
app = express();
const MongoClient = require('mongodb').MongoClient;
const {DBUrl, DBName} = require('./config');
const router = express.Router();

router.get('/list', function (req, res) {
    MongoClient.connect(DBUrl, {useNewUrlParser: true}, function (error, client) {
        if (error) {
            console.log(error);
            return;
        }
        const db = client.db(DBName);
        let result = db.collection('product').find();
        result.toArray(function (err, data) {
            res.render('product', {
                title: '商品列表',
                list: data,
            })
            client.close();
        })
    })
});

module.exports = router;