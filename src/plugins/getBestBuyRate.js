TE.geBestBuyRate = (function () {
	

	var get = function() {
		var buyRate = TE.rate.currentBuyRate();
		return {status:true, rate:buyRate};
	};
	

	
  return {
	get : get
  }
	
})();




