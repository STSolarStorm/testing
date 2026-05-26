var express = require('express');
var router = express.Router();
const { Club, Officer, User, TeacherClaim} = require('../models');
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
router.get('/club/add', addUserToViews, requireLogin, noStudent, staffPermissions, clubController.renderAddClubForm);

// POST new club - handles form submission
router.post('/club/add', addUserToViews, requireLogin, noStudent, staffPermissions, clubController.addClub);

// GET individual club page by ID
router.get('/clubs/:clubId(\\d+)', addUserToViews, clubController.displayClub)


// GET officer registration form
router.get('/registerofficer', requireLogin, addUserToViews, noStudent, staffPermissions, function(req, res) {
  res.render('users/register-officer', { title: 'Register Officer' });
});

// POST new officer
router.post('/officers', requireLogin, addUserToViews, noStudent, staffPermissions, async function(req, res) {
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
router.get('/clubs/:clubId/edit', requireLogin, canEditClub, clubController.renderEditClub);

// POST update club
router.post('/clubs/:id/edit', requireLogin, canEditClub, clubController.updateClub);


// POST delete club
router.post('/clubs/:clubId/delete', addUserToViews, requireLogin, noStudent, adminPermissions, clubController.deleteClub);


// POST new club event
router.post('/clubs/:clubId/event/create', addUserToViews, requireLogin, noStudent, eventController.createEvent);

// GET delete club event
router.get('/clubs/:clubId/event/delete/:eventId', addUserToViews, requireLogin, noStudent, eventController.deleteEvent);

// POST new club news
router.post('/clubs/:clubId/news/create', addUserToViews, requireLogin, noStudent, newsController.createNews);

//GET delete club news
router.get('/clubs/:clubId/news/delete/:newsId', addUserToViews, requireLogin, noStudent, newsController.deleteNews);

// GET remove officer from club
router.get('/clubs/:clubId/officer/delete/:officerId', addUserToViews, requireLogin, noStudent, clubController.removeOfficerFromClub);

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


//ADMIN APPROVAL Routers for Teachers
// View Dashboard
router.get('/admin/approvals', requireLogin, adminPermissions, addUserToViews, userController.renderPendingTeachers);

// Handle Actions
router.post('/admin/approve/:userId', requireLogin, adminPermissions, addUserToViews, userController.approveTeacher);
router.post('/admin/deny/:userId', requireLogin, adminPermissions, addUserToViews, userController.denyTeacher);


// TEACHER/ADVISOR CLAIM/UNCLAIMING CLUBS (TEMPORARY: REMOVE AFTER ALL PREEXISTING CLUBS HAVE BEEN CLAIMED)
router.post('/clubs/:clubId/claim', requireLogin, teacherPermissions, clubController.claimClub);
router.get('/clubs/:clubId/disclaim', requireLogin, teacherPermissions, clubController.disclaimClub);


async function canEditClub(req, res, next) {
  if (!req.user) {
    return res.redirect('/login');
  }

  // 1. Admins bypass all checks
  if (req.user.role === 'admin') {
    return next();
  }

  // 2. Safely capture the club ID and ensure it's treated as a clean string/number match
  const rawClubId = req.params.clubId || req.params.id;
  if (!rawClubId) {
    return res.redirect('/');
  }

  // 3. Teacher Check
  if (req.user.role === 'teacher') {
    try {
      const claim = await TeacherClaim.findOne({
        where: {
          club_id: rawClubId
        }
      });


      if (claim && Number(claim.teacher_id) === Number(req.user.id)) {
        return next();
      }
    } catch (err) {
      console.error("Database error in canEditClub verification:", err);
      return res.redirect('/');
    }
  }

  // 4. Officer Check
  if (req.user.role === 'officer' && req.user.clubin) {
    if (String(req.user.clubin) === String(rawClubId)) {
      return next();
    }
  }

  // If they don't match any criteria, send them home
  console.log(`Access Denied to user ${req.user.id} with role ${req.user.role} for club ${rawClubId}`);
  res.redirect('/');
}

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
  if (!(req.user && req.user.role === "admin")) {
    return res.redirect('/');
  }
  next();
}

function teacherPermissions(req, res, next) {
  if (!(req.user && req.user.role === "teacher")) {
    return res.redirect('/');
  }
  next();
}

function officerPermissions(req, res, next) {
  if (!(req.user && req.user.role === "officer")) {
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

function staffPermissions(req, res, next) {
  if (req.user && (req.user.role === "admin" || req.user.role === "teacher")) {
    return next();
  }
  console.log(`Access Denied: Role '${req.user ? req.user.role : 'guest'}' unauthorized for officer registration.`);
  res.redirect('/');
}

module.exports = router;