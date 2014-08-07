var languages = require('./languages');
var needle = require('needle');

function getRepoByLang(language, callback) {
	var raw_data = [];
	var index = 1;
	if(index < 6) {
		needle.get('https://api.github.com/search/repositories?q=language:' + language + '&sort=stars&order=desc&per_page=100?page=' + index, function(err, res) {
			raw_data.push(res.body);
			console.log('Getting page ' + index + ' of search result');
			index++;
		});
	} else {
		callback(raw_data);
	}
}

module.exports = getRepoByLang;
