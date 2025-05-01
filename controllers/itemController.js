const { request } = require('express');
const model = require('../models/item');
const { upload } = require('../middleware/fileUpload');
const Offer = require('../models/offer');

exports.index = (req, res, next)=>{
    let message = null;
    model.find()
    .sort({ price: 1 })
    .then(items=> res.render('./item/index', {items, message}))
    .catch(err=> next(err));
};

exports.search = (req, res, next) => {
    let query = req.query.query || '';

    model.find({
        $and: [
            { active: true },
            {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { details: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    })
    .sort({ price: 1 })
    .then(items => {
        let message = items.length === 0 ? 'No items match your search.' : null;
        res.render('./item/index', { items, message });
    })
    .catch(err => next(err));
};

exports.new = (req, res)=>{
    res.render('./item/new');
};

exports.create = (req, res, next)=>{
    let price = parseFloat(req.body.price); 
    let image = req.file ? '/images/' + req.file.filename : ''; 
    let itemData = {
        ...req.body, 
        price: price, 
        seller: req.session.user,
        image: image,  
    };
    console.log(itemData);
    let item = new model(itemData);
    console.log(item);
    console.log(item);
    item.save()
    .then(item => {
        res.redirect('/items')
    })
    .catch(err=>{
        if(err.name == 'ValidationError'){
            err.status = 400;
        }
        next(err);
    });};


    exports.show = (req, res, next)=>{
        let id = req.params.id;
        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error('Invalid item id ' + id);
            err.status = 400;
            next(err);
        }
        model.findById(id).populate('seller', 'firstName lastName')
        .then(item=>{
            if(item) {
                res.render('./item/show', {item});
            }
            else {
                let err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err=> next(err));
    };

    exports.edit = (req, res, next)=>{
        let id = req.params.id;
        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error('Invalid item id ' + id);
            err.status = 400;
            next(err);
        }
        model.findById(id)
        .then(item=>{
            if(item) {
                return res.render('./item/edit', {item});
            }
            else {
                let err = new Error('Cannot find a item with id ' + id);
                err.status = 404;
                next(err);
            }
        })
        .catch(err=> next(err));
    };

    exports.update = (req, res, next) => {
        let id = req.params.id;
    
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            let err = new Error('Invalid item id ' + id);
            err.status = 400;
            return next(err);
        }
    
        model.findById(id)
            .then(item => {
                if (!item) {
                    let err = new Error('Cannot find an item with id ' + id);
                    err.status = 404;
                    return next(err);
                }
    
                let price = parseFloat(req.body.price);
                let image = item.image;
    
                if (req.file) image = '/images/' + req.file.filename;
    
                let updatedItem = {
                    ...req.body,
                    price: price,
                    image: image
                };    
                return model.findByIdAndUpdate(id, updatedItem, { 
                    new: true, 
                    runValidators: true 
                });
            })
            .then(updatedItem => {
                if (updatedItem) {
                    res.redirect('/items/' + id);
                } else {
                    let err = new Error('Cannot update item with id ' + id);
                    err.status = 404;
                    next(err);
                }
            })
            .catch(err => {
                if (err.name === 'ValidationError') err.status = 400;
                next(err);
            });
    };
        

    exports.delete = (req, res, next)=>{
        let id = req.params.id;
        if(!id.match(/^[0-9a-fA-F]{24}$/)){
            let err = new Error('Invalid item id ' + id);
            err.status = 400;
            next(err);
        }
    
        model.findByIdAndDelete(id)
        .then(item => {
            if (!item) {
                const err = new Error('Cannot find an item with id ' + id);
                err.status = 404;
                throw err;
            }

            return Offer.deleteMany({ item: id });
        })
        .then(() => {
            res.redirect('/items');
        })
        .catch(err => next(err));
};

