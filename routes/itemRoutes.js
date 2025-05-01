const express = require('express');
const controller = require('../controllers/itemController');
const { upload } = require('../middleware/fileUpload');
const {isGuest, isLoggedIn, isSeller} = require('../middleware/auth');
const{validateId, validateItem, validateResult} = require('../middleware/validator');
const offerRoutes = require('./offerRoutes');


const router = express.Router();

//GET /items: send all items to the user

router.get('/', controller.index);

//GET /items/new: send html form for creating a new item

router.get('/new', isLoggedIn, controller.new);

//GET /search: send details of item identified by title or description
router.get('/search', controller.search);

//POST /items: create a new item

router.post('/', upload, isLoggedIn, validateItem, validateResult, controller.create);

//GET /items/:id: send details of item identified by id
router.get('/:id', controller.show);

//GET /items/:id/edit: send html form for editing an existing item
router.get('/:id/edit', isSeller, controller.edit);

//PUT /items/:id: update the item identfied by id
router.put('/:id', upload, isSeller, validateItem, validateResult, controller.update);

//DELETE /items/:id: delete the item identified by id
router.delete('/:id', isSeller, controller.delete);

// Nest the offer routes under /items/:id/offers
router.use('/:id/offers', isLoggedIn, offerRoutes);


module.exports = router;