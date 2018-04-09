'use strict'

const path = process.cwd()
const mongoose = require('mongoose')
const Schema = mongoose.Schema

var Pin = new Schema({
  imgUrl: String,
  title: String,
  pageUrl: String,
  user: {type: Schema.Types.ObjectId, ref: 'User'}
}, {timestamps: true})

module.exports = mongoose.model('Pin', Pin)
