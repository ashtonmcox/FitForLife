const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
    title: {type: String, required: [true, 'title is required']},
    seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    condition: {type: String, required: [true, 'condition is required']},
    price: {type: Number, required: [true, 'price is required'], min: [.01, 'price must be at least $0.01']},
    details: {type: String, required: [true, 'details are required'], minLength: [10, 'the details should have at least 10 characters']},
    image: {type: String, required: [true, 'image is required']},
    active: {type: Boolean, default: true},
    totalOffers: { type: Number, default: 0 },
    highestOffer: { type: Number, default: 0 }
});

module.exports = mongoose.model('Item', itemSchema);
