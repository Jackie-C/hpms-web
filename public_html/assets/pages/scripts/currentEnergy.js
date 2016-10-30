(function($) {
	var apiURL = "https://www.hms-portal.net/kibana/elasticsearch";
	var powerJsonObject1 = null;
	var powerJsonObject2 = null;
	var weatherJsonObject1 = null;
	var weatherJsonObject2 = null;
	var totalPowerDays = 0;
	var chartSelection = "Average";
	
	function getPowerHourly() {
        $.ajax({
		url: apiURL + "/hms-homeuser1-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"kbn-version": "5.0.0-beta1",
			"accept": "*/*"
		},
		xhrFields: {
			withCredentials: true
		},
		data: JSON.stringify(
		{"size":"0","query":{"range":{"timestamp":{"gte":"2016-09-24"}}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000 * 0.28","lang":"expression"}}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/page_user_login_1')
			}
		},
		success: function(data) {
			powerJsonObject1 = data;
			console.log(powerJsonObject1);
			totalPowerDays = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets.length;
			updatePowerElements(totalPowerDays);
			plotChart(totalPowerDays);
		}
		});
    }
	
	function getWeatherPerMinute() {
        $.ajax({
		url: apiURL + "/hms-homeuser1-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"kbn-version": "5.0.0-beta1",
			"accept": "*/*"
		},
		xhrFields: {
			withCredentials: true
		},
		data: JSON.stringify(
		{"query":{"bool":{"must":[{"range":{"timestamp":{"gte":"now-2d","to":"now"}}}],"must_not":[{"range":{"timestamp":{"gte":"2016-09-26","lte":"2016-10-11"}}}]}},"aggs":{"per_minute":{"date_histogram":{"field":"timestamp","interval":"minute"},"aggs":{"temperature":{"avg":{"field":"temperature"}},"humidity":{"avg":{"field":"humidity"}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/page_user_login_1')
			}
		},
		success: function(data) {
			weatherJsonObject2 = data;
			console.log(weatherJsonObject2);
			var totalMinutes = weatherJsonObject2.aggregations.per_minute.buckets.length;
			updateWeatherElements(totalMinutes);
		}
		});
    }
	
	function updatePowerElements(totalDays) {
		var currentEnergyValue = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1].daily_total.value;
		var previousDayEnergyValue = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets[totalDays-2].daily_total.value;
		var currentCostValue = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1].daily_total_cost.value;
		
		if (currentEnergyValue === null) {
			$("#currentEnergyUsageBadge").text("N/A");
		} else {
			$("#currentEnergyUsageBadge").text(Math.round10(currentEnergyValue, -1) + "kWh");
		}
		
		if (previousDayEnergyValue === null) {
			$("#previousDayEnergyUsageBadge").text("N/A");
		} else {
			$("#previousDayEnergyUsageBadge").text(Math.round10(previousDayEnergyValue, -1) + "kWh");
		}
		
		if (currentCostValue === null) {
			$("#dailyRunningTotal").text("Sensor Error");
		} else {
			$("#dailyRunningTotal").text("$ " + Math.round10(currentCostValue, -2).toFixed(2));
		}
	}
	
	function updateWeatherElements(totalMinutes) {
		var temperatureValue = weatherJsonObject2.aggregations.per_minute.buckets[totalMinutes-1].temperature.value;
		var humidityValue = weatherJsonObject2.aggregations.per_minute.buckets[totalMinutes-1].humidity.value;
		
		if (temperatureValue === null) {
			$("#temperatureBadge").text("N/A");
		} else {
			$("#temperatureBadge").text(Math.round(temperatureValue) + "°C");
		}
		
		if (humidityValue === null) {
			$("#humidityBadge").text("N/A");
		} else {
			$("#humidityBadge").text(Math.round(humidityValue) + "%");
		}
	}
        
	function getChartData(totalDays){
		var currentDayBuckets = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1];
		var chartFormatted = new Array();
		var highestUsageValue = 0;
		var highestUsageTime;

		$.each(currentDayBuckets.per_hour.buckets, function(index, value){
			var perHourData = new Array();
			perHourData.push(value.key);
			perHourData.push(value.hourly_avg.value);
			chartFormatted.push(perHourData);
			
			if (highestUsageValue < value.hourly_avg.value){
				highestUsageValue = value.hourly_avg.value;
				highestUsageTime = value.key;
			}
		});
		
		var peakUsageDateTime = new Date(highestUsageTime);
		if (highestUsageValue === 0) {
			$("#peakUsageHour").text("Sensor Error");
			$("#dailyRunningTotal").text("Sensor Error");
		} else {
			$("#peakUsageHour").text(peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
		}
		return chartFormatted;
	}
	
        // TODO: need to implement which data to use when chartSelection is made.
	function plotChart(totalDays){
            var placeholder = $("#chart_4");
            var data = getChartData(totalDays);
            var dataset = [ { label: chartSelection + " Usage", data: data }];
            var options = getChartOption(chartSelection);
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
				fillColor: 'rgba(34, 137, 211, 0.4)'
			},
			points:{show:false, radius: 2}
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
				axisLabel: category + ' (kWh)'
			}]
		};
	}
        
	$('#dropdown').on('change', function(){
		var value = this.value;
		switch(value){
			case "Average":
				chartSelection = "Average";
				plotChart(totalPowerDays);
				break;
			case "Fridge":
				chartSelection = "Fridge";
				plotChart(totalPowerDays - 1);
				break;
			case "Playstation":
				chartSelection = "Playstation";
				plotChart(totalPowerDays - 5);
				break;
			case "AirConditioner":
				chartSelection = "AirConditioner";
				plotChart(totalPowerDays - 6);
				break;
			default:
				alert("choice is not supported");
				break;
		}
	});
        
	//Get data on page load
	getPowerHourly();
	getWeatherPerMinute();
	
	//Auto-refresh every 60 minutes
	setInterval(function(){ getPowerHourly(); }, 3600000); 
	
	//Auto-refresh every 60 seconds
	setInterval(function(){ getWeatherPerMinute(); }, 60000); 
	//setInterval(function(){ getPowerPerMinute(); }, 60000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();