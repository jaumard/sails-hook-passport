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
	redirect      : {
		login  : "/",//Login successful
		logout : "/"//Logout successful
	},
	onUserCreated : function (user, providerInfos)
	{
		//Send email for example
	},
	onUserLogged : function (user)
	{
		//Set user infos in session for example
	},
	strategies    : {}
};
