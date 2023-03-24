
const Sauce = require('../models/Sauce');
const fs = require('fs');


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
  
  sauce.save()
  .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
  .catch(error => { res.status(400).json( { error })})
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
          if (sauce.userId != req.auth.userId) {
              res.status(401).json({ message : 'Not authorized'});
          } else {
              Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
              .then(() => res.status(200).json({message : 'Objet modifié!'}))
              .catch(error => res.status(401).json({ error }));
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
        if (sauce.userId == req.params._userId) 
        {
            res.status(401).json({ message : 'Not authorized'});
        } 
        else 
        {        
            if (req.body.like === 1)
            { 
              Sauce.updateOne({_id : req.params.id}, {likes : sauce.likes + 1}, 
              {usersLiked : sauce.usersLiked.push(req.params._userId)})
                         
              .then(() => res.status(200).json({message : 'Liked'}))
              .catch(error => res.status(401).json({ error }));   
            }
            if (req.body.like === -1)
            { 
              Sauce.updateOne({_id : req.params.id}, {dislikes : sauce.dislikes + 1},
                {usersDisliked: sauce.usersDisliked.push(req.params._userId)})
              
              .then(() => res.status(200).json({message : 'Disliked'}))
              .catch(error => res.status(401).json({ error }));   
            }
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
    
};


