/**
 * Passport configuration
 *
 * This is the configuration for your Passport.js setup and where you
 * define the authentication strategies you want your application to employ.
 *
 * I have tested the service with all of the providers listed below - if you
 * come across a provider that for some reason doesn't work, feel free to open
 * an issue on GitHub.
 *
 * Also, authentication scopes can be set through the `scope` property.
 *
 * For more information on the available providers, check out:
 * http://passportjs.org/guide/providers/
 */

module.exports.passport = {
	redirect                   : {
		login  : "/",//Login successful
		logout : "/"//Logout successful
	},
	layout                     : "layout", //Specify the layout file for auth views
	passwordResetTokenValidity : 86400000,
	localAuthMethod : "both",//username or email
	onUserCreated              : function (user, providerInfos)
	{
		//Send email for example
	},
	onUserLogged               : function (session, user)
	{
		//Set user infos in session for example
	},
	onUserAskNewPassword       : function (req, userData, callback)
	{
		//You can here send an email, an example of email template is available under /views/auth/emails
		//var protocol  = req.connection.encrypted ? 'https' : 'http';
		//var baseUrl   = protocol + '://' + req.headers.host + '/';
		//Use your favorite email sender :)
		//don't forget to call the callback with optional error parameter
		//URL to call : resetPassword?email=<%=user.email%>&token=user.mdpToken
		callback();
	},
	strategies                 : {
		local : {
			strategy : require('passport-local').Strategy
		},

		twitter : {
			name     : 'Twitter',
			protocol : 'oauth',
			strategy : require('passport-twitter').Strategy,
			options  : {
				consumerKey    : 'your-consumer-key',
				consumerSecret : 'your-consumer-secret'
			}
		},

		facebook : {
			name     : 'Facebook',
			protocol : 'oauth2',
			strategy : require('passport-facebook').Strategy,
			options  : {
				clientID     : 'your-client-id',
				clientSecret : 'your-client-secret',
				scope        : ['email'] /* email is necessary for login behavior */
			}
		},

		google : {
			name     : 'Google',
			protocol : 'oauth2',
			strategy : require('passport-google-oauth').OAuth2Strategy,
			options  : {
				clientID     : 'your-client-id',
				clientSecret : 'your-client-secret'
			}
		}
	}
};
