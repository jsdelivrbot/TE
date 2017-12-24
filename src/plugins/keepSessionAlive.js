TE.keepSessionAlive = (function () {
    var imgs = document.getElementsByTagName("img");
    var i = 0
	var intervalID;
	var active = function(duration) {
		function refreshSession(){
        if(i>imgs.length){
            i=0
        }
        console.log(imgs[i]);
        if(imgs[i]){
            imgs[i].src = (imgs[i].src.split("?")[0])+"?"+ Math.random();
			
			if(TE.isLoggedIn.status()){
				TE.trading.stop(); // stop trading in case of logged in status is false;
			}
			
        }
        i++
    }
    	intervalID = setInterval (refreshSession,duration*1000*60);
		
	};
	
	var deActive = function(){
		clearInterval(intervalID);
	}
	
	
  return {
    active: active
  }
	
})();