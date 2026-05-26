const {User} = require('../models');
const passport = require('passport');
const sha256 = require('sha256');


module.exports.renderRegisterUserForm = function(req, res){
    res.render('users/register-user', { title: 'Register User' });
}

module.exports.registerUser = async function(req, res){
    try {

        const existingUser = await User.findOne({
            where: { email: req.body.email }
        });

        if (existingUser) {
            return res.render('users/register-user', {
                title: 'Register User',
                error: 'Email already registered'
            });
        }

        const isTeacher = req.body.role === "teacher";

        await User.create({
            email: req.body.email,
            password: sha256(req.body.password),
            ufirstname: req.body.ufirstname,
            ulastname: req.body.ulastname,
            role: req.body.role,
            isapproved: !isTeacher
        });

        if (isTeacher){
            return res.render('users/login', {
                message: 'Teacher registration submitted! Await admin approval before user can log in.'
            })
        }

        res.redirect('/login');

    } catch (error) {
        console.error('Error creating user:', error);

        res.render('users/register-user', {
            title: 'Register User',
            error: 'Failed to register user: ' + error.message
        });
    }
}


module.exports.renderLogin = function(req, res){
    const messages = req.session.messages || [];
    req.session.messages = [];

    const infoMessage = req.query.message || null;

    res.render('users/login', {
        title: 'Login User',
        error: messages.length > 0 ? messages[messages.length - 1] : infoMessage
    });
};

module.exports.login = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages = [info && info.message ? info.message : 'Invalid email or password.'];
            return req.session.save(() => res.redirect('/login'));
        }

        const approvedStatus = user.isapproved !== undefined ? user.isapproved : user.isapproved;

        if (approvedStatus === false) {
            console.log("=== DEBUG: ACCESS BLOCKED BY ISAPPROVED GATE ===");
            req.session.messages = ['Your teacher account is still pending admin approval.'];
            return req.session.save(() => res.redirect('/login'));
        }

        req.logIn(user, function(err) {
            if (err) {
                return next(err);
            }
            return res.redirect('/');
        });
    })(req, res, next);
}


module.exports.logout = function (req, res, next) {
    req.logout(function(err) {
        if (err) { return next(err); }
        res.redirect('/login');
    });
}


module.exports.viewUserProfile = async function(req, res){
    if (req.params.id != req.user.id){
        return res.redirect(`/profile/${req.user.id}`);
    }

    const user = await User.findByPk(req.params.id, {
        include: 'clubs'
    });

    if (!user){
        return res.redirect('/');
    }

    res.render('users/userProfile', {user});
}


// Display all pending teachers (ADMIN)
module.exports.renderPendingTeachers = async function(req, res, next) {
    try {
        const pendingTeachers = await User.findAll({
            where: {
                role: 'teacher',
                isapproved: false
            },
            order: [['ulastname', 'ASC']]
        });

        res.render('users/pendingTeachers', {
            title: 'Pending Teacher Approvals',
            teachers: pendingTeachers
        });
    } catch (error) {
        console.error('Error fetching pending teachers:', error);
        next(error);
    }
};

// Approve a teacher application (ADMIN)
module.exports.approveTeacher = async function(req, res, next) {
    try {
        await User.update(
            { isapproved: true },
            { where: { id: req.params.userId } }
        );
        res.redirect('/admin/approvals');
    } catch (error) {
        console.error('Error approving teacher:', error);
        next(error);
    }
};

// Deny a teacher registration (ADMIN)
module.exports.denyTeacher = async function(req, res, next) {
    try {
        await User.destroy({
            where: {
                id: req.params.userId,
                isapproved: false // Safety parameter to prevent accidentally deleting approved accounts
            }
        });
        res.redirect('/admin/approvals');
    } catch (error) {
        console.error('Error denying teacher account:', error);
        next(error);
    }
};