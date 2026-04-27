const passport = require('passport');
const {Strategy} = require('passport-local');
const {User} = require('../models');
const sha256 = require('sha256');

async function authenticate (username, password, done) {
    const user = await User.findOne({
        where: {
            email: username
        }
    });
    if(!user || sha256(password) !== user.password) {
        return done(null, false, {message: 'Incorrect email or password.'});
    }
    return done(null, {
        id: user.id,
        email: user.email,
        displayName: user.ufirstname,
        role: user.role
    });
    // return done(null, user);
}

const validationStrategy = new Strategy({
        usernameField: 'email',
        passwordField: 'password',
    },
    authenticate);

passport.use(validationStrategy);

passport.serializeUser(function(user, cb) {
    cb(null, user.id);
});

passport.deserializeUser(async function(id, cb) {

    try {
        const user = await User.findByPk(id);
        cb(null, user);
    } catch (err) {
        cb(err);
    }
});

module.exports.passport = passport;