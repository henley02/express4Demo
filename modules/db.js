const MongoClient = require('mongodb').MongoClient;
const {DBUrl, DBName} = require('./../services/config');

function __connectDB(callback) {
    MongoClient.connect(DBUrl, {useNewUrlParser: true}, function (error, client) {
        if (error) {
            console.log("数据库连接失败");
            return;
        }
        callback(err, client);
    })
}

exports.find = function (collectionName, json, callback) {
    __connectDB(function (err, client) {
        const db = client.db(DBName);
        let result = db.collection(collectionName).find(json);
        result.toArray(function (err, data) {
            callback(err, data);
            client.close();
        })
    })
}