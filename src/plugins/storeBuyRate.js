
TE.storeBuyRate = (function () {
	
	var previousBuyRate = 0;
	
	var start = function(callback){
		currentBuyRate = TE.rate.currentBuyRate()
		if(currentBuyRate!=previousBuyRate){
			TE.rateData.push([Date.now(),currentBuyRate])
			callback();
			previousBuyRate = currentBuyRate;
		}
		
	}

  return {
    start: start
  }
	
})();




