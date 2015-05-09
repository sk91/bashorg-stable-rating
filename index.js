var hidemyass = require("hidemyass");
var bashorg = require('./lib');
var config = require('./config');

var QUOTE = config.quote;
var DESIRED_RATING = config.rating;
var CORRECTION_INTERVAL = config.interval;


function correct_raiting(){
	console.log("Getting rating of quote ", QUOTE);

	bashorg.get_raiting(QUOTE, function(err,raiting){

		console.log("Rescived the following rating: ", raiting);

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

console.log("Scrapping hidemyass");
hidemyass.proxies().get(function(err, proxies){
	if(err){
		console.error(err);
		return;
	}
	console.log("Got " + proxies.length + " starting raitng controll");

	bashorg.proxies = proxies.map(proxy_url_creator);
	correct_raiting();
});


function proxy_url_creator(proxy){
	return proxy.protocol + "://" + proxy.ip + ":" + proxy.port;
}
