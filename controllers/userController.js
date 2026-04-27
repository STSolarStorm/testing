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

        await User.create({
            email: req.body.email,
            password: sha256(req.body.password),
            ufirstname: req.body.ufirstname,
            ulastname: req.body.ulastname,
            role: req.body.role,
        });

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
    res.render('users/login', {title: 'Login User'})
}

module.exports.login = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureMessage: true
});


module.exports.logout = function (req, res) {
    req.logout(function(err) {
        if (err) { return next(err); }
    });
    res.redirect('/login');
}


module.exports.viewUserProfile = async function(req, res){
    const user = await User.findByPk(req.params.id, {
        include: 'clubs'
    });
    res.render('users/userProfile', {user});
}

