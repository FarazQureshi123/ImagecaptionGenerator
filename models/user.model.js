const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    username:{
        type:String,
        unique:true,
        required:true  
    },
    password:{
        type:String,
       
    }
})

const userModel = mongoose.model('user',Schema);


module.exports = userModel;