
TE.storeBuyRate = (function () {
	
	var previousBuyRate = 0;
	
	var start = function(){
		currentBuyRate = TE.rate.currentBuyRate()
		if(currentBuyRate!=previousBuyRate){
			TE.rateData.push([Date.now(),currentBuyRate])
			previousBuyRate = currentBuyRate;
		}
	}

  return {
    start: start
  }
	
})();




