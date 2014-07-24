var languages = require('./languages');
var needle = require('needle');

function getRepoByLang(language, callback) {
	var raw_data = [];
	needle.get('https://api.github.com/search/repositories?q=language:' + language + '&sort=stars&order=desc&per_page=100', function(err, res) {
		raw_data.push(res.body);
		callback(raw_data);
	});
}

module.exports = getRepoByLang;