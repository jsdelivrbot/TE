var TE = {
	rateData:{}
};


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





TE.config = {
	
	currency : "ripple",
	trading : "auto", // auto / buy / sell
	coinVol : 0,
	tradingFees : 0.25,
	profitMargin : 0.1,
	
	buyPrice : 0, // if trading type is buy
	sellPrice : 0 // if trading type is sell
	
}
TE.getMinMax = function(data){
	var max = 0;
	var min = 0;
	var maxData;
	var minData;
	var previous = 0;
	
	for(var i=0; i<data.length; i++){
		if(i==0){
			max = data[i][1];
			min = data[i][1];
			
			maxData = data[i];
			minData = data[i];
			
		}else{
			
			if(data[i][1]>max){
				max = data[i][1];
				maxData = data[i];
			}
			
			if(data[i][1]<min){
				min = data[i][1];
				minData = data[i];
			}
			
		}
		console.log(data[i][1])
	}
	
	return {
		min : minData,
		max : maxData
	}
}

//
//
//var TE = {
//	rateData:{}
//};
//
//TE.config = {
//	
//	currency : "ripple",
//	trading : "auto", // auto / buy / sell
//	coinVol : 0,
//	tradingFees : 0.25,
//	profitMargin : 0.1,
//	
//	buyPrice : 0, // if trading type is buy
//	sellPrice : 0 // if trading type is sell
//	
//}
//
//
//TE.readJsonFile = function(file, callback) {
//    var rawFile = new XMLHttpRequest();
//    rawFile.overrideMimeType("application/json");
//    rawFile.open("GET", file, true);
//    rawFile.onreadystatechange = function() {
//        if (rawFile.readyState === 4 && rawFile.status == "200") {
//            callback(rawFile.responseText);
//        }
//    }
//    rawFile.send(null);
//}

TE.getRateChart = function(callback){
	
	var chartURL = "https://koinex.in/api/dashboards/fetch_chart_data?days=1&target_currency="+TE.config.currency;
	
	TE.readJsonFile(chartURL, function(text){
    	var data = JSON.parse(text);
		TE.rateData = data.chart;
		callback();
		
	}.bind(callback));
	
}



var getTopBuyBid = function(){
	
	var topBid = document.querySelectorAll(".sell-orders")[0].children[0].children[1].innerHTML;
	return parseFloat(topBid);
}
var getTopSellBid = function(){
	var topBid = document.querySelectorAll(".buy-orders")[0].children[0].children[1].innerHTML;
	return parseFloat(topBid);
}

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
TE.rate = (function () {
	
	function getPrice () {
			
				if(document.getElementsByClassName("balance")[1] == undefined){
					return {
						buy: false,
						sell: false
					}
				};
		
				var askPrice = document.getElementsByClassName("balance")[1].innerHTML;
					askPrice = askPrice.split(":")[1].replace(/,/g, "");
					askPrice = parseFloat(askPrice);

				var bidPrice = document.getElementsByClassName("balance")[3].innerHTML;
					bidPrice = bidPrice.split(":")[1].replace(/,/g, "");
					bidPrice = parseFloat(bidPrice);
		
				return {
					buy: askPrice,
					sell: bidPrice
				}
			}
	
	var currentBuyRate = function(){
		return getPrice ().buy;
	}
	
	var currentSellRate = function(){
		return getPrice ().sell;
	}	
	
	
  return {
    currentBuyRate: currentBuyRate,
	currentSellRate: currentSellRate
  }
	
})();


TE.readJsonFile = function(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

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



TE.storeBuyRate = (function () {
	
	var previousBuyRate = 0;
	
	var start = function(callback){
		currentBuyRate = TE.rate.currentBuyRate()
		if(currentBuyRate!=previousBuyRate){
			TE.rateData.push([Date.now(),currentBuyRate])
			callback();
			previousBuyRate = currentBuyRate;
		}
		
	}

  return {
    start: start
  }
	
})();






TE.ticker = (function () {
    
	var intervalID;
	var time = 1000
	
	function play(callback){
		callback();
	}
	
	var start = function(callback) {
		clearInterval(intervalID);
		intervalID = setInterval(play,time,callback);
	};
	
	var stop = function(callback) {
		clearInterval(intervalID);
	};
	
	
  return {
    start: start,
	stop: stop
  }
	
})();



TE.trading = (function () {
	
	// this will trigger with new rate
	var evaluateNewPrice = function(){
			console.log("buyRate : "+TE.rate.currentBuyRate()+" | sellRate: "+TE.rate.currentSellRate())
		
	}
	
	// this will trigger every sec
	var tradingTicker = function(){
		TE.storeBuyRate.start(evaluateNewPrice);
		
	}
    
	var start = function() {
		TE.selectCurrency(TE.config.currency);
		TE.getRateChart(function(){TE.ticker.start(TE.trading.tradingTicker)});
		
	};
	
	var stop = function(num) {
		TE.ticker.stop();
	};
	
	
	var reset = function(url){
		
	}
	
  return {
    start: start,
	stop: stop,
	tradingTicker : tradingTicker
  }
	
})();





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





