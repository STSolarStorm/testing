var express = require('express');
var router = express.Router();
const { Club, Officer } = require('../models');
const { Op } = require('sequelize');
const eventController = require('../controllers/eventController');

// GET home page - shows all clubs from database
router.get('/', async function(req, res, next) {
  try {
    const clubs = await Club.findAll();

    const formattedClubs = clubs.map(club => ({
      id: club.id,
      name: club.clubname,
      meeting: club.meetingdate,
      location: club.clubroomnumber,
      shortDesc: club.smalldescription,
      commitment: 'TBD',
      advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
      officers: 'See details page',
      banner: club.clublogo || '/images/placeholder-banner.png',
      logo: club.clublogo || '/images/placeholder-logo.png',
      category: club.category
    }));

    res.render('index', {
      title: 'Edison High School Clubs',
      clubs: formattedClubs
    });
  } catch (error) {
    console.error('Error fetching clubs:', error);
    next(error);
  }
});

// GET individual club page by ID
router.get('/clubs/:id', async function(req, res, next) {
  try {
    const club = await Club.findByPk(req.params.id, {
      include: [{ model: Officer, required: false }]
    });

    if (!club) {
      return res.status(404).render('error', {
        message: 'Club not found',
        error: { status: 404, stack: '' }
      });
    }

    const officersList = club.Officers && club.Officers.length > 0
        ? club.Officers.map(o => `${o.officertitle}: ${o.officerfirstname} ${o.officerlastname}`).join(', ')
        : 'No officers listed';

    const formattedClub = {
      id: club.id,
      name: club.clubname,
      meeting: club.meetingdate,
      location: club.clubroomnumber,
      shortDesc: club.smalldescription,
      commitment: 'TBD',
      advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
      secondAdvisor: club.secondadvisorfirstname ?
          `${club.secondadvisorfirstname} ${club.secondadvisorlastname || ''}`.trim() : null,
      officers: officersList,
      banner: club.clublogo || '/images/placeholder-banner.png',
      logo: club.clublogo || '/images/placeholder-logo.png',
      category: club.category
    };

    res.render('club', {
      title: club.clubname,
      club: formattedClub
    });
  } catch (error) {
    console.error('Error fetching club:', error);
    next(error);
  }
});

// SHINE'S FORM ROUTES

// GET club creation form


router.get('/clubcreate', function(req, res) {
  res.render('mixins/clubCreationForm', { title: 'Create New Club' });
})

// POST new club - handles form submission
router.post('/clubs', async function(req, res) {
  try {
    console.log('Form data received:', req.body); // Debug: see what data is coming in

    const newClub = await Club.create({
      clubname: req.body.clubname,
      advisorfirstname: req.body.advisorfirstname,
      advisorlastname: req.body.advisorlastname,
      meetingdate: req.body.meetingdate,
      clubroomnumber: req.body.clubroomnumber,
      category: req.body.category,
      smalldescription: req.body.smalldescription,
      clublogo: req.body.clublogo || 'placeholder.jpg'
    });

    console.log('Club created successfully:', newClub.id); // Debug: success
    res.redirect('/clubs/' + newClub.id);
  } catch (error) {
    console.error('FULL ERROR:', error); // Debug: see full error object
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    if (error.errors) {
      console.error('Validation errors:', error.errors.map(e => e.message));
    }

    res.render('clubCreationForm', {
      title: 'Create New Club',
      error: 'Failed to create club: ' + error.message,
      formData: req.body // Send back the form data so user doesn't lose it
    });
  }
});

// GET officer registration form
router.get('/registerofficer', function(req, res) {
  res.render('register-officer', { title: 'Register Officer' });
});

// POST new officer
router.post('/officers', async function(req, res) {
  try {
    await Officer.create({
      officertitle: req.body.officertitle,
      officerfirstname: req.body.officerfirstname,
      officerlastname: req.body.officerlastname,
      clubin: req.body.clubin,
      officerstudentid: req.body.officerstudentid,
      officergradelevel: req.body.officergradelevel,
      officerusername: req.body.officerusername,
      officerpassword: req.body.officerpassword
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
router.get('/search', async function(req, res) {
  try {
    const query = req.query.q;
    const clubs = await Club.findAll({
      where: {
        [Op.or]: [
          { clubname: { [Op.iLike]: `%${query}%` } },
          { category: { [Op.iLike]: `%${query}%` } },
          { smalldescription: { [Op.iLike]: `%${query}%` } }
        ]
      }
    });

    res.render('index', {
      title: 'Search Results',
      clubs: clubs.map(club => ({
        id: club.id,
        name: club.clubname,
        meeting: club.meetingdate,
        location: club.clubroomnumber,
        shortDesc: club.smalldescription,
        commitment: 'TBD',
        advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
        officers: 'See details page',
        banner: club.clublogo || '/images/placeholder-banner.png',
        logo: club.clublogo || '/images/placeholder-logo.png',
        category: club.category
      })),
      searchQuery: query
    });
  } catch (error) {
    console.error('Search error:', error);
    res.redirect('/');
  }
});

// GET edit club form
router.get('/clubs/:id/edit', async function(req, res) {
  try {
    const club = await Club.findByPk(req.params.id);
    if (!club) return res.status(404).send('Club not found');
    res.render('club-edit', { title: 'Edit Club', club: club });
  } catch (error) {
    next(error);
  }
});

// POST update club
router.post('/clubs/:id/edit', async function(req, res) {
  try {
    await Club.update({
      clubname: req.body.clubname,
      advisorfirstname: req.body.advisorfirstname,
      advisorlastname: req.body.advisorlastname,
      meetingdate: req.body.meetingdate,
      clubroomnumber: req.body.clubroomnumber,
      category: req.body.category,
      smalldescription: req.body.smalldescription
    }, {
      where: { id: req.params.id }
    });
    res.redirect('/clubs/' + req.params.id);
  } catch (error) {
    console.error('Error updating club:', error);
    res.send('Error updating club');
  }
});

// POST delete club
router.post('/clubs/:id/delete', async function(req, res) {
  try {
    await Club.destroy({ where: { id: req.params.id } });
    res.redirect('/');
  } catch (error) {
    console.error('Error deleting club:', error);
    res.send('Error deleting club');
  }
});



module.exports = router;