/**
 * Authentication Controller
 *
 * This is merely meant as an example of how your Authentication controller
 * should look. It currently includes the minimum amount of functionality for
 * the basics of Passport.js to work.
 */
var AuthController = {
	/**
	 * Render the login page
	 *
	 * The login form itself is just a simple HTML form:
	 *
	 <form role="form" action="/auth/local" method="post">
	 <input type="text" name="identifier" placeholder="Username or Email">
	 <input type="password" name="password" placeholder="Password">
	 <button type="submit">Sign in</button>
	 </form>
	 *
	 * You could optionally add CSRF-protection as outlined in the documentation:
	 * http://sailsjs.org/#!documentation/config.csrf
	 *
	 * A simple example of automatically listing all available providers in a
	 * Handlebars template would look like this:
	 *
	 {{#each providers}}
	 <a href="/auth/{{slug}}" role="button">{{name}}</a>
	 {{/each}}
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	login : function (req, res)
	{

		if (req.session.authenticated)
		{
			res.redirect(req._sails.config.passport.redirect.login);
		}
		else
		{
			var strategies = req._sails.config.passport.strategies, providers = {};

			// Get a list of available providers for use in your templates.
			Object.keys(strategies).forEach(function (key)
			{
				if (key === 'local' || key === 'bearer')
				{
					return;
				}

				providers[key] = {
					name : strategies[key].name,
					slug : key
				};
			});

			// Render the `auth/login.ext` view
			res.view({
				layout    : req._sails.config.passport.layout,
				providers : providers,
				errors    : req.flash('error'),
				messages  : req.flash('message')
			});
		}
	},

	/**
	 * Log out a user and return them to the homepage
	 *
	 * Passport exposes a logout() function on req (also aliased as logOut()) that
	 * can be called from any route handler which needs to terminate a login
	 * session. Invoking logout() will remove the req.user property and clear the
	 * login session (if any).
	 *
	 * For more information on logging out users in Passport.js, check out:
	 * http://passportjs.org/guide/logout/
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	logout : function (req, res)
	{
		req.logout();

		// mark the user as logged out for auth purposes
		req.session.authenticated = false;

		if (req.wantsJSON)
		{
			res.json({redirect : req._sails.config.passport.redirect.logout});
		}
		else
		{
			res.redirect(req._sails.config.passport.redirect.logout);
		}
	},

	/**
	 * Render the registration page
	 *
	 * Just like the login form, the registration form is just simple HTML:
	 *
	 <form role="form" action="/auth/local/register" method="post">
	 <input type="text" name="username" placeholder="Username">
	 <input type="text" name="email" placeholder="Email">
	 <input type="password" name="password" placeholder="Password">
	 <button type="submit">Sign up</button>
	 </form>
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	register : function (req, res)
	{
		res.view({
			layout : req._sails.config.passport.layout,
			errors : req.flash('error')
		});
	},

	/**
	 * Create a third-party authentication endpoint
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	provider : function (req, res)
	{
		req._sails.services.passport.endpoint(req, res);
	},

	/**
	 * Create a authentication callback endpoint
	 *
	 * This endpoint handles everything related to creating and verifying Pass-
	 * ports and users, both locally and from third-aprty providers.
	 *
	 * Passport exposes a login() function on req (also aliased as logIn()) that
	 * can be used to establish a login session. When the login operation
	 * completes, user will be assigned to req.user.
	 *
	 * For more information on logging in users in Passport.js, check out:
	 * http://passportjs.org/guide/login/
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	callback : function (req, res)
	{
		function tryAgain(err)
		{

			// Only certain error messages are returned via req.flash('error', someError)
			// because we shouldn't expose internal authorization errors to the user.
			// We do return a generic error and the original request body.
			var flashError = req.flash('error')[0];
			var action = req.param('action');
			var json   = {action : action};

			var status = 500;
			if (err && !flashError)
			{
				req.flash('error', 'Error.Passport.Generic');
				json["error"] = req.__("Error.Passport.Generic");
			}
			else if (flashError)
			{
				req.flash('error', flashError);
				json["error"] = req.__(flashError);
				status        = 400;
			}
			if (req.body.password)
			{
				delete req.body.password;//We don't re populate password
			}
			req.flash('form', req.body);

			// If an error was thrown, redirect the user to the
			// login, register or disconnect action initiator view.
			// These views should take care of rendering the error messages.

			if (req.wantsJSON)
			{
				switch (action)
				{
					case 'register':
						json["redirect"] = '/register';
						break;
					case 'disconnect':
						json["redirect"] = 'back';
						break;
					default:
						json["redirect"] = '/login';
				}
				res.status(status).json(json);
			}
			else
			{
				switch (action)
				{
					case 'register':
						res.redirect('/register');
						break;
					case 'disconnect':
						res.redirect('back');
						break;
					default:
						res.redirect('/login');
				}
			}
		}

		req._sails.services.passport.callback(req, res, function (err, user, challenges, statuses)
		{
			if (err || !user)
			{
				return tryAgain(challenges);
			}

			req.login(user, function (err)
			{
				if (err)
				{
					return tryAgain(err);
				}

				// Mark the session as authenticated to work with default Sails sessionAuth.js policy
				req.session.authenticated = true;
				if (req._sails.config.passport.onUserLogged)
				{
					req._sails.config.passport.onUserLogged(req.session, user)
				}

				// Upon successful login, send the user to the homepage were req.user
				// will be available.
				if (req.wantsJSON)
				{
					res.json({
						redirect : req._sails.config.passport.redirect.login,
						user     : user
					});
				}
				else
				{
					res.redirect(req._sails.config.passport.redirect.login);
				}
			});
		});
	},

	/**
	 * Disconnect a passport from a user
	 *
	 * @param {Object} req
	 * @param {Object} res
	 */
	disconnect     : function (req, res)
	{
		req._sails.services.passport.disconnect(req, res);
	},
	/**
	 * `AuthController.password()`
	 * Show page for set email account to reseting
	 */
	password       : function (req, res)
	{
		var email = req.param("email");
		res.view({
			layout : req._sails.config.passport.layout,
			email  : email,
			errors : req.flash('error')
		});

	},
	/**
	 * `AuthController.resetPassword()`
	 * Show page for reseting password
	 */
	resetPassword  : function (req, res)
	{
		var email = req.param("email");
		var token = req.param("token");

		res.view("auth/changePassword", {
			layout : req._sails.config.passport.layout,
			email  : email,
			token  : token
		});

	},
	/**
	 * `AuthController.changePassword()`
	 * Receive form informations for password reseting
	 */
	changePassword : function (req, res)
	{
		var email = req.param("email");
		var token = req.param("token");

		if (token)
		{
			req._sails.models.user.findOneByEmail(email).populate("passports").exec(function (err, user)
			{
				if (err)
				{
					req._sails.log.error(err);
					res.serverError();
				}
				else if (!user)
				{
					req.flash("error", "Error.Passport.Email.NotFound");
					res.redirect("/login");

				}
				else
				{
					if (token == user.mdpToken)
					{
						var date  = user.mdpTokenTimestamp.getTime();
						var now   = new Date().getTime();
						var limit = req._sails.config.passport.passwordResetTokenValidity || 86400000;//More than 24h token is invalid

						if (now - date >= limit)//More than 24h token is invalid
						{
							req.flash("error", "Error.ResetPassword.Token");
							res.redirect("/login");
						}
						else
						{
							var localPassport;
							for (var i = 0; i < user.passports.length; i++)
							{
								if (user.passports[i].protocol == "local")
								{
									localPassport = user.passports[i];
									break;
								}
							}
							if (localPassport)
							{
								req._sails.models.passport.update(localPassport.id, {password : req.param("password")}).exec(function (err, results)
								{
									if (err)
									{
										if (err.code == "E_VALIDATION")
										{
											res.view({
												layout : req._sails.config.passport.layout,
												errors : ["Error.Passport.Password.Missing"]
											});
										}
										else
										{
											req._sails.log.error(err);
											res.serverError();
										}

									}
									else
									{
										req.flash("message", "Success.ResetPassword");
										res.redirect("/login");

									}
								});

							}
							else
							{
								req._sails.log.error(err);
								res.serverError();
							}

						}

					}
					else
					{
						req.flash("error", "Error.ResetPassword");
						res.redirect("/login");

					}

				}
			});
		}
		else
		{
			req.flash("error", "Error.ResetPassword");
			res.redirect("/login");
		}
	},
	/**
	 * `AuthController.sendEmailMdp()`
	 * Send email for reseting password
	 */
	sendEmailMdp   : function (req, res)
	{
		var email = req.param("email");
		var error;

		if (email)
		{
			req._sails.models.user.findOneByEmail(email).populate("passports").exec(function (err, user)
			{
				if (err)
				{
					if (err.code == "E_VALIDATION")
					{
						res.view("auth/password", {
							layout : req._sails.config.passport.layout,
							errors : ["Error.Passport.Email.NotFound"]
						});
					}
					else
					{
						req._sails.log.error(err);
						res.serverError();
					}
				}
				else if (!user)
				{
					res.view("auth/login", {
						layout : req._sails.config.passport.layout,
						errors : ["Error.Passport.Email.NotFound"]
					});
				}
				else
				{
					var crypto = require('crypto');
					// Generating accessToken for API authentication
					var token              = crypto.randomBytes(48).toString('base64').replace("+", "");
					user.mdpToken          = token;
					user.mdpTokenTimestamp = new Date();

					req._sails.models.user.update(user.id, {
						mdpToken          : token,
						mdpTokenTimestamp : new Date()
					}).exec(function (err, results)
					{
						if (err)
						{
							req._sails.log.error(err);
							res.serverError();
						}
						else
						{
							user.mdpToken = encodeURIComponent(user.mdpToken);

							if (req._sails.config.passport.onUserAskNewPassword)
							{
								req._sails.config.passport.onUserAskNewPassword(req, user, function (err)
								{
									if (err)
									{
										req._sails.log.error(err);
										res.serverError();
									}
									else
									{
										req.flash("message", "Email.Sent");
										res.redirect("/login");
									}
								});
							}
							else
							{
								req._sails.log.error("sails.config.passport.onUserAskNewPassword need to be set for reseting user password!");
								res.serverError();
							}

						}
					});
				}
			});
		}
		else
		{
			error = ['Error.Email'];
			res.view("auth/password", {
				email  : email,
				layout : req._sails.config.passport.layout,
				errors : error
			});
		}
	}
};

module.exports = AuthController;
