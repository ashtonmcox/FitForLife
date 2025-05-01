const {validationResult} = require('express-validator');
const {body} = require('express-validator');

//check if an id is a valid object id
exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)) {
        let err = new Error('Invalid item id');
        err.status = 400;
        return next(err);
    }
    else{
        return next();
    }
}


exports.validateSignUp = [body('firstName', 'First name cannot be empty').notEmpty().trim().escape(),
body('lastName', 'Last name cannot be empty').notEmpty().trim().escape(),
body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateLogIn = [body('email', 'Email must be a valid email address').isEmail().trim().escape().normalizeEmail(),
body('password', 'Password must be at least 8 characters and at most 64 characters').isLength({min: 8, max: 64})];

exports.validateResult = (req, res, next)=>{
        let errors = validationResult(req);
        if(!errors.isEmpty()) {
            errors.array().forEach(error => {
                req.flash('error', error.msg);
            })
            return res.redirect('back');
        }else{
            return next();
        }
    };


exports.validateItem = [
    body('title', 'Title is required').notEmpty().trim().escape(),
    body('condition', 'Condition is required').notEmpty().isIn(['Like New', 'Great', 'Good', 'OK']).trim().escape(),
    body('price', 'Price must be a number greater than $0.01').isFloat({ min: 0.01 }),
    body('details', 'Details are required and must have at least 10 characters').trim().escape().isLength({ min: 10 }),
    body('image', 'Image URL is required')
];

exports.validateOffer = [
    body('amount', 'Amount must be a number greater than or equal to $0.01').trim().escape().isFloat({ min: 0.01 }),
    body('user', 'User ID is required').notEmpty().trim().escape(),
    body('item', 'Item ID is required').notEmpty().trim().escape(),
];

    