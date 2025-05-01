const Offer = require('../models/offer');
const Item = require('../models/item');

// POST /items/:id/offers
exports.create = (req, res, next) => {
    const itemId = req.params.id;
    const userId = req.session.user;
    if(!itemId.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid item id ' + itemId);
        err.status = 400;
        next(err);
    }

    Item.findById(itemId)
        .then(item => {
            const offer = new Offer({
                item: itemId,
                user: userId,
                amount: parseFloat(req.body.amount),
                status: 'pending'
            });

            offer.save()
            .then(() => {
                return Item.findByIdAndUpdate(itemId, {
                    $inc: { totalOffers: 1 },
                    $max: { highestOffer: offer.amount }
                });
            })
            .then(() => {
                res.redirect('/items/' + itemId);
            })
        })
        .catch(err => next(err));
};

// GET /items/:id/offers
exports.viewOffers = (req, res, next) => {
    const itemId = req.params.id;
    Offer.find({ item: itemId })
        .populate('user', 'firstName lastName')
        .sort({ amount: -1 })
        .then(offers => {
            res.render('./offer/offer', { offers, itemId });
        })
        .catch(err => next(err));
};


// PUT /items/:id/offers/:offerId/accept
exports.accept = (req, res, next) => {
    const offerId = req.params.offerId;
    const itemId = req.params.id;

    // Step 1: Reject all other offers for this item
    Offer.updateMany(
        {
            item: itemId,
            _id: { $ne: offerId }
        },
        { $set: { status: 'rejected' } }
    )
    .then(() => {
        // Step 2: Accept the selected offer
        return Offer.findByIdAndUpdate(offerId, { status: 'accepted' }, { new: true });
    })
    .then(offer => {
        if (!offer) {
            const err = new Error('Offer not found');
            err.status = 404;
            throw err;
        }

        // Step 3: Mark item as inactive
        return Item.findByIdAndUpdate(offer.item, { active: false })
            .then(() => {
                res.redirect('/items/' + itemId + '/offers');
            });
    })
    .catch(err => next(err));
};
