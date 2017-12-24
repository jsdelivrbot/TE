
TE.isLoggedIn = (function () {
	
	var status = function(){
		var query = document.querySelectorAll("div ul li a")[9];
		var logInStatus = (query.innerHTML != "SIGN IN")
		console.log("LoggedIn status : "+logInStatus);
		return logInStatus;
	}
	
	return {
		status : status	
	};
	
})();

