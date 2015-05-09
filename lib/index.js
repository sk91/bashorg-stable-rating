var PageScrapper = require('scrappers').PageScrapper;
var iconv = require("iconv");
var request = require("request");
var async = require("async");


var URL = 'http://bash.im/quote';
var ENCODING = 'windows-1251';


var raitingParser = {
	parse: function($){
		var rating = $(".rating-o > span").text();
		console.log();
		return parseInt(rating);
	}
};

var scrapper = new  PageScrapper({
	encoding: ENCODING,
	parser: raitingParser
});



function get_random_proxy(){
	var proxies = exports.proxies;
	var proxy_index, proxy;
	if(proxies.length == 0){
		return null;
	}
	proxy_index = Math.floor(Math.random() * proxies.length -1);
	return proxies[proxy_index];
}


function get_raiting(quote, done){
	var url = quote_url(quote);
	scrapper.get({url: url}, done);
}


function raiting_plus(quote, amount, callback){
	console.log("Incrementing quote by", amount);
	send_post_to_quote(quote, 'rulez', amount, callback);
}

function raiting_minus(quote, amount, callback){
	console.log("Decreasing quote by", amount);
	send_post_to_quote(quote, 'sux', amount, callback);
}

function send_post_to_quote (quote, act, amount, callback) {
	var form_data = {
		quote: quote,
		act: act
	};
	var url = [quote_url(quote), act].join('/');

	async.times(amount, send_post, callback);

	function send_post (n, cb) {
		var proxy = get_random_proxy();
		console.log ("Requesting " + url + " with proxy " + proxy);
		request
			.post(url, {
				form: form_data,
				proxy: proxy,
				timeout: 5000,
				headers: {
					'User-Agent': "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.94 Safari/537.36",
					'X-Requested-With': 'XMLHttpRequest',
					'Origin': 'http://bash.im',
					'Referer': url
				},
				gzip: true
			},responded);

			function responded(err,res,body) {
			if(err || res.statusCode!=200){
				res && console.log(res.statusCode);
				err && console.log(err.code);
				console.log("Retrying");
				return send_post(n, cb);
			}
			console.log(res.statusCode);
			cb();
		}
	}


}


function quote_url(id){
	return [URL,id].join('/');
}

exports.get_raiting = get_raiting;
exports.raiting_plus = raiting_plus;
exports.raiting_minus = raiting_minus;
exports.proxies = [];
