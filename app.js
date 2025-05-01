//require modules
const express = require('express');
const morgan = require('morgan');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const itemRoutes = require('./routes/itemRoutes');
const userRoutes = require('./routes/userRoutes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');



//create app
const app = express();
//configure app
let port = 3000;
let host = 'localhost';
let url = 'mongodb://localhost:27017/project3';
app.set('view engine', 'ejs');
const mongUri = 'mongodb+srv://admin:admin123@cluster0.oavnn.mongodb.net/project5?retryWrites=true&w=majority&appName=Cluster0'

mongoose.connect(mongUri)
.then(() =>{
    //start the server
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err => console.log(err.message));

//mount middlware
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(morgan('tiny'));
app.use(methodOverride('_method'));

app.use(session({
    secret: 'alskdfj;asldkfja;sdflk', 
    resave: false,
    saveUninitialized: false,
    cookie:{maxAge: 60*60*1000},
    store: new MongoStore({mongoUrl: 'mongodb://127.0.0.1:27017/demos'})
}));

app.use(flash());

app.use((req, res, next)=>{
    res.locals.user = req.session.user||null;
    res.locals.successMessages = req.flash('success');
    res.locals.errorMessages = req.flash('error');
    next();
})

//set up routes
app.get('/', (req, res, next)=>{
    res.render('index');
});

app.use('/items', itemRoutes);
app.use('/users', userRoutes);


app.use((req, res, next) => {
    let err = new Error('The server cannot locate ' + req.url);
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    console.log(err.stack);
    if(!err.status){
        err.status = 500;
        err.message = "Internal Server Error";
    }

    res.locals.user = req.session?.user || null;
    res.locals.successMessages = [];
    res.locals.errorMessages = [];

    res.status(err.status);
    res.render('error', { error: err });
});

