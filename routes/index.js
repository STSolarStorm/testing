var express = require('express');
var router = express.Router();
const { Club, Officer } = require('../models');

// GET home page - shows all clubs from database
router.get('/', async function(req, res, next) {
  try {
    // Fetch all clubs from database
    const clubs = await Club.findAll();

    // Format clubs data for the template
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
    // Find club with its officers
    const club = await Club.findByPk(req.params.id, {
      include: [{
        model: Officer,
        required: false
      }]
    });

    if (!club) {
      return res.status(404).render('error', {
        message: 'Club not found',
        error: { status: 404, stack: '' }
      });
    }

    // Format officers
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

module.exports = router;