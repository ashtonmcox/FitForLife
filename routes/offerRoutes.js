const express = require('express');
const controller = require('../controllers/offerController');
const { isLoggedIn, isSeller, isNotSeller} = require('../middleware/auth');
const { validateOffer, validateResult} = require('../middleware/validator');

const router = express.Router({ mergeParams: true }); // Important to access :id from parent

// POST /items/:id/offers - Make an offer
router.post('/', isLoggedIn, isNotSeller, validateOffer, validateResult, controller.create);

// GET /items/:id/offers - View all offers on user's item
router.get('/', isLoggedIn, isSeller, controller.viewOffers);

// PUT /items/:id/offers/:offerId/accept - Accept an offer
router.put('/:offerId/accept', isLoggedIn, isSeller, validateOffer, validateResult, controller.accept);

module.exports = router;
