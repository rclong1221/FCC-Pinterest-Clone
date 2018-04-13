'use strict'

const path = process.cwd()
const Users = require(path + '/src/models/users.js').User
const Pins = require(path + '/src/models/pins.js')
const Likes = require(path + '/src/models/likes.js')
const escape = require('escape-html');

class Pin {
  static addPin(req, res) {
    Users.findOne({'twitter.id': req.user.twitter.id}).exec()
    .then(function (u) {
      let newPin = new Pins({
        imgUrl: req.body.imgUrl,
        title: escape(req.body.title),
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
    if (req.user) _getPinsAndMapLikes(req, res)
    else _getPins(req, res)
  }

  static getUserPins(req, res) {
    if (req.user) _getUserPinsAndMapLikes(req, res)
    else _getUserPins(req, res)
  }

}

function _getPins(req, res) {
  let pins
  Pins.find().sort({'createdAt': -1}).populate('user').lean().exec()
  .then(function (ps) {
    return res.status(200).json(ps)
  })
  .catch(function (err) {
    console.log(err)
    return res.sendStatus(500)
  })
}

function _getPinsAndMapLikes(req, res) {
  let pins, user
  Users.findOne({'twitter.id': req.user.twitter.id}).lean().exec()
  .then(function (u) {
    user = u
    return Pins.find().sort({'createdAt': -1}).populate('user').lean().exec()
  })
  .then(function (ps) {
    pins = ps
    let pids = pins.map((pin) => {
      return pin._id
    })
    return Likes.find({user: user, pin: {$in: pids}}).exec()
  })
  .then(function (ls) {
    pins.forEach((pin) => {
      pin['userLike'] = ls.find((like) => {
        return String(like.pin) === String(pin._id)
      })
    })
    return res.status(200).json(pins)
  })
  .catch(function (err) {
    console.log(err)
    return res.sendStatus(500)
  })
}

function _getUserPins(req, res) {
  Users.findOne({'twitter.id': req.params.id}).lean().exec()
  .then(function (u) {
    return Pins.find({user: u._id}).sort({'createdAt': -1}).populate('user').lean().exec()
  })
  .then(function(ps) {
    return res.status(200).json(ps)
  }).catch(function (err) {
    console.log(err)
    return res.sendStatus(500)
  })
}

function _getUserPinsAndMapLikes(req, res) {
  let targetUser, pins, user

  Users.findOne({'twitter.id': req.user.twitter.id}).lean().exec()
  .then(function (u) {
    user = u
    return Users.findOne({'twitter.id': req.params.id}).lean().exec()
  })
  .then(function (u) {
    targetUser = u
    return Pins.find({user: targetUser._id}).sort({'createdAt': -1}).populate('user').lean().exec()
  })
  .then(function (ps) {
    pins = ps
    let pids = pins.map((pin) => {
      return pin._id
    })
    return Likes.find({user: user, pin: {$in: pids}}).exec()
  })
  .then(function (ls) {
    pins.forEach((pin) => {
      pin['userLike'] = ls.find((like) => {
        return String(like.pin) === String(pin._id)
      })
    })
    return res.status(200).json(pins)
  })
  .catch(function (err) {
    console.log(err)
    return res.sendStatus(500)
  })
}

module.exports = Pin
