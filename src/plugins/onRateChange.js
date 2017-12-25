
TE.onRateChange = (function () {
	
	var previousBuyRate = 0;
	var previousSellRate = 0;
	
	var check = function(callback){
		var currentRate = TE.rate.currentRate()
		if(currentRate.buy!=previousBuyRate || currentRate.sell!=previousSellRate){
			
			console.log("change")
			
			previousBuyRate = currentRate.buy;
			previousSellRate = currentRate.sell;
		}
		
	}

  return {
    check: check
  }
	
})();




