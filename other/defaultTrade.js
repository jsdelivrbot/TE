defaultTrading: {
            
            stopBid : function(id){
                clearInterval(id);
            },
            log: function(bids){
                console.log("We have Total Bid : "+ (bids.length)+"-----------------");
                console.log(bids);    
                // for(var i = 0; i < bids.length; i++) {                    
                //     console.log("Bid : "+ (i+1)+" ---------------------");
                //     var buyBid = bids[i];
                //     console.log(buyBid);
                //     // for(var k in buyBid){
                //     //     console.log(k +" : "+  buyBid[k]);
                //     // }
                // }
            },
            bookBid: function(bidObj,exchange){
                var bookingAmount = bidObj.price - (bidObj.askPriceMargin || config.askPriceMargin);
                var profitPercent = (bidObj.volume *bookingAmount * (config.profitPercent))/100;
                //var sellPrice = bidObj.price + (bidObj.profitMargin || config.profitMargin);
                var sellPrice = bookingAmount + profitPercent;
                var losePrice = bookingAmount - (bidObj.lossMargin || config.lossMargin);
                config.runningBids.push(
                    {   bookingAt: bookingAmount,
                        sellPrice: sellPrice,
                        askPrice:bidObj.price,
                        volume:    bidObj.volume,                        
                        losePrice: losePrice
                        
                    });
                var sellAfterBook = function(){
                    if(!exchange.sellBidId){
                        exchange.sellBid();
                    }
                }
                exchange.buy(bidObj.volume,bookingAmount,sellAfterBook.bind(this));
                this.log(config.runningBids);
                
            },            
            sellBid :function(exchange) {
                var random = Math.floor((Math.random() * 100) + 1);
                //window.scroll(1,random);// hac to focus                
                if(config.runningBids.length == 0){                    
                    this.stopBid(exchange.sellBidId);
                    exchange.sellBidId = 0;
                    return;
                }
                var livePrice= exchange.getLivePrice();
                if(exchange.isPendingBuy()){
                    return;
                }
                this.canBookAnotherBid(livePrice,exchange);
                console.log(livePrice);
                for(var i = 0; i < config.runningBids.length; i++) {
                    
                    var buyBid = config.runningBids[i];
                    if(livePrice.bid >= buyBid.sellPrice) {
                        //bid i gain profit lets wait for more profit; 
                        if(buyBid.priceUP && buyBid.priceUP < livePrice.bid){
                            buyBid.priceUP = livePrice.bid;
                        }
                        else if(!buyBid.priceUP){
                            buyBid.priceUP = livePrice.bid;
                        }
                    }

                    if(    buyBid.priceUP //we have some profit 
                        && buyBid.priceUP > livePrice.bid  //profit is greater from live price
                        && buyBid.sellPrice <= livePrice.bid // sell price achived
                        && livePrice.bid >= buyBid.losePrice // we dont want to sell in min lose

                        ) 
                    {
                        //bid i gain profit but first down fall;
                        //sellHere
                        buyBid.priceUP = livePrice.bid;
                        buyBid.gainedBidProfit = livePrice.bid - buyBid.bookingAt;
                        buyBid.soldAt = livePrice.bid;
                        config.soldBids.push(buyBid);
                        config.runningBids.splice(i,1);
                        var sellCallback = function(){
                            console.log("-------Profit---------");
                              this.log(config.soldBids);
                              //book another bid here
                        }
                        exchange.sell(buyBid.volume,livePrice.bid,sellCallback.bind(this));
                        
                    }
                    if(  livePrice.bid <= buyBid.losePrice) 
                    {
                        // lose sellHere
                        buyBid.bidLose = buyBid.bookingAt - livePrice.bid;
                        buyBid.soldAt = livePrice.bid;
                        config.soldBids.push(buyBid);
                        config.runningBids.splice(i,1);
                        console.log("-----Lose------");
                        this.log(config.soldBids);
                    }
                }
                this.log(config.runningBids);
                
            },
            canBookAnotherBid : function(livePrice,exchange){
                if(config.runningBids.length >= config.totalBids){
                    return;
                }
                var runningBid = config.runningBids[config.runningBids.length-1]
                if(livePrice.ask <= (runningBid.askPrice - config.askPriceMargin5)){
                     console.log("Book here another bid bcoz price down 5");
                    //this.bookBid({price:livePrice.ask,volume:(runningBid.volume*5)},exchange);

                } else if(livePrice.ask <= (runningBid.askPrice - config.askPriceMargin3)){
                     console.log("Book here another bid bcoz price down 3");
                    //this.bookBid({price:livePrice.ask,volume:(runningBid.volume*3)},exchange);
                }
            
            },
            restartBuying : function(exchange) {
                
            },          
        }