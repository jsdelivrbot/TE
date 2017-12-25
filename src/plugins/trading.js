TE.trading = (function () {
	
	
	// this will trigger with new rate
	var rateUpdate = function(){
			TE.executeBids.start()
	}
	
	// this will trigger every sec
	var tradingTicker = function(){
		TE.storeBuyRate.start();
		TE.onRateChange.check(rateUpdate);
	}
    
	var start = function() {
		console.log("starting programe");
		
		TE.getRateChart(function(){TE.ticker.start(TE.trading.tradingTicker)});
		
	};
	
	var stop = function(num) {
		TE.ticker.stop();
	};
	
	
	var reset = function(url){
		
	}
	
  return {
    start: start,
	stop: stop,
	tradingTicker : tradingTicker
  }
	
})();





