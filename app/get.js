var languages = require('./languages');
var needle = require('needle');

function getRepoByLang(language, callback) {
	var raw_data = [];
	var index = 1;
	function getData() {
		if(index < 11) {
			needle.get('https://api.github.com/search/repositories?q=language:' + language + '&sort=stars&order=desc&page=' + index + '&per_page=100', function(err, res) {
				raw_data.push(res.body);
				console.log('Getting page ' + index + ' of search result');
				index++;
				getData();
			});
		} else {
			return callback(raw_data);
		}
	}
	getData();
}

module.exports = getRepoByLang;
