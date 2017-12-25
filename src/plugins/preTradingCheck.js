TE.preTradingCheck = (function () {
	
	var check = function(callback){
		
		if(checkCurrency() && checkBiddings()){
			callback();
		}
		
	}	
	
	var checkCurrency = function(){
		TE.selectCurrency(TE.config.currency);
		return true;
	}	
	
	var checkBiddings = function(){
		return true;
	}	

  return {
    check: check
  }
	
})();






