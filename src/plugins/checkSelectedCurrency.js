TE.checkSelectedCurrency = (function () {
	
	var check = function(bidCurrency){
		
		var pageCurrency = document.querySelectorAll(".dropdown a")[0].innerText.replace(/ /g,'').toLowerCase();
		
		return (pageCurrency==bidCurrency)
		
	}	

  return {
    check: check
  }
	
})();





