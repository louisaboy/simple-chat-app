const User = require('../models/User');

exports.getUserById = (req, res) => {
    const userId = req.params.id;

    User.findById(userId)
        .then(user => {
            res.json(user);
        })
        .catch(err => {
            res.status(500).json({ error: err });
        })
}

exports.getUsers = (req, res) => {

    User.find()
        .then(users => {
            res.json(users);
        })
        .catch(err => {
            res.status(500).json({ error: err});
        })
}

exports.createUser = (req, res) => {
    User.create({
        username: req.body.username,
        password: req.body.password,
        picture: req.body.picture
    })
        .then((doc) => {
            console.log(doc);
        })
        .catch((err) => {
            console.log(err);
        })
}