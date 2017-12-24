var getTopBuyBid = function(){
	
	var topBid = document.querySelectorAll(".sell-orders")[0].children[0].children[1].innerHTML;
	return parseFloat(topBid);
}