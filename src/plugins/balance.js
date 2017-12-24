TE.balance = (function () {
	
	var coin = function(coinVol,amt,callback){
		
		var coinBal = document.getElementsByClassName("balance")[2].innerHTML;
			coinBal = coinBal.split(":")[1].replace(/,/g, "");
			coinBal = parseFloat(coinBal);
			return coinBal;
		
	}
	
	var inr = function(coinVol,amt,callback){
		
		var inrBalance = document.getElementsByClassName("balance")[0].innerHTML;
			inrBalance = inrBalance.split(":")[1].replace(/,/g, "");
			inrBalance = parseFloat(inrBalance);
			return inrBalance;
	}
	
	
  return {
    coin: coin,
	inr: inr
  }
	
})();

