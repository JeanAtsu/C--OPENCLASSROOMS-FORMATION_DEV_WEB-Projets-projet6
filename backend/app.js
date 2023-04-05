const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require('path');

const dotenv = require('dotenv').config();

const app = express();   
app.use(express.json()); //expose le body


//DB Secure - dotenv
const uri = process.env.MONGO_URI;

mongoose.connect(uri,
{ useNewUrlParser: true,
  useUnifiedTopology: true })
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !')); 

//CORS (Cross origin)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

// Express secure - helmet
app.use(helmet());

module.exports = app;