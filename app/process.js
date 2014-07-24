var jStat = require('jStat').jStat;

function processData(raw_data, custom) {
	var condensed_data = [];
	var stats = {};
	// First, we condense all the data into a smaller dataset with only the necessary metrics
	for(i=0;i<raw_data.length;i++) {
		var page = raw_data[i];
		if(page.items) {
			for(e=0;e<page.items.length;e++) {
				var item = page.items[e];
				var newObj = {
					name: item.full_name,
					url: 'https://github.com/' + item.full_name,
					stars: item.stargazers_count,
					contributors: item.forks_count,
					issues: item.open_issues_count,
					activity: item.pushed_at
				};
				condensed_data.push(newObj);
			}
		}
	}

	// Then, we calculate the data's means and standard deviations to help later with standardizing the metrics (using z-scores)
	var stars = 0;
	var contributors = 0;
	var issues = 0;
	var activity = 0;
	var std_dev_arr = {
		stars: {
			raw: [],
			diff: []
		},
		activity: {
			raw: [],
			diff: []
		},
		issues: {
			raw: [],
			diff: []
		},
		contributors: {
			raw: [],
			diff: []
		}
	};
	for(i=0;i<condensed_data.length;i++) {
		stars += condensed_data[i].stars;
		std_dev_arr.stars.raw.push(condensed_data[i].stars);
		contributors += condensed_data[i].contributors;
		std_dev_arr.contributors.raw.push(condensed_data[i].contributors);
		issues += condensed_data[i].issues;
		std_dev_arr.issues.raw.push(condensed_data[i].issues);
		var now = new Date();
		var latest = new Date(condensed_data[i].activity);
		var timeDiff = Math.abs(now.getTime() - latest.getTime());
		var diffDays = Math.ceil(timeDiff / (1000*3600*24));
		condensed_data[i].activity = diffDays;
		activity += diffDays;
		std_dev_arr.activity.raw.push(diffDays);
	}
	stats.stars = {
		mean: stars / condensed_data.length,
		std_dev: jStat.stdev(std_dev_arr.stars.raw)
	};
	stats.contributors = {
		mean: contributors / condensed_data.length,
		std_dev: jStat.stdev(std_dev_arr.contributors.raw)
	};
	stats.issues = {
		mean: issues / condensed_data.length,
		std_dev: jStat.stdev(std_dev_arr.issues.raw)
	};
	stats.activity = {
		mean: activity / condensed_data.length,
		std_dev: jStat.stdev(std_dev_arr.activity.raw)
	};
	var scores = {};
	if(!custom) {
		condensed_data = condensed_data.map(function(d, i) {
			var zScore = {
				stars: ((condensed_data[i].stars - stats.stars.mean)/stats.stars.std_dev),
				contributors: ((condensed_data[i].contributors - stats.contributors.mean)/stats.contributors.std_dev),
				issues: ((condensed_data[i].issues - stats.issues.mean)/stats.issues.std_dev),
				activity: ((condensed_data[i].activity - stats.activity.mean)/stats.activity.std_dev)*(-1)
			};
			var score = ((0.1*zScore.stars)+(0.2*zScore.activity)+(0.3*zScore.contributors)+(0.4*zScore.issues))*100;
			var newD = d;
			newD.score = score;
			return newD;
		});
		return condensed_data;
	} else {
		condensed_data = condensed_data.map(function(d, i){
			var zScore = {
				stars: ((condensed_data[i].stars - stats.stars.mean)/stats.stars.std_dev),
				contributors: ((condensed_data[i].contributors - stats.contributors.mean)/stats.contributors.std_dev),
				issues: ((condensed_data[i].issues - stats.issues.mean)/stats.issues.std_dev),
				activity: ((condensed_data[i].activity - stats.activity.mean)/stats.activity.std_dev)*(-1)
			};
			var s = custom.stars;
			var a = custom.activity;
			var is = custom.issues;
			var c = custom.contributors;
			var score = ((s*zScore.stars)+(a*zScore.activity)+(is*zScore.issues)+(c*zScore.contributors))*100;
			var newD = d;
			newD.score = score;
			return newD;
		});
		return condensed_data;
	}
};

module.exports = processData;
