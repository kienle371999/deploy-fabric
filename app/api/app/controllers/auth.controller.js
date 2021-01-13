const config = require("../config/auth.config");
const db = require("../models").db;
const User = db.user;
const Role = db.role;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const fs = require("fs");
const path = require("path");

const signup = (req, res) => {
  const user = new User({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8),
  });

  user.save((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (req.body.roles) {
      Role.find(
        {
          name: { $in: req.body.roles },
        },
        (err, roles) => {
          if (err) {
            res.status(500).send({ message: err });
            return;
          }

          user.roles = roles.map((role) => role._id);
          user.save(async (err) => {
            if (err) {
              res.status(500).send({ message: err });
              return;
            }
            res.send({ message: "Success" });
          });
        }
      );
    }
  });
};

const signin = (req, res) => {
  User.findOne({
    email: req.body.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }

      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!",
        });
      }

      var token = jwt.sign(
        { id: user.id, email: user.email },
        config.tokenSecret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }

      res.set("Authorization", "Bearer " + token);
      res.status(200).send({
        token: token,
        user: {
          id: user._id,
          email: user.email,
          roles: authorities,
        },
      });
    });
};

/**
 * controller refreshToken
 * @param {*} req
 * @param {*} res
 */
const refreshToken = async (req, res) => {
  User.findOne({
    email: req.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      var token = jwt.sign(
        { id: req.userId, email: req.email },
        config.tokenSecret,
        {
          expiresIn: 86400, // 24 hours
        }
      );

      res.set("Authorization", "Bearer " + token);
      res.status(200).send();
    });
};

const getUser = async (req, res) => {
  User.findOne({
    email: req.email,
  })
    .populate("roles", "-__v")
    .exec((err, user) => {
      if (err) {
        res.status(500).send({ message: err });
        return;
      }
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
      var authorities = [];

      for (let i = 0; i < user.roles.length; i++) {
        authorities.push("ROLE_" + user.roles[i].name.toUpperCase());
      }
      res.status(200).send({
        id: user._id,
        email: user.email,
        roles: authorities,
      });
    });
};

module.exports = {
  signin: signin,
  signup: signup,
  refreshToken: refreshToken,
  getUser: getUser,
};
