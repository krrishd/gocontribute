var get = require('./get');
var process = require('./process');

var router = function(express, harp, port) {	
        var app = express();

	app.configure(function() {
		app.use(express.static('./public'));
		app.use(harp.mount('./public'));
		app.set('view engine', 'jade');
		app.use(express.logger('dev'));
		app.use('views', __dirname + '/views');
		app.use(express.bodyParser());
		app.use(express.methodOverride());
	});

	app.get('/languages', function(req, res) {
		res.json(require('./languages'));
	});
	function compare(a,b) {
  			if (a.score > b.score) {
     				return -1;
			}
  			if (a.score < b.score) {
    				return 1;
			}
  			return 0;
	};
	app.get('/api/lang/:language/:lim', function(req, res) {
		
		get(req.params.language, function(data) {
			var end = process(data);
			end = end.sort(compare);
			end = end.slice(0,(req.params.lim - 1));
			res.json(end);
		});
	});

	app.get('/api/custom/:language/:stars/:activity/:contributors/:issues', function(req, res) {
		get(req.params.language, function(data) {
			var custom = {
				stars: req.params.stars,
				issues: req.params.issues,
				contributors: req.params.contributors,
				activity: req.params.activity
			};
			var end = process(data, custom);
			end.sort(compare);
			end = end.slice(0,9);
			res.json(end)
		});
	});
	
	app.get('*', function(req, res) {
		res.render('home');
	});

	app.listen(port);
};

module.exports = router;
