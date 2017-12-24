TE.rate = (function () {
	
	function getPrice () {
			
				if(document.getElementsByClassName("balance")[1] == undefined){
					return {
						buy: false,
						sell: false
					}
				};
		
				var askPrice = document.getElementsByClassName("balance")[1].innerHTML;
					askPrice = askPrice.split(":")[1].replace(/,/g, "");
					askPrice = parseFloat(askPrice);

				var bidPrice = document.getElementsByClassName("balance")[3].innerHTML;
					bidPrice = bidPrice.split(":")[1].replace(/,/g, "");
					bidPrice = parseFloat(bidPrice);
		
				return {
					buy: askPrice,
					sell: bidPrice
				}
			}
	
	var currentBuyRate = function(){
		return getPrice ().buy;
	}
	
	var currentSellRate = function(){
		return getPrice ().sell;
	}	
	
	
  return {
    currentBuyRate: currentBuyRate,
	currentSellRate: currentSellRate
  }
	
})();

