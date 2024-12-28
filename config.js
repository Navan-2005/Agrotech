const mongoose=require('mongoose')
const connect=mongoose.connect('mongodb+srv://Navan:12345@agrotech.jwdis.mongodb.net/?retryWrites=true&w=majority&appName=Agrotech')

connect.then(()=>{
    console.log('Connected to Data Base');
    
})
.catch(()=>{
    console.log('Not connected to data base');
    
})
const loginschema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    }
})

const collection=new mongoose.model('agrousers',loginschema)
module.exports=collection;