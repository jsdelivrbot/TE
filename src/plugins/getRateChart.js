9//
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


