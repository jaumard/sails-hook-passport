# sails-hook-passport

Implement passport.js strategies to log your users with twitter, facebook, google and more...

Install it with npm : 

    npm install --save sails-hook-passport

You need to install all strategies you want to use : 
    npm install --save passport-local passport-twitter passport-facebook

###WARNING 
Don't install passport on your sails projet or hook will not working anymore

Basic user models embedded is : 
    var User = {
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

###You can override it by creating a User.js under your api/models folder.
  
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
  