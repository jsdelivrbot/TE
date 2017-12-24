TE.cgnto = (function () {
    
	var title = function(title) {
		document.title = title;
	};
	
	var bodyVisibility= function(num) {
		document.body.style.opacity = num;
	};
	
	
	var changeFavicon = function(url){
		var el = document.querySelector('link[href="favicon-new.ico"]');
		el.href = url;
	}
	
  return {
    title: title,
	favCon: changeFavicon,
	bodyVisibility: bodyVisibility
  }
	
})();




