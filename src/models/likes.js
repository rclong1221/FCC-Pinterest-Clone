'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Like = new Schema({
  user: {type: Schema.Types.ObjectId, ref: 'User'},
  pin: {type: Schema.Types.ObjectId, ref: 'Pin'},
  status: Number
}, {timestamps: true})

module.exports = mongoose.model('Like', Like)
