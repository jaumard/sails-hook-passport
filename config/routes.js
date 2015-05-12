/**
 * Created by jaumard on 12/05/2015.
 */
module.exports.routes = {

	'get /login'    : 'AuthController.login',
	'get /logout'   : 'AuthController.logout',
	'get /register' : 'AuthController.register',

	'post /auth/local'         : 'AuthController.callback',
	'post /auth/local/:action' : 'AuthController.callback',

	'get /auth/:provider'          : 'AuthController.provider',
	'get /auth/:provider/callback' : 'AuthController.callback',
	'get /auth/:provider/:action'  : 'AuthController.callback'
};