const express = require('express');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const fetch = require('node-fetch'); // Make sure you use fetch
const collection = require('./config');  // Your MongoDB collection
const router = express.Router();
const fs=require('fs')
const {spawn}=require('child_process')

// Middleware to ensure that the session is available
router.use(express.json());
router.use(bodyParser.json());

// Authentication middleware
function isAuthenticated(req, res, next) {
    if (req.session.isAuthenticated) {
        return next(); // Proceed if the user is authenticated
    }
    res.redirect('/login'); // Redirect to login if not authenticated
}

// Get routes
router.get('/', (req, res) => {
    res.render('signup');
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.get('/home', (req, res) => {
    if (!req.session.isAuthenticated) {
        return res.redirect('/login');  // Redirect if not logged in
    }
    res.render('home');
});

// Protect /home1 route with authentication
router.get('/home1', isAuthenticated, (req, res) => {
    res.render('home1');
});

router.get('/contact', isAuthenticated, (req, res) => {
    res.render('contact');
});

router.get('/home2', isAuthenticated, (req, res) => {
    res.render('home2');
});

// Sign-up route (creating new user)
router.post('/signup', async (req, res) => {
    const data = {
        name: req.body.username,
        password: req.body.password
    };

    try {
        // Check if the user already exists
        const existuser = await collection.findOne({ name: data.name });
        if (existuser) {
            return res.send(`Username ${data.name} already exists.`);
        }

        // Hash the password
        data.password = await bcrypt.hash(data.password, 10);

        // Insert the new user into the database (use insertOne for a single document)
        await collection.insertOne(data);
        console.log(`New user created: ${data.name}`);

        // Redirect the user to the login page after successful signup
        res.render('login');
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("Internal server error");
    }
});

// Login route (authenticate user)
router.post("/login", async (req, res) => {
    try {
        const check = await collection.findOne({ name: req.body.username });
        if (!check) {
            return res.send("Username not found.");
        }

        // Compare the hashed password
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (!isPasswordMatch) {
            return res.send("Wrong password.");
        }

        // On successful login, store the session data
        req.session.isAuthenticated = true;
        req.session.username = check.name;

        // Redirect the user to the home page
        res.redirect('/home');
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("Internal server error");
    }
});

// Logout route (destroy session)
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error during logout:", err);
            return res.status(500).send("Could not log out.");
        }
        res.redirect('/login');
    });
});

// Weather data route (after successful form submission)
    // Weather data route (after successful form submission)
router.post('/home', async (req, res) => {
    let crop='';
    const { nitrogen, phosphorus, potassium, soilPH, latitude, longitude } = req.body;
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    const apiKey = '41880f38e2150ecc104319d6cd0c85b2';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    try {
        // Fetch weather data
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        console.log("Weather Data:", data);
        
        // Extract temperature and humidity from the weather data
        const temp = data.main.temp; // Convert Kelvin to Celsius
        const humidity = data.main.humidity;

        // Prepare the input data for the Python script
        const reqData = [nitrogen, phosphorus, potassium, temp, humidity, soilPH];

        // Spawn the Python process
        const pythonProcess = spawn('python', ['./recommend/recommend.py']);

        // Write the input data to the Python script
        pythonProcess.stdin.write(JSON.stringify(reqData));
        pythonProcess.stdin.end();

        // Handle the output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            // Parse the result from the Python script
            const result = JSON.parse(data);
             crop=result.result
            console.log(`Result from Python: ${crop}`);
            // console.log(typeof(result.result));
            console.log(`Result from Python: ${crop}`);
            console.log(typeof(crop))
            // res.json( crop );
            // res.render('/home1')
        });

            // Send the result back to the client
            // res.json({ result: result.result });
        // });

        // Handle any errors in the Python process
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        pythonProcess.on('close', (code) => {
            if (code === 0) {
                console.log('Python script finished successfully');
            } else {
                console.error(`Python script exited with code ${code}`);
            }
            // res.json(data);
        });
        

    } catch (error) {
        console.error("Error fetching weather data:", error);
        res.status(500).send("Failed to fetch weather data.");
    }

   
});


module.exports = router;