const express =require('express')
const path=require('path')
const bcrypt=require('bcrypt')
const collection=require('./config')
const Router=require('./router')
const session = require('express-session');


const app=express()

app.use(express.json());
// Static file
// app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));

app.set('view engine','ejs')

app.use(session({
    secret: 'your_secret_key', // Use a secure secret key
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }  // Set 'secure: true' if you're using HTTPS
}));

// Middleware to check if user is logged in
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.username = req.session.username;
    next();
});

app.use('',Router)

// app.get('/',(req,res)=>{
//     res.render('signup')
// })

// app.get('/login',(req,res)=>{
//     res.render('login')
// })

// app.post('/signup', async (req,res)=>{
//     const data={
//         name:req.body.username,
//         password:req.body.password
//     }

//     const existuser=await collection.findOne({name:data.name})
//     if(existuser)
//     {
//         res.send(`Username ${existuser} already exist`)
//     }
//     else{
//         data.password=await bcrypt.hash(data.password,10);
//         const userdata=await collection.insertMany(data);
//         res.render('login')
//         console.log(userdata);
        
//     }
// })

// app.post("/login", async (req, res) => {
//     // try {
//         const check = await collection.findOne({ name: req.body.username });
//         if (!check) {
//             res.send("User name cannot found")
//         }
//         // Compare the hashed password from the database with the plaintext password
//         const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
//         if (!isPasswordMatch) {
//             res.send("wrong Password");
//         }
//         else {
//             res.render("home");
//         }
//     // }
//     // catch {
//     //     res.send("wrong Details");
//     // }
// });

app.listen(8080,()=>{
    console.log(`Running on server 8080`);
    
})