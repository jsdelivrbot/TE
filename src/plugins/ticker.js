
TE.ticker = (function () {
    
	var intervalID;
	var time = 1000
	
	function play(callback){
		callback();
	}
	
	var start = function(callback) {
		clearInterval(intervalID);
		intervalID = setInterval(play,time,callback);
	};
	
	var stop = function(callback) {
		clearInterval(intervalID);
	};
	
	
  return {
    start: start,
	stop: stop
  }
	
})();


