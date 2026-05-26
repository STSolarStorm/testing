const passport = require('passport');
const {Strategy} = require('passport-local');
const {User} = require('../models');
const sha256 = require('sha256');

async function authenticate (username, password, done) {
    try {
        const user = await User.findOne({
            where: {
                email: username
            }
        });

        if(!user || sha256(password) !== user.password) {
            return done(null, false, {message: 'Incorrect email or password.'});
        }

        // FIX: Pass the full user object down so 'isApproved' and other fields exist
        return done(null, user);

    } catch (error) {
        return done(error);
    }
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