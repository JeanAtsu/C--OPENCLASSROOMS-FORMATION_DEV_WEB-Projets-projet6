const express = require('express');
const mongoose = require('mongoose');

const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");

const app = express();   

//database
mongoose.connect('mongodb+srv://JeanAtsu:Oss117_01234@jeanatsu.ccc0yk8.mongodb.net/?retryWrites=true&w=majority',
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

app.use(express.json()); //Pour exposer le body des requêtes
app.use('/api/sauce', sauceRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;