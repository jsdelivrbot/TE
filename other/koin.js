function DB(){
        
        var db = openDatabase('exchange', '1.0', 'koinx', 2 * 1024 * 1024);
        
        var webSQL={
        
        deleteTable:function(table){
            db.transaction(function (t) {
                 t.executeSql('DROP TABLE "'+table+'"',[], 
                     function(t,results){
                         console.error("Table Dropped")
                     },
                     function(t,error){
                         console.error("Error: " + error.message)
                     }
                 )
            })
        },
        insterData:function(table,buyStore){

            db.transaction(function (tx) {
               // tx.executeSql('CREATE TABLE IF NOT EXISTS buyStore (buyStore)');
                tx.executeSql('INSERT INTO "'+table+'" VALUES (?,?,?,?,?)',[
                    buyStore.investedMoney,
                    buyStore.buyPrice,
                    buyStore.volume,
                    (buyStore.gainedBidProfit || buyStore.minSellPrice),
                    (buyStore.soldAt || buyStore.dynamicSalePrice)
                 ])   
                console.log('inserted:',buyStore);            
            });
        },
        createTable:function(table){

            db.transaction(function (tx) {
                tx.executeSql('CREATE TABLE IF NOT EXISTS "'+table
                    +'" (investedmoney,buyprice,volume,profit,soldat)');
                console.log('table created-',table);            
            });
        },
        deleteData:function(table){

            db.transaction(function (tx) {
                tx.executeSql('delete * from "'+table+'"');
                console.log('data delete ',table);            
            });
        },
        getData:function(table){
            db.transaction(function (tx) {
            tx.executeSql('SELECT * FROM "'+table+'"', [], function (tx, results) {
               var len = results.rows.length, i;
               msg = "<p>Found rows: " + len + "</p>";
               console.log(msg);
                    
               for (i = 0; i < len; i++){
                  console.log(results.rows[i]);                  
               }
            }, null);
         });
        }
    }
    return webSQL;

    }
    
function test(){
  this.ran = this.ran ||  1;
  this.ran++;
  tradingEngine.config.profitMargin=500;
  tradingEngine.config.lossMargin=10000;
  tradingEngine.config.totalBids = 2;
  var random = Math.floor((Math.random() * 45000) + 1);
  return{
    ask : random,
    bid : random+this.ran
    }
}

tradingEngine = (function(win) {
    if(window !== top){
       return;
    }
    var config = {
        runningBids:[],
        soldBids:[],
        profitMargin:  900,
        profitPercent:  .80,//1+.25,//trade fee .25
        askPriceMargin:100,
        askPriceMargin3:1500,//1700,
        askPriceMargin5:2500,//2700,       
        lossMargin: 83000,
        bookingAmount: -1,
        totalBids: 2,
        currentBid: 1,
        startNextBiddingInterval: 3000,
        tradingFee:.25,
        busniessLogic:"avgProfit",
        currency: "bitcoincash"
    };
    var exchange = {

        koinx: {
            pageFocus:function(){
                /*
                try{
                    if(!this.graph){
                        document.getElementsByClassName("intervel")[0].getElementsByTagName("li")[0].click();
                        this.graph = 1;
                    }
                    else {
                        document.getElementsByClassName("intervel")[0].getElementsByTagName("li")[1].click();
                        this.graph = 0;
                    }  

                }catch(e){
                    window.location.reload(true);
                }*/
                this.counter = this.counter || 1;
                if(this.counter>100){
                    this.counter =0;
                    //window.location.reload(true);
                    var img = new new Image();
                    img.src = "https://koinex.in/partner.jpg?id="+Math.floor((Math.random() * 45000) + 1)
                }else{
                    this.counter++;
                }
            },
            isPendingBuy:function(){
                try{
                    var pendingTable =document.getElementsByClassName("col-lg-12 padding-left-right-15 ng-scope")[0];
                    if(pendingTable){
                        var td = pendingTable.querySelectorAll("td");
                        if(td.length>5 && td[5].innerHTML == "buy"){
                            return true;    
                        }
                    }

                }catch(e){
                    //window.location.reload(true);
                }
                    
                return false;
            },
            getLivePrice: function() {
                    try{
                        var askPrice = document.getElementsByClassName("balance")[1].innerHTML;
                        askPrice = askPrice.split(":")[1].replace(/,/g, "");
                        askPrice = Number(askPrice);
                        var bidPrice = document.getElementsByClassName("balance")[3].innerHTML;
                        bidPrice = bidPrice.split(":")[1].replace(/,/g, "");
                        bidPrice = Number(bidPrice);
                        return {
                            ask: askPrice,
                            bid: bidPrice,
                            diff: askPrice-bidPrice
                        }
                        /*
                        var teamp = test();
                        return {
                            ask:  teamp.ask,
                            bid: teamp.bid,
                            diff: teamp.ask-teamp.bid
                        }*/
                    }catch(e){
                        //window.location.reload(true);
                    }

            },
            buy: function(price, bid,callBack) {
                
             /*   var input = $('input');
                input[0].value = price;
                input[1].value = bid;
                input.trigger('input'); // Use for Chrome/Firefox/Edge
                input.trigger('change'); // Use for Chrome
                document.getElementsByClassName("ask-button")[0].click();
                this.confirmId = setInterval(function(){
                    if(document.getElementsByClassName("ladda-button") && document.getElementsByClassName("ladda-button")[0].getAttribute("ladda") == "ladda"){
                        document.getElementsByClassName("ladda-button")[0].click();
                        clearInterval(this.confirmId);
                        callBack();
                    }

                }.bind(this),500);
                */
                callBack();

            },
            sold: function(volume, bid,callBack) {
                callBack();//remove after testing
                ////////////////////////////
               /*
                var input = $('input');
                input[2].value = Number(volume).toPrecision(3);
                input[3].value = bid;
                input.trigger('input'); // Use for Chrome/Firefox/Edge
                input.trigger('change'); // Use for Chrome
                document.getElementsByClassName("ask-button")[1].click();
                this.sellConfirmId = setInterval(function(){
                    if(document.getElementsByClassName("ladda-button") && document.getElementsByClassName("ladda-button")[0].getAttribute("ladda") == "ladda"){
                        document.getElementsByClassName("ladda-button")[0].click();
                        clearInterval(this.sellConfirmId);
                        callBack();
                    }

                }.bind(this),500);
*/
                

            },

            bitcoincash: {
                downPriceDiff:300,
                profitPercent:  .80,
                triggerBuy:[{down:2000},{down:5000},{down:10000},{down:15000},{down:20000}],
                volume:.01,
                
                bookBid:function(bidObj){                          
                    
                    config.currency = getCurrency();                    
                    
                    if(!localStorage[config.currency+"triggerBuy"]){
                        localStorage.setItem(config.currency+"triggerBuy",JSON.stringify(this.triggerBuy));
                    }
                    busniessLogic[tradingEngine.config.busniessLogic].bookBid(bidObj,this);                    
                },
                buy:function(bidObj,bookingAmount,callBack){
                    tradingEngine.koinx.buy(bidObj,bookingAmount,callBack)
                },
                sold:function(volume, bid,callBack){
                    tradingEngine.koinx.sold(volume, bid,callBack);
                },
                sellBid:function(){
                    
                    if(!localStorage[config.currency+"triggerBuy"]){
                        localStorage.setItem(config.currency+"triggerBuy",JSON.stringify(tradingEngine.koinx.bitcoincash.triggerBuy));
                    }
                    
                     this.sellBidId = setInterval(function(){
                        busniessLogic[tradingEngine.config.busniessLogic].sellBid(this);
                    }.bind(this), config.startNextBiddingInterval);
                },
                pageFocus:function(){
                    return tradingEngine.koinx.pageFocus();
                },
                getLivePrice:function(){
                  return tradingEngine.koinx.getLivePrice();  
                },
                isPendingBuy:function(){
                  return tradingEngine.koinx.isPendingBuy();    
                },
                stopBid : function(id){
                    clearInterval(id);
                }
            },
            ripple: {
                downPriceDiff:.2,
                profitPercent:  1,
                volume:50,
                bookBid:function(bidObj){
                    busniessLogic[tradingEngine.config.busniessLogic].bookBid(bidObj,this);                    
                },
                buy:function(bidObj,bookingAmount,callBack){
                    tradingEngine.koinx.buy(bidObj,bookingAmount,callBack)
                },
                sold:function(volume, bid,callBack){
                    tradingEngine.koinx.sold(volume, bid,callBack);
                },
                sellBid:function(){
                     this.sellBidId = setInterval(function(){
                        busniessLogic[tradingEngine.config.busniessLogic].sellBid(this);
                    }.bind(this), config.startNextBiddingInterval);
                },
                pageFocus:function(){
                    return tradingEngine.koinx.pageFocus();
                },
                getLivePrice:function(){
                  return tradingEngine.koinx.getLivePrice();  
                },
                isPendingBuy:function(){
                  return tradingEngine.koinx.isPendingBuy();    
                },
                stopBid : function(id){
                    clearInterval(id);
                }

            },
            litecoin: {
                downPriceDiff:300,
                profitPercent:  .80,
                triggerBuy:[{down:2000},{down:5000},{down:10000},{down:15000},{down:20000}],
                volume:.01,
                
                bookBid:function(bidObj){                          
                    
                    config.currency = getCurrency();
                    if(!localStorage[config.currency+'triggerBuy']){
                        localStorage.setItem(config.currency+"triggerBuy",JSON.stringify(this.triggerBuy));
                    }                                     
                    busniessLogic[tradingEngine.config.busniessLogic].bookBid(bidObj,this);                    
                },
                buy:function(bidObj,bookingAmount,callBack){
                    tradingEngine.koinx.buy(bidObj,bookingAmount,callBack)
                },
                sold:function(volume, bid,callBack){
                    tradingEngine.koinx.sold(volume, bid,callBack);
                },
                sellBid:function(){
                    
                    if(!localStorage[config.currency+'triggerBuy']){
                        localStorage.setItem(config.currency+"triggerBuy",JSON.stringify(tradingEngine.koinx.litecoin.triggerBuy));
                    }
                     this.sellBidId = setInterval(function(){
                        busniessLogic[tradingEngine.config.busniessLogic].sellBid(this);
                    }.bind(this), config.startNextBiddingInterval);
                },
                pageFocus:function(){
                    return tradingEngine.koinx.pageFocus();
                },
                getLivePrice:function(){
                  return tradingEngine.koinx.getLivePrice();  
                },
                isPendingBuy:function(){
                  return tradingEngine.koinx.isPendingBuy();    
                },
                stopBid : function(id){
                    clearInterval(id);
                }
                
            }
        }
    }
    var busniessLogic = {
        
        avgProfit:{
            config:{
                
            },
            buyStore:{
                investedMoney:0,
                buyPrice:0,
                minSellPrice:0,
                dynamicSalePrice:0,
                volume:0,
                buyBidsAt:[]              
            },
            initByStore:function(){
                var init = {
                        investedMoney:0,
                        buyPrice:0,
                        minSellPrice:0,
                        dynamicSalePrice:0,
                        volume:0,
                        buyBidsAt:[]              
                    };
             this.buyStore = init;       
                
            },            
            stopBid : function(id){
                clearInterval(id);
            },
            bookBid: function(bidObj,exchange){                    
                var bookingAmount = bidObj.price - (bidObj.askPriceMargin || config.askPriceMargin);
                var volume = ( bidObj.volume + Number(this.buyStore.volume));
                this.buyStore.investedMoney=( (bidObj.volume * bookingAmount)
                                   +(this.buyStore.investedMoney));
                this.buyStore.volume = volume.toPrecision(2);
                this.buyStore.buyBidsAt.push(bookingAmount);
                this.buyStore.buyPrice = this.buyStore.investedMoney/this.buyStore.volume;
                
                var perVolume =  this.buyStore.investedMoney/this.buyStore.volume;
                var profitPercent =  (perVolume*(exchange.profitPercent)/100);
                var sellPrice = (perVolume+profitPercent);

                this.buyStore.dynamicSalePrice = this.buyStore.minSellPrice = sellPrice;
                
                var sellAfterBook = function(){
                    localStorage.setItem(config.currency, JSON.stringify(this.buyStore));
                    db.insterData("buy",this.buyStore);
                    if(!exchange.sellBidId){
                        exchange.sellBid();
                    }
                }
                exchange.buy(bidObj.volume,bookingAmount,sellAfterBook.bind(this));
                console.log(this.buyStore);
                
            },            
            sellBid :function(exchange) {
                if(getCurrency() !== config.currency){
                    return;
                }
                try{
                    exchange.pageFocus();            
                    if(localStorage[config.currency]){
                        this.buyStore = JSON.parse(localStorage[config.currency]);
                    }
                    if(this.buyStore.sold){                    
                        this.stopBid(exchange.sellBidId);
                        exchange.sellBidId = 0;
                        localStorage.clear(localStorage[config.currency]);
                        localStorage.clear(localStorage[config.currency+"triggerBuy"]);
                        this.initByStore();
                        return;
                    }

                    var livePrice= exchange.getLivePrice();
                    if(exchange.isPendingBuy()){
                        return;
                    }
                    //this.canBookAnotherBid(livePrice,exchange);
                    //console.log(livePrice);                    
                    var buyBid = this.buyStore
                    if(livePrice.bid >= buyBid.minSellPrice) {
                        //bid i gain profit lets wait for more profit; 
                        if(buyBid.dynamicSalePrice < livePrice.bid){
                            buyBid.dynamicSalePrice = livePrice.bid;
                        }
                        else{
                            if(buyBid.dynamicSalePrice - livePrice.bid <exchange.downPriceDiff){
                                return;
                            }   
                        }
                        console.log("--Profit----Gain-----"+buyBid.dynamicSalePrice*buyBid.volume);
                              
                                             
                    }

                    if( buyBid.dynamicSalePrice > livePrice.bid  //profit is greater from live price first down
                        && buyBid.minSellPrice <= livePrice.bid // sell price achived
                        //&& livePrice.bid >= buyBid.losePrice // we dont want to sell in min lose

                        ) 
                    {
                        //bid i gain profit but first down fall;
                        //sellHere
                        buyBid.gainedBidProfit = livePrice.bid - buyBid.buyPrice;
                        buyBid.soldAt = livePrice.bid;
                        console.log("-------Profit--sold at-------"+livePrice.bid);
                        console.log("profit sold at",this.buyStore);
                        var sellCallback = function(){
                              console.log("-------Profit----callback- book end----");
                              config.soldBids.push(JSON.stringify(this.buyStore));
                              db.insterData("sold",this.buyStore);
                              console.log(config.soldBids);
                              this.stopBid(exchange.sellBidId);
                              exchange.sellBidId = 0;
                              localStorage.clear(localStorage[config.currency]);
                              this.initByStore();
                              //{price:  96500.00, volume: .01, askPriceMargin: -1, profitMargin: 200}
                              //this.bookBid({price:  livePrice.ask , volume: exchange.volume},exchange);                                                              
                              //book another bid here
                        }
                        
                        exchange.sold(buyBid.volume,livePrice.bid,sellCallback.bind(this));
                        
                    }
                    localStorage.setItem(config.currency, JSON.stringify(this.buyStore));  
                }
                catch(e){
                    // window.location.reload(true);
                }               

               // console.log(this.buyStore);                
            },
            canBookAnotherBid :function(livePrice,exchange){
                var runningBid = this.buyStore;
                var triggerBuy = JSON.parse(localStorage[config.currency+"triggerBuy"]);
                for (var i = triggerBuy.length - 1; i >= 0; i--) {
                    if(livePrice.ask <= ( Number(runningBid.buyBidsAt[0]) - triggerBuy[i].down) 
                        && !triggerBuy[i].buy)
                    {
                         triggerBuy[i].buy = true;
                         localStorage.setItem(config.currency+"triggerBuy",JSON.stringify(triggerBuy));
                         console.log("Book here another bid bcoz price down "+livePrice.ask);
                         this.bookBid({price:livePrice.ask,volume:(runningBid.volume*2)},exchange);
                    }               
                }                
            }
        }
        
    }
    
    var tradingEngine = {
        config : config,
        koinx : exchange.koinx
    }
    function getCurrency(){
        if(window.location.href.search("ripple")>0){
            return "ripple";
        }
        if(window.location.href.search("bitcoin_cash")>0){
            return "bitcoincash";
        }
        if(window.location.href.search("ether")>0){
            return "ether";
        }
        if(window.location.href.search("bitcoin")>0){
            return "bitcoin";
        }
        if(window.location.href.search("litecoin")>0){
            return "litecoin";
        }
    }
    config.currency = getCurrency();
    
    if(localStorage[config.currency]){
        tradingEngine.koinx[config.currency].sellBid();        
    }
    window.db =new DB();
    db.createTable("sold");  
    db.createTable("buy"); 
    return tradingEngine;

})(window)
        