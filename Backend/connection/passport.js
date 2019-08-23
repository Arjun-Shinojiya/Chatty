var passport = require('passport');
var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;

var user = require('../modals/user');
var config = require('../connection/config');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var configAuth = require('../connection/google_config');
var opts = {};
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');

    opts.secretOrKey = config.secret;
module.exports = passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log(jwt_payload);
        user.findOne({id: jwt_payload._id}, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                console.log("FOUND");
                done(null, user);
            } else {
                done(null, false);
            }
        });
    }));

  module.exports = passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {


            // try to find the user based on their google id
            user.findOne({ 'googleid' : profile.id }, function(err, user2) {
                passport.serializeUser(function(user, done) {
                    done(null, user);
                  });
                  
                  passport.deserializeUser(function(user, done) {
                    done(null, user);
                  });
              
                if (err)
                    return done(err);

                if (user2) {

                    // if a user is found, log them in
                    return done(null, user2);
                } else {
                    // if the user isnt in our database, create a new user
                     var user1 = new user();
                    console.log("Whole Profile",profile);
                    // set all of the relevant information
                    user1.googleid    = profile.id;
                   /*  newUser.google.token = token; */
                    user1.name  = profile.name.givenName;
                    user1.email = profile.emails[0].value; // pull the first email
                    user1.isonline = false;
                   user1.img = profile.photos[0].value;
                    console.log("user name from google"+user1.name);
                    // save the user
                    user1.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user1);
                    });
                }
            });
        });

    }));