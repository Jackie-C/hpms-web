(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var weatherJsonObject = null;

	function getWeather() {
        $.ajax({
		url: apiURL + "/hms-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1",
			"accept": "*/*"
		},
		data: JSON.stringify(
		{"size":"0","query":{"bool":{"must":[{"range":{"timestamp":{"gte":"now-7d","to":"now"}}}],"must_not":[{"range":{"timestamp":{"gte":"2016-09-26","lte":"2016-10-11"}}}]}},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"temperature":{"avg":{"field":"temperature"}},"humidity":{"avg":{"field":"humidity"}}}}}}}}
		),
		success: function(data) {
			weatherJsonObject = data;
			console.log(weatherJsonObject);
			var totalDays = weatherJsonObject.aggregations.per_day.buckets.length;
			var totalHours = weatherJsonObject.aggregations.per_day.buckets[totalDays-1].per_hour.buckets.length;
			plotChart("Humidity", totalDays);
		}
		});
    }
	
        function getChartData(totalDays){
            var currentDayBuckets = weatherJsonObject.aggregations.per_day.buckets[totalDays-1];
            var chartFormatted = new Array();
            var highestUsageValue = 0;
            var highestUsageTime;
            var lowestUsageValue = 0;
            var lowestUsageTime;

            $.each(currentDayBuckets.per_hour.buckets, function(index, value){
                var perHourData = new Array();
                perHourData.push(value.key);
                perHourData.push(value.humidity.value);
                chartFormatted.push(perHourData);
                
                // find highest temperature and time
                if (highestUsageValue < value.humidity.value){
                    highestUsageValue = value.humidity.value;
                    highestUsageTime = value.key;
                }
                
                // find lowest temperature and time
                if (lowestUsageValue === 0){
                    lowestUsageValue = value.humidity.value;
                    lowestUsageTime = value.key;
                } else if (lowestUsageValue > value.humidity.value){
                    lowestUsageValue = value.humidity.value;
                    lowestUsageTime = value.key;
                }
            });
            
            var peakUsageDateTime = new Date(highestUsageTime);
            var lowestUsageDateTime = new Date (lowestUsageTime);
            $("#minHumidity").text(Math.round(lowestUsageValue)+ '%' + " " + lowestUsageDateTime.getUTCHours() + ":" + (lowestUsageDateTime.getUTCMinutes()<10?'0':'') + lowestUsageDateTime.getUTCMinutes());
            $("#maxHumidity").text(Math.round(highestUsageValue)+ '%' + " " + peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
            return chartFormatted;
        }
        
        function plotChart(category, totalDays){
            var placeholder = $("#chart_4");
            var data = getChartData(totalDays);
            var dataset = [ { label: category + " Usage", data: data }];
            var options = getChartOption(category);
            $.plot(placeholder, dataset, options);
        }
        
        function getChartOption(category){
            return options = {
            series: {
                lines: { 
                    show: true, 
                    fill: true,
                    fillColor: 'rgba(115, 61, 169, 0.4)'
                },
                points: { show: true }
            },
            xaxis: {
                mode: "time",
                timeformat: "%d/%m/%y %H:%M",
                minTickSize: [1, "hour"],
                labelWidth: 10
                //timezone: "browser"
            },
            axisLabels: {
                    show: true
                },
            xaxes: [{
                    axisLabel: 'Date & Time'
                }],
            yaxes: [{
                    position: 'left',
                    axisLabel: category + ' (%)'
                }]
            };
        }
        
	getWeather(); //Get data on page load
	
	setInterval(function(){ getWeather(); }, 60000); //Auto-refresh every 60 seconds
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();