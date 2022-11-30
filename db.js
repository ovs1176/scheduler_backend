const mongoose = require('mongoose');
require("dotenv").config();
const mongoURL = process.env.DB_URL;

const connectToMongo = async()=>{
    // mongoose.connect(mongoURL, ()=>{
    //     console.log("Connected to MongoDB Successfully");
    // }).catch((err)=>{
    //     console.log(err);
    // })
    try {
        await mongoose.connect(mongoURL);
        console.log("Database connected successfully");
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectToMongo;