/**
 * Created by jaumard on 12/05/2015.
 */
module.exports.http = {

	middleware : {

		passportInit    : require('passport').initialize(),
		passportSession : require('passport').session(),

		order : ['startRequestTimer', 'cookieParser', 'session', 'passportInit', 'passportSession', 'myRequestLogger', 'bodyParser', 'handleBodyParserError', 'compress', 'methodOverride', 'poweredBy', 'router', 'www', 'favicon', '404', '500']
	}
};