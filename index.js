var bashorg = require('./lib');
var hidemyass = require("hidemyass");

var QUOTE = 432170;
var DESIRED_RATING = 666;
var CORRECTION_INTERVAL = 1000;


function correct_raiting(){
	bashorg.get_raiting(QUOTE, function(raiting){
		console.log("Rescived the following rating: ", raiting)
		if(raiting === DESIRED_RATING){
			return raiting_corrected()
		}
		if(raiting < DESIRED_RATING){
			bashorg.raiting_plus(QUOTE, DESIRED_RATING - raiting, raiting_corrected);
		}else{
			bashorg.raiting_minus(QUOTE, raiting - DESIRED_RATING, raiting_corrected);
		}
	});
}

function raiting_corrected(){
	setTimeout(correct_raiting, CORRECTION_INTERVAL);
}

hidemyass.scrap(function(err, proxies){
	if(err){
		console.error(err);
		return;
	}

	bashorg.proxies = proxies;
	correct_raiting();
});
