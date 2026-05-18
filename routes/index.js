var express = require('express');
var router = express.Router();
const { Club, Officer, User } = require('../models');
const { Op } = require('sequelize');
const clubController = require('../controllers/clubController');
const eventController = require('../controllers/eventController');
const newsController = require('../controllers/newsController');
const userController = require('../controllers/userController');

// GET home page - shows all clubs from database
router.get('/', addUserToViews, function (req, res) {
  res.redirect('/clubs/');
})

router.get('/clubs/', addUserToViews, clubController.displayAll)


// GET club creation form

router.get('/club/add', addUserToViews, requireLogin, noStudent, noOfficer, teacherPermissions, adminPermissions, clubController.renderAddClubForm);

// POST new club - handles form submission
router.post('/club/add', addUserToViews, requireLogin, noStudent, noOfficer, teacherPermissions, adminPermissions, clubController.addClub);

// GET individual club page by ID
router.get('/clubs/:clubId(\\d+)', addUserToViews, clubController.displayClub)




// GET officer registration form
router.get('/registerofficer', requireLogin, addUserToViews, noStudent, noOfficer, teacherPermissions, adminPermissions, function(req, res) {
  res.render('users/register-officer', { title: 'Register Officer' });
});

// POST new officer
router.post('/officers', addUserToViews, noStudent, teacherPermissions, adminPermissions, async function(req, res) {
  try {
    await Officer.create({
      clubin: req.body.clubin,
      officerfirstname: req.body.officerfirstname,
      officerlastname: req.body.officerlastname,
      officertitle: req.body.officertitle,
      officerstudentid: req.body.officerstudentid,
      officergradelevel: req.body.officergradelevel,
      officerimage: req.body.officerimage || 'https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png',
    });
    res.redirect('/');
  } catch (error) {
    console.error('Error creating officer:', error);
    res.render('register-officer', {
      title: 'Register Officer',
      error: 'Failed to register officer: ' + error.message
    });
  }
});

// GET search clubs
router.get('/search', addUserToViews, clubController.search);


// GET edit club form
router.get('/clubs/:clubId/edit', addUserToViews, requireLogin, noStudent, officerPermissions, teacherPermissions, adminPermissions, clubController.renderEditClub);

// POST update club
router.post('/clubs/:id/edit', addUserToViews, noStudent, officerPermissions, teacherPermissions, adminPermissions, clubController.updateClub);


// POST delete club
router.post('/clubs/:clubId/delete', addUserToViews, noStudent, adminPermissions, clubController.deleteClub);


// POST new club event
router.post('/clubs/:clubId/event/create', addUserToViews, noStudent, eventController.createEvent);

// GET delete club event
router.get('/clubs/:clubId/event/delete/:eventId', addUserToViews, noStudent, eventController.deleteEvent);

// POST new club news
router.post('/clubs/:clubId/news/create', addUserToViews, noStudent, newsController.createNews);

//GET delete club news
router.get('/clubs/:clubId/news/delete/:newsId', addUserToViews, noStudent, newsController.deleteNews);

// GET remove officer from club
router.get('/clubs/:clubId/officer/delete/:officerId', addUserToViews, noStudent, clubController.removeOfficerFromClub);

//Register Users
router.get('/registeruser', addUserToViews, userController.renderRegisterUserForm);
router.post('/registeruser', addUserToViews, userController.registerUser);

//User Login and Logout
router.get('/login', addUserToViews, userController.renderLogin);
router.post('/login', addUserToViews, userController.login);
router.get('/logout', addUserToViews, userController.logout);

// User Profile Page and JOIN/LEAVE Clubs
router.get('/profile/:id(\\d+)', requireLogin, userController.viewUserProfile);
router.post('/clubs/:clubId/join/', requireLogin, clubController.joinClub);
router.get('/clubs/:clubId/leave/:userId', requireLogin, clubController.leaveClub);


// TEACHER/ADVISOR CLAIM/UNCLAIMING CLUBS (TEMPORARY: REMOVE AFTER ALL PREEXISTING CLUBS HAVE BEEN CLAIMED)
router.post('/clubs/:clubId/claim/', requireLogin, teacherPermissions, clubController.claimClub);
router.get('/clubs/:clubId/disclaim/:userId', requireLogin, teacherPermissions, clubController.disclaimClub);


// PERMISSIONS

function addUserToViews(req, res, next) {
  if (req.user){
    res.locals.user = req.user;
  }
  next();
}

function requireLogin(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
}

function adminPermissions(req, res, next) {
  if (!req.user.role === "admin") {
    return res.redirect('/');
  }
  next();
}

function teacherPermissions(req, res, next) {
  if (!req.user.role === "teacher") {
    return res.redirect('/');
  }
  next();
}

function officerPermissions(req, res, next) {
  if (!req.user.role === "officer") {
    return res.redirect('/');
  }
  next();
}

function noOfficer(req, res, next) {
  if (req.user.role === "officer") {
    return res.redirect('/');
  }
  next();
}

function noStudent(req, res, next) {
  if (req.user.role === "student") {
    return res.redirect('/');
  }
  next();
}

module.exports = router;