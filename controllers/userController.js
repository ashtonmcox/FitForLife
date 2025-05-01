const User = require('../models/user');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const Item = require('../models/item');
const Offer = require('../models/offer');


exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new User(req.body);
    console.log(user);
    user.save()
        .then(() => {
            console.log("User created successfully, redirecting to /users/login");
            res.redirect('/users/login'); // Corrected redirect
        })
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new'); // Corrected redirect
            }
            if (err.code === 11000) {
                req.flash('error', 'Email address already in use');
                return res.redirect('/users/new'); // Corrected redirect
            }
            next(err);
        });
};

exports.loginForm = (req, res) => {
    res.render('./user/login');
};

exports.login = (req, res, next) => {
    let { email, password } = req.body;
    User.findOne({ email })
        .then(user => {
            if (user) {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id; // Store user ID in session
                            req.flash('success', 'You have successfully logged in');
                            res.redirect('/users/profile'); // Corrected redirect
                        } else {
                            req.flash('error', 'Wrong password');
                            res.redirect('/users/login'); // Corrected redirect
                        }
                    });
            } else {
                req.flash('error', 'Wrong email address');
                res.redirect('/users/login'); // Corrected redirect
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([User.findById(id), Item.find({seller: id}),  Offer.find({ user: id}).populate('item')])
        .then(results => {
            const [user, items, offers] = results;
            res.render('./user/profile', {user, items, offers})
        }
        )
        .catch(err => next(err));
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) next(err);
        else res.redirect('/users/login'); 
    });
};
