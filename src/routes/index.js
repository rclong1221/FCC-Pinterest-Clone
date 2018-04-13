'use strict'

const path = process.cwd()
const User = require(path + '/src/controllers/userController.server.js')
const Pin = require(path + '/src/controllers/pinController.server.js')
const Like = require(path + '/src/controllers/likeController.server.js')

module.exports = function (app, passport) {

	function isLoggedIn (req, res, next) {
		if (req.isAuthenticated()) {
			return next()
		} else {
			res.redirect('/login')
		}
	}

	function loggedIn (req) {
		return (req.isAuthenticated()) ? true : false
	}

	app.route('/')
		.get(function (req, res) {
			res.render('index', {loggedIn: loggedIn(req)})
		})

	app.route('/login')
		.get(function (req, res) {
			res.render('login', {loggedIn: loggedIn(req)})
		})

	app.route('/logout')
		.get(function (req, res) {
			req.logout()
			res.redirect('/')
		})

	app.route('/profile')
		.get(isLoggedIn, function (req, res) {
			res.render('profile', {loggedIn: loggedIn(req)})
		})

	app.route('/api/user/:id')
		.get(isLoggedIn, function (req, res) {
			res.json(req.user.twitter)
		})

	app.route('/api/account/:id')
		.get(isLoggedIn, User.getProfile)
		.post(isLoggedIn, User.updateProfile)

	app.route('/auth/twitter')
		.get(passport.authenticate('twitter'))

	app.route('/auth/twitter/callback')
		.get(passport.authenticate('twitter', {
			successRedirect: '/',
			failureRedirect: '/login'
		}))

	app.route('/add')
		.get(isLoggedIn, function (req, res) {
			res.render('add', {loggedIn: loggedIn(req)})
		})

	app.route('/api/pins')
		.get(Pin.getPins)
		.post(isLoggedIn, Pin.addPin)
		.delete(isLoggedIn, Pin.deletePin)

	app.route('/my-pins')
		.get(isLoggedIn, function(req, res) {
			res.render('my-pins', {loggedIn: loggedIn(req)})
		})

	app.route('/api/my-pins')
		.get(isLoggedIn, Pin.getMyPins)

	app.route('/user/:id')
		.get(function(req, res) {
			res.render('user', {loggedIn: loggedIn(req)})
		})

	app.route('/api/user/:id/pins')
		.get(Pin.getUserPins)

	app.route('/api/likes')
		.post(isLoggedIn, Like.addOrModifyLike)
}
