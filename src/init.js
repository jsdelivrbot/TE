TE.init = (function () {
	
	var cgnto = function() {
				TE.cgnto.title("inRead & Outstream Video Ad Units - Teads");
				TE.cgnto.favCon("https://cdn.teads.website/2/2016/09/12185537/cropped-teads_icon-32x32.png");
				TE.cgnto.bodyVisibility(0);
			}
	
	var startProgram = function(){
		if(TE.isLoggedIn.status()){
			TE.keepSessionAlive.active(5);
			TE.trading.start();
			//TE.init.cgnto();
		}
	}
	
	var stopProgram = function(){

	}	

  return {
    cgnto: cgnto,
	startProgram:startProgram,
	stopProgram : stopProgram
  }
	
})();


setTimeout(TE.init.startProgram,5000);





