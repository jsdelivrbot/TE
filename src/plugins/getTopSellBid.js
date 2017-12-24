var getTopSellBid = function(){
	var topBid = document.querySelectorAll(".buy-orders")[0].children[0].children[1].innerHTML;
	return parseFloat(topBid);
}