module.exports = function (sails)
{
	//Override http config here before hook initialisation
	sails.config.http.middleware = {

		passportInit    : require('passport').initialize(),
		passportSession : require('passport').session(),

		order : ['startRequestTimer', 'cookieParser', 'session', 'passportInit', 'passportSession', 'myRequestLogger', 'bodyParser', 'handleBodyParserError', 'compress', 'methodOverride', 'poweredBy', 'router', 'www', 'favicon', '404', '500']
	};

	var hookLoader = require('sails-util-mvcsloader')(sails);
	hookLoader.injectPolicies(__dirname + '/api/policies');

	return {
		defaults : {
			passport : {}
		},

		initialize : function (cb)
		{
			hookLoader.injectAll({
				controllers : __dirname + '/api/controllers', // Path to your hook's controllers
				models      : __dirname + '/api/models', // Path to your hook's models
				services    : __dirname + '/api/services', // Path to your hook's services
				config      : __dirname + '/config' // Path to your hook's config
			}, function (err)
			{
				if (!err)
				{
					sails.services.passport.loadStrategies();
				}
				return cb(err);
			});

		}
	};
};