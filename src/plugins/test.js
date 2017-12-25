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
		bidData.minBuy = obj.minBuy;
		bidData.minSell = obj.minSell;
		bidData.boughtAt = 0;
		bidData.soldAt = 0;	
		
		
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

//add({currency:"ripple", action:"buy", minBuy:0, minSell:0})
//add({status:"inProgress", action:"sell", boughtAt:0})

