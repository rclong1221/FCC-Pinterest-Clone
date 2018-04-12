'use strict'

const path = process.cwd()
const Pins = require(path + '/src/models/pins.js')
const Users = require(path + '/src/models/users.js').User
const Likes = require(path + '/src/models/likes.js')

class Like {
  static addOrModifyLike(req, res) {
    let user,
        pin
    Users.findOne({'twitter.id': req.user.twitter.id}).exec()
    .then(function (u) {
      user = u
      return Pins.findOne({_id: req.body.pid}).exec()
    })
    .then(function (p) {
      pin = p
      return Likes.findOne({pin: pin._id, user: user._id}).exec()
    })
    .then(function (l) {
      if(l) {
        l.status = (l.status) ? 0 : 1
        return l.save()
      } else {
        let newLike = new Likes({
          user: user,
          pin: pin,
          status: 1
        })
        return newLike.save()
      }
    })
    .then(function (nL) {
      return res.status(200).json(nL)
    })
    .catch(function (err) {
      console.log(err)
      return res.sendStatus(500)
    })
  }
}

module.exports = Like
