const {Club, Officer, ClubEvent, News, UserClub, User} = require('../models');
const {Op} = require("sequelize");


module.exports.renderAddClubForm = function(req, res){
    const club = {
        clubname: '',
        advisorfirstname: '',
        advisorlastname: '',
        meetingdate: '',
        clubroomnumber: '',
        category: '',
        clublogo: '',
        smalldescription: '',
        bigdescription: '',
        uniquedescription: '',
        commitment: '',
        secondadvisorfirstname: '',
        secondadvisorlastname: '',
        clubinstagram: '',
        clubbanner: '',
    };
    res.render('clubs/addClub', {club});
};

module.exports.addClub = async function(req, res){
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
            uniquedescription: req.body.uniquedescription,
            commitment: req.body.commitment,
            clublogo: req.body.clublogo,
            clubbanner: req.body.clubbanner,
            bigdescription: req.body.bigdescription,
            clubinstagram: req.body.clubinstagram,
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

        res.render('clubs/addClub',{
            title: 'Create New Club',
            error: 'Failed to create club: ' + error.message,
            club: req.body // Send back the form data so user doesn't lose it
        });
    }
};

module.exports.displayClub = async function(req, res, next) {
    try {
        const club = await Club.findByPk(req.params.clubId, {
            include: [
                { model: Officer, required: false},
                {model: ClubEvent, as: 'clubevents'},
                {model: News, as: 'clubnews'},
                {model: User, as: 'users'}
            ],
            order: [
                ['clubnews', 'news_on', 'desc'],
                ['clubevents', 'eventdate', 'desc']
            ],
        });

        if (!club) {
            return res.status(404).render('error', {
                message: 'Club not found',
                error: { status: 404, stack: '' }
            });
        }

        // Format officers with their images
        let officersList = [];
        if (club.Officers && club.Officers.length > 0) {
            officersList = club.Officers.map(o => ({
                id: o.id,
                name: `${o.officerfirstname} ${o.officerlastname}`,
                title: o.officertitle,
                image: o.officerimage || 'https://static.vecteezy.com/system/resources/thumbnails/020/911/740/small/user-profile-icon-profile-avatar-user-icon-male-icon-face-icon-profile-icon-free-png.png', // Default image
                grade: o.officergradelevel
            }));
        }

        let isMember = false;
        if (req.user && club.users) {
            isMember = club.users.some(u => u.id === req.user.id)
        }

        // Convert to plain object to ensure associations are accessible
        const clubPlain = club.get({ plain: true });


        const formattedClub = {
            id: clubPlain.id,
            name: clubPlain.clubname,
            meeting: clubPlain.meetingdate,
            location: clubPlain.clubroomnumber,
            shortDesc: clubPlain.smalldescription,
            bigDesc: clubPlain.bigdescription,
            commitment: clubPlain.commitment,
            uniqueDesc: clubPlain.uniquedescription,
            advisor: `${clubPlain.advisorfirstname || ''} ${clubPlain.advisorlastname || ''}`.trim(),
            secondAdvisor: clubPlain.secondadvisorfirstname ?
                `${clubPlain.secondadvisorfirstname} ${clubPlain.secondadvisorlastname || ''}`.trim() : null,
            officers: officersList,
            banner: clubPlain.clubbanner,
            logo: clubPlain.clublogo,
            category: clubPlain.category,
            clubevents: clubPlain.clubevents || [],
            clubnews: clubPlain.clubnews || [],
            clubinstagram: club.clubinstagram,
        };

        res.render('clubs/club', {
            title: club.clubname,
            club: formattedClub,
            isMember: isMember
        });
    } catch (error) {
        console.error('Error fetching club:', error);
        next(error);
    }
};

module.exports.renderEditClub = async function(req, res) {

        const club = await Club.findByPk(req.params.clubId);
        if (!club) return res.status(404).send('Club not found');
        res.render('clubs/editClub', {title: 'Edit Club', club});
};

module.exports.updateClub = async function(req, res) {
    try {
        await Club.update({
            clubname: req.body.clubname,
            advisorfirstname: req.body.advisorfirstname,
            advisorlastname: req.body.advisorlastname,
            secondadvisorfirstname: req.body.secondadvisorfirstname,
            secondadvisorlastname: req.body.secondadvisorlastname,
            meetingdate: req.body.meetingdate,
            clubroomnumber: req.body.clubroomnumber,
            category: req.body.category,
            smalldescription: req.body.smalldescription,
            bigdescription: req.body.bigdescription,
            uniquedescription: req.body.uniquedescription,
            commitment: req.body.commitment,
            clubinstagram: req.body.clubinstagram,
            clublogo: req.body.clublogo,
            clubbanner: req.body.clubbanner,
        }, {
            where: { id: req.params.id }
        });
        res.redirect('/clubs/' + req.params.id);
    } catch (error) {
        console.error('Error updating club:', error);
        res.send('Error updating club');
    }
}

module.exports.deleteClub = async function(req, res) {
    try {
        await Club.destroy({ where: { id: req.params.clubId } });
        res.redirect('/');
    } catch (error) {
        console.error('Error deleting club:', error);
        res.send('Error deleting club');
    }
}

module.exports.displayAll = async function(req, res, next) {
    try {
        const clubs = await Club.findAll();

        const formattedClubs = clubs.map(club => ({
            id: club.id,
            name: club.clubname,
            meeting: club.meetingdate,
            location: club.clubroomnumber,
            shortDesc: club.smalldescription,
            bigDesc: club.bigdescription,
            commitment: club.commitment,
            uniqueDesc: club.uniquedescription,
            advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
            officers: 'See details page',
            banner: club.clubbanner,
            logo: club.clublogo,
            category: club.category
        }));

        res.render('clubs/viewAll', {
            title: 'Edison High School Clubs',
            clubs: formattedClubs
        });
    } catch (error) {
        console.error('Error fetching clubs:', error);
        next(error);
    }
};


//Searching for clubs on the viewAll page
module.exports.search = async function(req, res) {
    try {
        const query = req.query.q;
        const clubs = await Club.findAll({
            where: {
                [Op.or]: [
                    { clubname: { [Op.iLike]: `%${query}%` } },
                    { category: { [Op.iLike]: `%${query}%` } },
                    { commitment: { [Op.iLike]: `%${query}%` } },
                    { advisorlastname: { [Op.iLike]: `%${query}%` } }
                ]
            }
        });

        res.render('clubs/viewAll', {
            title: 'Search Results',
            clubs: clubs.map(club => ({
                id: club.id,
                name: club.clubname,
                meeting: club.meetingdate,
                location: club.clubroomnumber,
                shortDesc: club.smalldescription,
                commitment: club.commitment,
                uniqueDesc: club.uniquedescription,
                advisor: `${club.advisorfirstname || ''} ${club.advisorlastname || ''}`.trim(),
                officers: 'See details page',
                banner: club.clubbanner || '/images/placeholder.jpg',
                logo: club.clublogo || '/images/placeholder.jpg',
                category: club.category,
                bigDesc: club.bigdescription,
                clubinstagram: club.clubinstagram,
            })),
            searchQuery: query
        });
    } catch (error) {
        console.error('Search error:', error);
        res.redirect('/');
    }
};



// Remove an Officer from their club (Should no longer show their card on the respective club page)
module.exports.removeOfficerFromClub = async function(req, res) {
    let clubId = req.params.clubId;
    let officerId = req.params.officerId;
    await Officer.destroy({
        where: {
            id: officerId
        }
    });
    res.redirect(`/clubs/${clubId}`);
};


module.exports.joinClub = async function(req, res) {

    const clubId = req.params.clubId;
    const userId = req.user.id;



    await UserClub.create({
        user_id: userId,
        club_id: clubId
    });
    res.redirect(`/clubs/${clubId}`);
};

module.exports.leaveClub = async function(req, res) {
    const { clubId, userId } = req.params;

    await UserClub.destroy({
        where: {
            club_id: clubId,
            user_id: userId,
        }
    });
    res.redirect(`/clubs/${clubId}`);
}
