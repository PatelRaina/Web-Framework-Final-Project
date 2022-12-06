/******************************************************************************
***
* ITE5315 – Project
* I declare that this assignment is my own work in accordance with Humber Academic Policy. 
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
* 
* Group member Name: Raina Patel, Mansi Patel
* Student IDs: N01452526, N01452525
* Date: December 5th, 2022
******************************************************************************
***/

var express = require('express');
var mongoose = require('mongoose');
var app = express();
var database = require('./config/database');
var bodyParser = require('body-parser'); 
const jwt=require('jsonwebtoken');
const verifytoken=require('./Authenticate');

var path = require('path');//include path module using require method
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
require('dotenv').config();


var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({ 'extended': 'true' }));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access')

app.engine('.hbs', expressHandlebars.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars), extname: '.hbs'
}));
app.set('view engine', '.hbs');

var Restaurant = require('./models/Restaurants');
DATABASE_USER = process.env.DATABASE_USER;
DATABASE_PASSWORD = process.env.DATABASE_PASSWORD;


const restaurantDb = new Restaurant("mongodb+srv://"+DATABASE_USER+":"+DATABASE_PASSWORD+"@cluster0.zggd4el.mongodb.net/sample_restaurants");

restaurantDb.initialize().then(()=>{
    app.listen(port, ()=>{
    console.log('Database Connected.....')
    console.log(`App listening to port:${port}`);
});
}).catch((err)=>{
        console.log(err);
});

app.post('/login', (req,res)=>{
    console.log(req.body)
    //Authenticated User
    const username = req.body.username
    const user = { name : username }
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN)
    res.json({ accessToken : accessToken})
})

app.get('/', function (req, res, next) {
    res.send("Project on NodeJS and Mongodb")
});

app.get('/api/restaurants', verifytoken,async function (req, res) {
            
    const borough = req.query.borough;
    const page = req.query.page;
    const perpage = req.query.perpage;
    
    let output = await restaurantDb.getrestaurant(page,perpage,borough);
    if(output){
        res.json({data:output});
    }
});


// search restaurant by id
app.get('/api/restaurants/:restaurant_id',verifytoken,async function (req, res) {
    let id = req.params.restaurant_id;
    console.log(id);

    restaurantDb.getRestaurantById(id).then(function (err, restaurant) {
        // checks for any error which searching
        if (err)
            res.send(err)
        // return all restaurant data in JSON format
        res.json(restaurant);
    });
});


// create a new restaurant data and then return all the reastaurant data
app.post('/api/restaurants',async function (req, res) {

    var data = {
        _id: mongoose.Types.ObjectId(req.body._id),
        restaurant_id: req.body.restaurant_id,
        name: req.body.name,
        cuisine: req.body.cuisine,
        borough: req.body.borough
    }
   

        // create a new record into collection
    restaurantDb.addrestaurant(data).then(function (err, restaurant) {
        if (err)
            res.send(err);
            console.log(data);
        // get and return all the restaurant data after newly created restaurant record
            return res.json(restaurant);
            
    
    });
});

// update the data by using id
app.put('/api/restaurants/:restaurant_id',verifytoken,async function (req, res) {
    // update an existing record into collection
    let id = req.params.restaurant_id;
    const data = {
        restaurant_id: req.body.restaurant_id,
        name: req.body.name,
        cuisine: req.body.cuisine,
        borough: req.body.borough
    }

   let result= restaurantDb.updateRestaurant(data,id);
   if(result)
   {
    
    res.status(200).send("Successfully updated restaurant "+id +"\n\n"+ result);
   }
   else
   {
    throw "Error";
   }
});


// delete the record using id
app.delete('/api/restaurants/:restaurant_id', verifytoken,async function (req, res) {
    let id = req.params.restaurant_id;
    restaurantDb.deleteRestaurant(id).then(function (err) {
        if (err)
            res.send(err);
        else
            res.send('Restaurant has been Deleted Successfully! ');
    });
});


//add new restaurant
app.get('/api/search', (req, res, next) => {
	res.render('search', { layout: false });
});


//search based on page, perpage and borough
app.post('/api/search',async (req, res, next) => {
	const borough = req.body.borough;
    const page = req.body.page;
    const perpage = req.body.perpage;
    
    let output = await restaurantDb.getrestaurant(page,perpage,borough);
    if(output){
        
        res.render('display',{data:output});
    }
});