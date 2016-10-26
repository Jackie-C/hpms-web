(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var powerJsonObject = null;
	var weatherJsonObject = null;

	function getPower() {
        $.ajax({
		url: apiURL + "/hms-homeuser1-2016-09-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1",
			"accept": "*/*"
		},
		data: JSON.stringify(
		{"size":"0","query":{"range":{"timestamp":{"gte":"2016-09-24"}}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000 * 0.28","lang":"expression"}}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		success: function(data) {
			powerJsonObject = data;
			console.log(powerJsonObject);
			var totalDays = powerJsonObject.aggregations.per_month.buckets[0].per_day.buckets.length;
			updatePowerElements(totalDays);
		}
		});
    }
	
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
			updateWeatherElements(totalDays, totalHours);
			plotChart("Temperature", totalDays);
		}
		});
    }
	
	function updatePowerElements(totalDays) {
		$("#currentEnergyUsageBadge").text(Math.round10(powerJsonObject.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1].daily_total.value, -1) + "kWh");
		$("#previousDayEnergyUsageBadge").text(Math.round10(powerJsonObject.aggregations.per_month.buckets[0].per_day.buckets[totalDays-2].daily_total.value, -1) + "kWh");
	}
	
	function updateWeatherElements(totalDays, totalHours) {
		$("#temperatureBadge").text(Math.round(weatherJsonObject.aggregations.per_day.buckets[totalDays-1].per_hour.buckets[totalHours-1].temperature.value) + "°C");
		$("#humidityBadge").text(Math.round(weatherJsonObject.aggregations.per_day.buckets[totalDays-1].per_hour.buckets[totalHours-1].humidity.value) + "%");
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
			perHourData.push(value.temperature.value);
			chartFormatted.push(perHourData);
			
			// find highest temperature and time
			if (highestUsageValue < value.temperature.value){
				highestUsageValue = value.temperature.value;
				highestUsageTime = value.key;
			}
			
			// find lowest temperature and time
			if (lowestUsageValue === 0){
				lowestUsageValue = value.temperature.value;
				lowestUsageTime = value.key;
			} else if (lowestUsageValue > value.temperature.value){
				lowestUsageValue = value.temperature.value;
				lowestUsageTime = value.key;
			}
		});
		
		var peakUsageDateTime = new Date(highestUsageTime);
		var lowestUsageDateTime = new Date (lowestUsageTime);
		$("#minTemp").text(Math.round(lowestUsageValue)+ '°C' + " at " + lowestUsageDateTime.getUTCHours() + ":" + (lowestUsageDateTime.getUTCMinutes()<10?'0':'') + lowestUsageDateTime.getUTCMinutes());
		$("#maxTemp").text(Math.round(highestUsageValue)+ '°C' + " at " + peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
		return chartFormatted;
	}
	
	function plotChart(category, totalDays){
		var placeholder = $("#chart_4");
		var data = getChartData(totalDays);
		var dataset = [ { label: category + " Usage", data: data }];
		var options = getChartOption(category);
                changeTicksSizeOnMobile(options);
		$.plot(placeholder, dataset, options);
	}
        
        // to prevent overlapping of x-axis labels.
         // 415 is to handle iphone 6 plus or nexus 5X
        function changeTicksSizeOnMobile(options){
            if ($(window).width() < 415){
                options.xaxis.ticks = 3;
            }
        }
	
	function getChartOption(category){
		return options = {
		series: {
			lines: { 
				show: true, 
				fill: true,
				fillColor: 'rgba(22, 192, 192, 0.4)'
			},
			points: { show: true }
		},
		xaxis: {
			mode: "time",
			timeformat: "%d/%m/%y %H:%M",
			minTickSize: [1, "hour"],
			labelWidth: 50
			//timezone: "browser"
		},
		axisLabels: {
				show: true
			},
		xaxes: [{
				axisLabel: 'Date & Time (UTC)'
			}],
		yaxes: [{
				position: 'left',
				axisLabel: category + ' (°C)'
			}]
		};
	}
        
	//Get data on page load
	getPower();
	getWeather();
	
	//Auto-refresh every 60 seconds
	setInterval(function(){ getPower(); }, 60000); 
	setInterval(function(){ getWeather(); }, 60000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();