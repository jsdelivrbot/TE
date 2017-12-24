
TE.selectCurrency = function(currency){
	var currencyNodes = {
		"bitcoin" : document.querySelectorAll(".dropdown-menu")[0].children[0],
		"ether" : document.querySelectorAll(".dropdown-menu")[0].children[1],
		"ripple" : document.querySelectorAll(".dropdown-menu")[0].children[2],
		"litecoin" : document.querySelectorAll(".dropdown-menu")[0].children[3],
		"bitcoin_cash" : document.querySelectorAll(".dropdown-menu")[0].children[4]
	}
	
	currencyNodes[currency].children[0].click();
}

