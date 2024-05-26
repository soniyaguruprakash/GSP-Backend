const mongoose = require('mongoose')

const ProductSchema = new mongoose.Schema({
  title: String,
  price: Number,
  desc : String,
  image:{
    data:Buffer,
    contentType:String
  }
})
 
const ProductModel =mongoose.model("productdetails",ProductSchema)
module.exports = ProductModel;