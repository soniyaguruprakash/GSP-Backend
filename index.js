const express = require('express')
const cors = require('cors')
const mongodb = require('mongodb')
const mongoose = require('mongoose')
const path = require('path')
const fs = require('fs')
const multer = require('multer')
const ProductModel = require('./productModel')
//___________________________________________
const app = express()
const port = 5000;
app.use(cors())
app.use(express.json())
//_____________________
const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb+srv://guruprakashg:Indi123@cluster2.di7atx6.mongodb.net/',{})
        console.log('Database connected successfully')
    }catch(err){
        console.log(err)
        
    }
}
connectDB();
//___________________________________________

// Order sending and receiving

    // Order schema
const newOrder = mongoose.model(
    'Orders',new mongoose.Schema({
        name:String,            
        email:String,
        address:String,
        city:String,
        phoneNumber:Number,
        // product:String,
        // price:Number
    })
);
        //Receiving orders from client-side
app.post('/orderpage',async(req,res)=>{
   const orders = new newOrder(req.body)
   const savenewOrder = await orders.save();
   res.send(savenewOrder)
})

app.get('/orderstatus',async(req,res)=>{
    try{
        const orders=await newOrder.find()
        res.status(200).json(orders)
    }catch(err){
        res.status(400).json({message:err})
    }
})
//__________________________________________

// stoting images in multer

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
    }
});

const upload = multer({
    storage:storage
})
//_________________________________

app.post('/addproduct',upload.single('image'),(req,res)=>{

// console.log(req.body)
var obj = {
    title:req.body.title,
    price : req.body.price,
    desc :req.body.desc,
    image : {
        data: fs.readFileSync(path.join(__dirname+'/uploads/'+req.file.filename)),
        contentType:'image/png'
    }
}
ProductModel.create(obj)
    .then(result=>res.json(result))
    .catch(err=>console.log(err))

})

app.get('/getproducts',async(req,res)=>{

    const alldata = await ProductModel.find()
    res.json(alldata)
})




















//______________________________________________
app.listen(port,()=>{
    console.log('Server connected')
})
