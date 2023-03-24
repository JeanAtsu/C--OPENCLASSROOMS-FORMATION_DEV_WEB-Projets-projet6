
const Sauce = require('../models/Sauce');
const fs = require('fs');
const { userInfo } = require('os');



//Create sauce
exports.createSauce = (req, res, next) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id;
  delete sauceObject._userId;
  const sauce = new Sauce({
      ...sauceObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  });
  
  function checkSauceData(sauce)
  {
      //const regexName = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
      //const regexManufacturer = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
      //const regexDescription = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
      //const regexMainPepper = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;

      let ret = true;
    
      //email
      if (sauce.Name.trim() == '')
      {
          ret = false;
      }
      //Manufacturer
      if (!sauce.Manufacturer.trim() == '')
      {
          ret = false;
      }
      //Description
      if (sauce.Description.length <= 5)
      {
          ret = false;
      }
      //MainPepper
      if (!sauce.MainPepper.trim() == '')
      {
          ret = false;
      }

      return ret;
  }

  if (checkSauceData(sauce))
  {
      sauce.save()
      .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
      .catch(error => { res.status(400).json( { error })})
  }
};

//Get a sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
    _id: req.params.id
  }).then(
    (sauce) => {
      res.status(200).json(sauce);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modify sauce
exports.modifySauce = (req, res, next) => {
  const sauceObject = req.file ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body };

  delete sauceObject._userId;
  Sauce.findOne({_id: req.params.id})
      .then((sauce) => {

          function checkSauceData(sauce)
          {
              
              //const regexName = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
              //const regexManufacturer = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
              //const regexDescription = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
              //const regexMainPepper = /^(?=.{2,50}$)[A-Za-zÀ-ÖØ-öø-ÿ]+(?:['_.\-\s][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/gm;
        
              let ret = true;
            
              //email
              if (sauce.Name.trim() == '')
              {
                  ret = false;
              }
              //Manufacturer
              if (!sauce.Manufacturer.trim() == '')
              {
                  ret = false;
              }
              //Description
              if (sauce.Description.length <= 5)
              {
                  ret = false;
              }
              //MainPepper
              //if (!regexMainPepper.test(sauce.MainPepper))
              if (!sauce.MainPepper.trim() == '')
              {
                  ret = false;
              }
        
              return ret;
          }
    
          if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
          } else {
            if (checkSauceData(sauce) == true)
            {
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({message : 'Objet modifié!'}))
                .catch(error => res.status(401).json({ error }));
            }
          }           
      })
      .catch((error) => {
          res.status(400).json({ error });
      });
};

//Delete sauce
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id})
      .then(sauce => {
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = sauce.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Sauce.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
};

//Get all sauce
exports.getAllSauce = (req, res, next) => {
    Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Like
exports.like = (req, res, next) => {

    Sauce.findOne({_id: req.params.id})
    .then((sauce) => {
        if (sauce.userId == req.params.userId) 
        {
            res.status(401).json({ message : 'Not authorized'});  
        } 
        else 
        {        
            if (req.body.like === 0)
            { 
              Sauce.updateOne({_id : req.params.id}, 
                {likes : sauce.likes -1},{disLikes : sauce.disLikes -1})

              .then(() => res.status(200).json({message : 'No like!'}))
              .catch(error => res.status(401).json({ error }));   
            }
            if (req.body.like === 1)
            { 
              Sauce.updateOne({_id : req.params.id}, {likes : sauce.likes + 1}, 
              {usersLiked : sauce.usersLiked.push(req.params.userId)})
                         
              .then(() => res.status(200).json({message : 'Liked!'}))
              .catch(error => res.status(401).json({ error }));   
            }
            if (req.body.like === -1)
            { 
              Sauce.updateOne({_id : req.params.id}, {dislikes : sauce.dislikes + 1},
                {usersDisliked: sauce.usersDisliked.push(req.params.userId)})
              
              .then(() => res.status(200).json({message : 'Disliked!'}))
              .catch(error => res.status(401).json({ error }));   
            }
            
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
    
};


