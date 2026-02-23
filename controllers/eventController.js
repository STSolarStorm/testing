const {Event} = require('../models')

module.exports.createEvent = async function (req, res){
    let clubId = req.params.clubId
    await Event.create({
        eventtitle: req.body.eventtitle,
        eventdescription: req.body.eventdescription,
        eventdate: req.body.eventdate,
        eventstart: req.body.eventstart,
        eventend: req.body.eventend,
        club_id: clubId
    });
    res.redirect(`/clubs/${clubId}`)
}

