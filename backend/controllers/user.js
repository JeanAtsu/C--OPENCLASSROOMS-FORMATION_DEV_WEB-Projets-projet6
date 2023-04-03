
const User = require('../models/User');

//Create user
exports.createUser = (req, res, next) => {
    delete req.body._id;
    const user = new User({
      ...req.body
    });
  user.save().then(
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

//Get user
exports.getOneUser = (req, res, next) => {
    User.findOne({
    _id: req.params.id
  }).then(
    (user) => {
      res.status(200).json(user);
    }
  ).catch(
    (error) => {
      res.status(404).json({
        error: error
      });
    }
  );
};

//Modify user
exports.modifyUser = (req, res, next) => {
  const user = new User({
    ...req.body
  });
  User.updateOne({_id: req.params.id}, user).then(
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

//Delete user
exports.deleteUser = (req, res, next) => {
    User.deleteOne({_id: req.params.id}).then(
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

//Get all users
exports.getAllUser = (req, res, next) => {
    User.find().then(
    (users) => {
      res.status(200).json(users);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};