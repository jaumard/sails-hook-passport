# sails-hook-passport

Implement passport.js strategies to log your users with twitter, facebook, google and more...

##INSTALL
Install it with npm : 

    npm install --save sails-hook-passport

You need to install all strategies you want to use : 
    
    npm install --save passport-local passport-twitter passport-facebook

##CONFIGURE
Basic user models embedded is : 

```
var User = 
{
  schema : true,
  attributes : {
      username  : {
          type   : 'string',
          unique : true
      },
      email     : {
          type   : 'email',
          unique : true
      },
      passports : {
          collection : 'Passport',
          via        : 'user'
      }
  }
};
```
###You can override it by creating a User.js under your api/models folder.
  
Add translation on your config/locales/...

    {
        "Error.Passport.Password.Invalid": "The provided password is invalid!",
        "Error.Passport.Password.Wrong": "Whoa, that password wasn't quite right!",
        "Error.Passport.Password.NotSet": "Oh no, you haven't set a password yet!",
        "Error.Passport.Username.NotFound": "Uhm, what's your name again?",
        "Error.Passport.User.Exists": "This username is already taken.",
        "Error.Passport.Email.NotFound": "That email doesn't seem right",
        "Error.Passport.Email.Missing": "You need to supply an email-address for verification",
        "Error.Passport.Email.Exists": "This email already exists. So try logging in.",
        "Error.Passport.Username.Missing": "You need to supply a username",
        "Error.Passport.Password.Missing": "Oh no, you haven't set a password yet!",
        "Error.Passport.Generic": "Snap. Something went wrong with authorization."
    }
Enable passport strategies on config/passport.js file :
    
    module.exports.passport = {
      local: {
        strategy: require('passport-local').Strategy
      },

      twitter: {
        name: 'Twitter',
        protocol: 'oauth',
        strategy: require('passport-twitter').Strategy,
        options: {
          consumerKey: 'your-consumer-key',
          consumerSecret: 'your-consumer-secret'
        }
      },
    
      github: {
        name: 'GitHub',
        protocol: 'oauth2',
        strategy: require('passport-github').Strategy,
        options: {
          clientID: 'your-client-id',
          clientSecret: 'your-client-secret'
        }
      },
    
      facebook: {
        name: 'Facebook',
        protocol: 'oauth2',
        strategy: require('passport-facebook').Strategy,
        options: {
          clientID: 'your-client-id',
          clientSecret: 'your-client-secret',
          scope: ['email'] /* email is necessary for login behavior */
        }
      },
    
      google: {
        name: 'Google',
        protocol: 'oauth2',
        strategy: require('passport-google-oauth').OAuth2Strategy,
        options: {
          clientID: 'your-client-id',
          clientSecret: 'your-client-secret'
        }
      }
    };
  ###WARNING 
Don't install passport on your sails projet or hook will not working anymore
