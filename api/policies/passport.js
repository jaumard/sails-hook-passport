/**
 * Passport Middleware
 *
 * Policy for Sails that initializes Passport.js and as well as its built-in
 * session support.
 *
 * In a typical web application, the credentials used to authenticate a user
 * will only be transmitted during the login request. If authentication
 * succeeds, a session will be established and maintained via a cookie set in
 * the user's browser.
 *
 * Each subsequent request will not contain credentials, but rather the unique
 * cookie that identifies the session. In order to support login sessions,
 * Passport will serialize and deserialize user instances to and from the
 * session.
 *
 * For more information on the Passport.js middleware, check out:
 * http://passportjs.org/guide/configure/
 *
 * @param {Object}   req
 * @param {Object}   res
 * @param {Function} next
 */
var http    = require('http');
var methods = ['login', 'logIn', 'logout', 'logOut', 'isAuthenticated', 'isUnauthenticated'];

module.exports = function (req, res, next)
{
	// Initialize Passport
	req._sails.services.passport.initialize()(req, res, function ()
	{
		// Use the built-in sessions
		req._sails.services.passport.session()(req, res, function ()
		{
			// Make the user available throughout the frontend
			res.locals.user = req.user;
			if (req.isSocket)
			{
				for (var i = 0; i < methods.length; i++)
				{
					req[methods[i]] = http.IncomingMessage.prototype[methods[i]].bind(req);
				}
			}
			next();
		});
	});
};
