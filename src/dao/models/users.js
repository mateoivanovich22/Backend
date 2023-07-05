const mongoose =require('mongoose') ;
const db = require("./db.js") ;
const collection = "users";
const Schema = mongoose.Schema;


const userSchema = mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    age: Number,
    password: String,
    role: String,
    cart: Schema.Types.ObjectId,
})

const UsersModel = db.model(collection, userSchema);

module.exports = UsersModel;