
const Sauce = require('../models/Sauce');
const fs = require('fs');

function checkSauceData(sauce)
{   
  
      let name = sauce.name.trim();
      let manufacturer = sauce.manufacturer.trim();
      let mainPepper = sauce.mainPepper.trim();
      let description = sauce.description.trim();

      let ret = true;
  
      //Name
      if (!name.length > 2)
      {
          ret = false;
      }
      //Manufacturer
      if (!manufacturer.length > 2)
      {
          ret = false;
      }
      //MainPepper
      if (!mainPepper.length > 2)
      {
          ret = false;
      }
      //Description
      if (!description.length > 2)
      {
          ret = false;
      }
      
      return ret;
}

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
  
  if (checkSauceData(sauce))
  {
      sauce.save()
      .then(() => { res.status(201).json({message: 'Objet enregistré !'})})
      .catch(error => { res.status(400).json( { error })})

  }
  else
  {
    res.status(400).json({ error });
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

          if (sauce.userId != req.auth.userId) {
            res.status(401).json({ message : 'Not authorized'});
          } else {
              if (checkSauceData(sauce))
              {
                  Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
                  .then(() => res.status(200).json({message : 'Objet modifié!'}))
                  .catch(error => res.status(401).json({ error }));
              }
              else
              {
                res.status(400).json({ error });
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
              res.status(401).json({message: 'Not autorisé'});
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
            switch(req.body.like) {

              case 1:
                // like
                Sauce.updateOne({_id : req.params.id}, {likes : sauce.likes + 1}, 
                  {usersLiked : sauce.usersLiked.push(req.params.userId)})
                            
                  .then(() => res.status(200).json({message : 'Liked!'}))
                  .catch(error => res.status(401).json({ error }));   
                break;
               
              case -1:
                // dislike
                Sauce.updateOne({_id : req.params.id}, {dislikes : sauce.dislikes +1},
                  {usersDisliked: sauce.usersDisliked.push(req.params.userId)})
                
                .then(() => res.status(200).json({message : 'Disliked!'}))
                .catch(error => res.status(401).json({ error }));    
                break;

              case 0:
                // No like
                Sauce.updateOne({_id : req.params.id},
                  {likes : sauce.likes -1},
                  {dislikes : sauce.dislikes -1}           
                 )
                .then(() => res.status(200).json({message : 'No like!'}))
                .catch(error => res.status(401).json({ error }));   
                break;
                
              default:
                break;
            }  
        }
    })
    .catch((error) => {
        res.status(400).json({ error });
    });
    
};


