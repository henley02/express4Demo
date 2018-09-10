const MongoClient = require('mongodb').MongoClient;
const {DBUrl, DBName} = require('./../services/config');
const objectId = require('mongodb').ObjectID;

function __connectDB(callback) {
    MongoClient.connect(DBUrl, {useNewUrlParser: true}, function (error, client) {
        if (error) {
            console.log("数据库连接失败");
            return;
        }
        callback(client);
    })
}

/**
 * 查找数据
 * @param collectionName 集合名（表名）
 * @param json 查找的条件
 * @param callback 回调函数
 */
exports.find = function (collectionName, json, callback) {
    __connectDB(function (client) {
        const db = client.db(DBName);
        let result = db.collection(collectionName).find(json);
        result.toArray(function (error, data) {
            callback(error, data);
            client.close();
        })
    })
}

/**
 * 增加数据
 * @param collectionName  集合名（表名）
 * @param json 插入的数据
 * @param callback 回调函数
 */
exports.insert = function (collectionName, json, callback) {
    __connectDB(function (client) {
        const db = client.db(DBName);
        db.collection(collectionName).insertOne(json, function (error, data) {
            callback(error, data);
            client.close();
        });
    })
}

/**
 * 更新数据
 * @param collectionName 集合名（表名）
 * @param conditionJson 查找条件
 * @param updateJson 更新值
 * @param callback 回调函数
 */
exports.update = function (collectionName, conditionJson, updateJson, callback) {
    __connectDB(function (client) {
        const db = client.db(DBName);
        db.collection(collectionName).updateOne(conditionJson, {$set: updateJson}, function (error, data) {
            callback(error, data);
            client.close();
        });
    })
}

/**
 * 删除数据
 * @param collectionName 集合名（表名）
 * @param json 条件
 * @param callback 回调函数
 */
exports.deleteOne = function (collectionName, json, callback) {
    __connectDB(function (client) {
        const db = client.db(DBName);
        db.collection(collectionName).deleteOne(json, function (error, data) {
            callback(error, data);
            client.close();
        });
    })
}

exports.objectId = objectId;