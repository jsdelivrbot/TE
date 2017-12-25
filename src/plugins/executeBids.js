TE.executeBids = (function () {

	var cBuyRate;
	var cSellRate;
	var inProgressBidID;

	var start = function () {
		var currentRate = TE.rate.currentRate();
		cBuyRate = currentRate.buy;
		cSellRate = currentRate.sell;

		var bids = TE.ls.getList();

		for (var i in bids) {
			if (bids[i].action == "buy" && cBuyRate <= bids[i].maxBuy && TE.checkSelectedCurrency.check(bids[i].currency)) {
				triggerBuy(bids[i]);
				break;
			} else if (bids[i].action == "sell" && cSellRate >= bids[i].minSell && TE.checkSelectedCurrency.check(bids[i].currency)) {
				triggerSell(bids[i]);
				break;
			}

		}

	}


	var triggerBuy = function (bidData) {
		inProgressBidID = bidData.id;
		TE.trading.stop();
		TE.buy.trigger(bidData.coinVol, cBuyRate, onBuyComplete);
	}

	var onBuyComplete = function (success, obj) {
		if (success) {
			console.log("orderComplete bought " + obj.coin + " at price " + obj.inr);
			TE.ls.update(inProgressBidID, {
				status: "bought",
				action: "sell",
				boughtAt: cBuyRate
			})
			TE.trading.start()

		} else {
			console.log("error Type : " + obj.type + " | msg : " + obj.msg);

		}
	}



	var triggerSell = function (bidData) {
		inProgressBidID = bidData.id;
		TE.trading.stop();
		TE.sell.trigger(bidData.coinVol, cSellRate, buyCompleteStatus);
	}


	var onSellComplete = function (success, obj) {
		if (success) {
			console.log("orderComplete sold " + obj.coin + " at price " + obj.inr);
			TE.ls.update(inProgressBidID, {
				status: "sold",
				action: "none",
				soldAt: cSellRate
			})
			TE.trading.start()
		} else {
			console.log("error Type : " + obj.type + " | msg : " + obj.msg);
		}
	}


	return {
		check: start
	}

})();

// Usage :

//TE.ls.add({currency:"ripple", action:"buy", minBuy:0, minSell:0})
//TE.ls.update("b1",{status:"inProgress", action:"sell", boughtAt:0})
//TE.ls.update("b1",{status:"sold", action:"none", soldAt:0, profit:1})
