TE.trading = (function () {
	
	
	//var tradingStatus; // undefined, bought, buying, selling, sold
	
	var buyCompleteStatus = function(obj){
		
			if(success){
				console.log("orderComplete bought "+obj.coin+" at price "+obj.inr);
				localStorage.tradingStatus = "bought";
			}else{
				console.log("error Type : "+obj.type + " | msg : "+obj.msg);
				localStorage.tradingStatus = "buyError";
			}
	} 
	
	// this will trigger with new rate
	var evaluateNewPrice = function(){
		
		if(localStorage.tradingStatus ==  undefined){
			if(TE.geBestBuyRate.get().status){
				TE.buy.trigger(TE.config.coinVol,TE.geBestBuyRate.get().rate,buyCompleteStatus);
			}
		}
		
		
		if(tradingStatus ==  "bought"){
			if(TE.geBestSellRate.get().status){
				TE.sell.trigger(TE.config.coinVol,TE.geBestBuyRate.get().rate,buyCompleteStatus);
			}
		}
		
		
			//console.log("buyRate : "+TE.rate.currentBuyRate()+" | sellRate: "+TE.rate.currentSellRate())
		
	}
	
	// this will trigger every sec
	var tradingTicker = function(){
		TE.storeBuyRate.start(evaluateNewPrice);
		
	}
    
	var start = function() {
		TE.selectCurrency(TE.config.currency);
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




