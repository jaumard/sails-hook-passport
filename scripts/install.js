var fs = require('fs-extra');

var appDir = process.env.PWD;

//Config already exist so we don't override
if (!fs.existsSync(appDir + "/../../config/passport.js"))
{
	//Copy base acl config
	fs.copy(appDir + "/templates/passport.js", appDir + "/../../config/passport.js", function (err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("done write passport.js base config");
		}
	});
}
if (!fs.existsSync(appDir + "/../../views/auth"))
{
	//Copy base acl config
	fs.copy(appDir + "/templates/auth", appDir + "/../../views/auth", function (err)
	{
		if (err)
		{
			console.log(err);
		}
		else
		{
			console.log("done write auth base views");
		}
	});
}