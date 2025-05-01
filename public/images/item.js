const { DateTime } = require("luxon");
const {v4: uuidv4} = require('uuid');

const items = [
    {
        id: '1',
        title: 'Treadmill',
        seller: 'Ashton Cox',
        condition: 'Good',
        price: 200.00,
        details: 'Very rarely used, taken great care of',
        image: '/images/treadmill.jpg',
        active: true
    },
    {
        id: '2',
        title: 'Benchpress',
        seller: 'Billy Bob',
        condition: 'Like New',
        price: 150.00,
        details: 'Great condition',
        image: '/images/benchpress.jpg',
        active: true
    },    
    {
        id: '3',
        title: 'Dumbbells',
        seller: 'Sam Bo',
        condition: 'OK',
        price: 25.00,
        details: 'Fairly used, but still a bargain',
        image: '/images/dumbbells.jpg',
        active: true
    },
    {
        id: '4',
        title: 'Elliptical',
        seller: 'Matt Mully',
        condition: 'Like New',
        price: 400.00,
        details: 'Very good condition',
        image: '/images/elliptical.jpg',
        active: true
    },
    {
        id: '5',
        title: 'Kettlebells',
        seller: 'Ashton Cox',
        condition: 'OK',
        price: 30.00,
        details: 'Used alot. Still work though',
        image: '/images/kettlebells.jpg',
        active: true
    },
    {
        id: '6',
        title: 'Rowing Machine',
        seller: 'Michael Jordan',
        condition: 'Good',
        price: 200.00,
        details: 'Very rarely used, taken great care of',
        image: '/images/rowingmachine.jpg',
        active: true
    }
];

exports.find = function(){
    items.sort((a, b) => a.price - b.price);
    return items;
};

exports.findByID = function(id){
    return items.find(item=>item.id === id);
};

exports.save = function(item, req){
    item.id = uuidv4();
    items.push(item);
};

exports.updateById = function(id, newitem){
    let item = items.find(item=>item.id === id);
    if(item){
        item.title = newitem.title;
        item.content = newitem.content;
        item.seller = newitem.seller;
        item.condition = newitem.condition;
        item.price = newitem.price;
        item.details = newitem.details;
        item.image = newitem.image;
        return true;
    }else{
        return false;
    }
};

exports.deleteByID = function(id){
    let index = items.findIndex(item => item.id === id);
    if(index !== -1){
        items.splice(index, 1);
        return true;
    }else{
        return false;
    }
};

exports.search = function(searchTerm){
    let filteredItems = items.filter(item => 
        item.active && 
        (item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.details.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    console.log(filteredItems.title);
    filteredItems.sort((a, b) => a.price - b.price);

    return filteredItems;

}