const express = require('express');
app = express();
const {find, insert, deleteOne, objectId, update} = require('./../modules/db');
const router = express.Router();
const multiparty = require('multiparty');//图片上传模块，既可以获取form表单的是数据，又可以实现上传图片

/**
 * 打开产品列表
 */
router.get('/list', function (req, res) {
    find('product', {}, function (error, data) {
        res.render('product/list', {
            title: '商品列表',
            list: data,
        })
    })
});

/**
 * 根据id删除产品
 */
router.get('/delete', function (req, res) {
    deleteOne('product', {_id: new objectId(req.query.id)}, function (error, data) {
        if (error) {
            console.log('删除数据失败');
            return;
        }
        res.redirect("/product/list");
    })
})

/**
 * 打开添加商品页面
 */
router.get('/add', function (req, res) {
    res.render('product/add', {title: '添加商品'});
})

/**
 * 执行添加商品
 */
router.post('/doAdd', function (req, res) {
    var form = new multiparty.Form();
    form.uploadDir = 'upload';//图片上传的地址
    form.parse(req, function (err, fields, files) {
        if (err) {
            console.log("数据保存失败", err);
            return;
        }
        let json = {
            title: fields.title[0],
            price: fields.price[0],
            fee: fields.fee[0],
            description: fields.description[0],
            pic: files.pic[0].path,
        }
        insert('product', json, function (error, data) {
            if (error) {
                console.log('插入数据失败', error);
                return;
            }
            res.redirect("/product/list");
        })
    });
})

/**
 * 根据id打开编辑商品页面
 */
router.get('/edit', function (req, res) {
    find('product', {_id: new objectId(req.query.id)}, function (error, data) {
        if (error) {
            console.log('查询数据失败', error);
            return;
        }
        res.render('product/edit', {title: '编辑商品', data: data[0]});
    })
})

/**
 * 执行编辑商品的操作
 */
router.post('/doEdit', function (req, res) {
        let form = new multiparty.Form();
        form.uploadDir = 'upload';//图片上传的地址

        form.parse(req, function (err, fields, files) {
            if (err) {
                console.log("数据保存失败", err);
                return;
            }
            let json = {
                title: fields.title[0],
                price: fields.price[0],
                fee: fields.fee[0],
                description: fields.description[0],
            }
            if (files.pic[0].originalFilename != '') {
                json.pic = files.pic[0].path;
            }
            update('product', {_id: new objectId(fields.id[0])}, json, function (error, data) {
                if (error) {
                    console.log('插入数据失败', error);
                    return;
                }
                res.redirect("/product/list");
            })
        });
    }
)

module.exports = router;