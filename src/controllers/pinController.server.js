'use strict'

const path = process.cwd()
const Users = require(path + '/src/models/users.js').User
const Pins = require(path + '/src/models/pins.js')

class Pin {
  static addPin(req, res) {
    Users.findOne({'twitter.id': req.user.twitter.id}).exec()
    .then(function (u) {
      let newPin = new Pins({
        imgUrl: req.body.imgUrl,
        title: req.body.title,
        pageUrl: req.body.pageUrl,
        user: u._id
      })
      return newPin.save()
    })
    .then(function (u) {
      return res.status(201).json({redirect: '/'})
    })
    .catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }

  static getMyPins(req, res) {
    Users.findOne({'twitter.id': req.user.twitter.id}).exec()
    .then(function (u) {
      return Pins.find({'user': u._id}).exec()
    })
    .then(function (ps) {
      return res.json(ps)
    })
    .catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }

  static deletePin(req, res) {
    Users.findOne({'twitter.id': req.user.twitter.id}).exec()
    .then(function (u) {
      return Pins.remove({_id: req.body._id, 'user': u._id}).exec()
    })
    .then(function (p) {
      return res.status(200).json({redirect: '/my-pins'})
    })
    .catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }
  static getPins(req, res) {
    Pins.find({}, {}, {sort: {'created_at' : -1}})
    .populate('user').exec()
    .then(function(ps) {
      return res.status(200).json(ps)
    }).catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }
  static getUserPins(req, res) {
    Users.findOne({'twitter.id': req.params.id}).exec()
    .then(function (u) {
      return Pins.find({user: u._id}, {}, {sort: {'created_at' : -1}})
      .populate('user').exec()
    })
    .then(function(ps) {
      return res.status(200).json(ps)
    }).catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }

}

module.exports = Pin
