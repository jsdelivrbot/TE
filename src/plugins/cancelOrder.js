
TE.cancelOrder = (function () {
	
	var popIntervalID;
	var popCloseIntervalID;
	var balanceIntervalID;
	var inrBalance;
	var coinBalance;
	
	
	var TO_popWinAppear;
	var TO_popWinDisAppear;
	var TO_checkBalStatus;
	var TO_time = 10000
	
	
	var trigger = function(callback){
		
		inrBalance = TE.balance.inr();
		coinBalance = TE.balance.coin();
		triggerActionButton(callback);
	}
	
	
	var triggerActionButton = function(callback){
			var checkCancelLink = document.getElementsByClassName("cancel-link")[0];
			 checkCancelLink.click();
		
			popIntervalID = setInterval(checkPopWindow,200,callback);
		
			TO_popWinAppear = setTimeout(timeoutError,TO_time,callback,{type:"popError",msg:"popWinApError"});
		
			console.log("button clicked");
	}
	

	var checkPopWindow = function(callback){
		
		if(document.querySelectorAll(".modal-content")[0]){
			clearInterval(popIntervalID);
			console.log("pop win appeared");
			
			clearTimeout(TO_popWinAppear); 
			
			triggerConfirmButton(callback);
		}else{
			console.log("checking... "+document.querySelectorAll(".modal-content")[0])
		}
	}
	
	
	var triggerConfirmButton = function(callback){
		document.getElementsByClassName("ladda-button")[0].click();
		popCloseIntervalID = setInterval(checkPopWindowClose,200,callback);
		TO_popWinDisAppear = setTimeout(timeoutError,TO_time,callback,{type:"popError",msg:"popWinDiApError"});
	}	
	
	
	
	var checkPopWindowClose = function(callback){
		
		if(document.querySelectorAll(".modal-content")[0]==undefined){
			clearInterval(popCloseIntervalID);
			console.log("pop win disappered");
			
			clearTimeout(TO_popWinDisAppear); 
			
			checkOrderStatus(callback);
		}else{
			console.log("checking... "+document.querySelectorAll(".modal-content")[0])
		}
	}	
	
	
	var checkOrderStatus = function(callback){
		balanceIntervalID = setInterval(checkBalanceStatus,200,callback);
		
		TO_checkBalStatus = setTimeout(timeoutError,TO_time,callback,{type:"balError",msg:"balanceError"});
		
	}
	
	
	var checkBalanceStatus = function(callback){
		if(TE.balance.inr()>inrBalance || TE.balance.coin()>coinBalance){
			clearInterval(balanceIntervalID);
			clearTimeout(TO_checkBalStatus);
			var obj = {
				coin : parseFloat((TE.balance.coin()-coinBalance).toFixed(4)),
				inr : parseFloat((inrBalance-TE.balance.inr()).toFixed(4))
			}
	
			if(obj.coin>0){
				localStorage.removeItem("sell");
			}else{
				localStorage.removeItem("buy");
			}
				
			
			callback(true,obj);
		}else{
				console.log("waiting for amout status to update : old: "+inrBalance+" | new: "+TE.balance.inr()+" | coin old: "+coinBalance+" | coin new : "+TE.balance.coin());
			}
	}
	
	
	var timeoutError = function(callback,obj){
			
		clearInterval(popIntervalID);
		clearTimeout(TO_popWinDisAppear); 
		clearInterval(balanceIntervalID);
		
		callback(false,obj);
		
	}
	
	
  return {
    trigger: trigger
  }
	
})();


// usage : 

//function cb(success,obj){
//	if(success){
//		console.log("order cancelled successfully > returned : coin "+obj.coin+" amount "+obj.inr);
//	}else{
//		console.log("error Type : "+obj.type + " | msg : "+obj.msg);
//	}
//	
//}
//
//
//TE.cancelOrder.trigger(cb);



