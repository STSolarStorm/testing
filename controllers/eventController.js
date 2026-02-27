const {ClubEvent} = require('../models')

module.exports.createEvent = async function (req, res){
    let clubId = req.params.clubId;
    await ClubEvent.create({
        eventtitle: req.body.eventtitle,
        eventdescription: req.body.eventdescription,
        eventdate: req.body.eventdate,
        eventstart: req.body.eventstart,
        eventend: req.body.eventend,
        club_id: clubId
    });
    res.redirect(`/clubs/${clubId}`);
}

module.exports.deleteEvent = async function (req, res){
    await ClubEvent.destroy({
        where: {
            id: req.params.clubId
        }
    });
    res.redirect(`/clubs/${clubId}`);
}
