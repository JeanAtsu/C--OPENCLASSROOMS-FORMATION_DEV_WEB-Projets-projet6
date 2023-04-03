
const Sauce = require('../models/Sauce');

//Create sauce
exports.createSauce = (req, res, next) => {
    delete req.body._id;
    const sauce = new Sauce({
      ...req.body
    });
  sauce.save().then(
    () => {
      res.status(201).json({
        message: 'Objet enregistré!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Get sauce
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
  const sauce = new Sauce({
    ...req.body
  });
  Sauce.updateOne({_id: req.params.id}, sauce).then(
    () => {
      res.status(201).json({
        message: 'Objet modifié!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

//Delete sauce
exports.deleteSauce = (req, res, next) => {
    Sauce.deleteOne({_id: req.params.id}).then(
    () => {
      res.status(200).json({
        message: 'Objet supprimé!'
      });
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
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