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


var mongoose = require('mongoose');
require('dotenv').config();
var Schema = mongoose.Schema;
//schema for restaurant
RestaurantSchema = new Schema({
    _id: mongoose.Types.ObjectId,
    address: [{ building: String, coord: Number, street: String, zipcode: String }],
    borough: String,
    cuisine: String,
    grades: [{ date: Date, grade: String, score: Number }],
    name: String,
    restaurant_id: String, 
});
module.exports = mongoose.model('Restaurants', RestaurantSchema);

//making restaurant class and constructor
module.exports = class Restaurant{
    constructor(connectionString,username,password){
        this.connectionString = connectionString;
        this.Restaurant = null;

    }
 
    //creating the connection with db
   initialize(){
        return new Promise((resolve,reject)=>{


           let db = mongoose.createConnection(this.connectionString,{ useNewUrlParser: true,useUnifiedTopology: true });

            db.on('error', ()=>{
                reject();
            });
            db.once('open', ()=>{
                this.Restaurant = db.model("restaurants", RestaurantSchema);
                resolve();
               
            });
        });
    }

    async addrestaurant(data){
        let newRestaurant = new this.Restaurant(data);
        await newRestaurant.save();
        return `Restaurant: ${newRestaurant._id}  added successfully`
    }

    getrestaurant(page, perPage, borough){ 
        let findBy = borough ? { borough } : {};

        if(+page && +perPage){
            return this.Restaurant.find(findBy).sort({restaurant_id: +1}).skip(page * +perPage).limit(+perPage).exec();
        }

        return Promise.reject(new Error('Error'));
    }

    getRestaurantById(id){
       return this.Restaurant.findOne({_id: id}).exec();
    }

    getAllRestaurantData()
    {
        return this.Restaurant.find().exec();
    }

    async updateRestaurant(data, id){
        await this.Restaurant.updateOne({_id: id}, { $set: data }).exec();
        return `restaurant ${id} successfully updated`;
    }

    async deleteRestaurant(id){
        await this.Restaurant.deleteOne({_id: id}).exec();
        return `restaurant ${id} successfully deleted`;
    }
}

