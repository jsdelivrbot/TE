
TE.ls = (function () {
	

	var getList = function(){

			if(localStorage.bids==undefined){
				localStorage.setItem("bids",'[]');			
			}

			return JSON.parse(localStorage.bids);

		}
	

	var add = function(obj){

		var bids = getList();			
		
		var bidData = {};
		
		bidData.id = "b"+(bids.length+1);
		bidData.status = "inQ"; // inQ, inProgress, bought, sold
		
		bidData.currency = obj.currency;
		bidData.action = obj.action; // buy, sell, none
		bidData.coinVol = obj.coinVol;
		bidData.maxBuy = obj.maxBuy;
		bidData.minSell = obj.minSell;
		
		bidData.boughtAt = 0;
		bidData.soldAt = 0;	
		bidData.profit = 0;	
		
		
		bids.push(bidData);
		bids = JSON.stringify(bids);	
		localStorage.bids = bids

		
	}
	
	
	var update = function(id,obj){ 
	
		var bids = getList();

		for(var i in bids){
			if(id==bids[i].id){

				for(var j in obj){
					if(obj[j]){
						bids[i][j] = obj[j];
					}
				}

				bids = JSON.stringify(bids);	
				localStorage.bids = bids;

				break;
			}
		}
	}

	
	
	var del = function(id){ 
	
		var bids = getList();
		var num = parseInt(id.split("")[1])-1;
		
		if (num > -1) {
    		bids.splice(num, 1);
		}
		
		bids = JSON.stringify(bids);	
		localStorage.bids = bids;
		
		}
	
	
	var clearStorage = function(){
		localStorage.bids = "[]"
	}
	
	
  return {
    	getList : getList,
	  	add: add,
	  	update: update,
	  	del: del,
	  	clearStorage : clearStorage
  }
	
})();

// Usage :

//TE.ls.add({currency:"ripple", coinVol:0, action:"buy", minBuy:0, minSell:0})
//TE.ls.update("b1",{status:"inProgress", action:"sell", boughtAt:0})
//TE.ls.update("b1",{status:"sold", action:"none", soldAt:0, profit:1})



