/**
 * Created by jaumard on 12/05/2015.
 */
module.exports.policies = {
	'*'    : ['passport'],
	'auth' : {
		'*' : ['passport']
	}
};