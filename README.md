# sails-hook-passport

Implement passport.js strategies to log your users with twitter, facebook, google and more...

Install it with npm : 

    npm install --save sails-hook-passport

Edit your config/http.js file :

    middleware: {

        passportInit    : require('passport').initialize(),
        passportSession : require('passport').session(),
    
        order: [
          'startRequestTimer',
          'cookieParser',
          'session',
          'passportInit',
          'passportSession',
          'myRequestLogger',
          'bodyParser',
          'handleBodyParserError',
          'compress',
          'methodOverride',
          'poweredBy',
          'router',
          'www',
          'favicon',
          '404',
          '500'
        ]
    }
  
Enable passport strategies on config/passport.js file :
    
    module.exports.passport = {
      local: {
        strategy: require('passport-local').Strategy
      },
    
      bearer: {
        strategy: require('passport-http-bearer').Strategy
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
      },
    
      cas: {
        name: 'CAS',
        protocol: 'cas',
        strategy: require('passport-cas').Strategy,
        options: {
          ssoBaseURL: 'http://your-cas-url',
          serverBaseURL: 'http://localhost:1337',
          serviceURL: 'http://localhost:1337/auth/cas/callback'
        }
      }
    };
  