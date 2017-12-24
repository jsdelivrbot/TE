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
