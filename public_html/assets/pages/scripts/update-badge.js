(function($) {
	var apiURL = "https://www.hms-portal.net/kibana/elasticsearch";
	var hourlyPowerJson = null;
	var temperatureBadgeJson = null;
	var humidityBadgeJson = null;
	
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
		{"size":"0","query":{"bool":{"must":[{"query_string":{"query":"deviceName: \"Total\""}},{"range":{"timestamp":{"gte":"2016-09-24"}}}],"must_not":[]}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000 * 0.28","lang":"expression"}}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/login')
			}
		},
		success: function(data) {
			hourlyPowerJson = data;
			//console.log(hourlyPowerJson);
			var totalMonths = hourlyPowerJson.aggregations.per_month.buckets.length;
			var totalDays = hourlyPowerJson.aggregations.per_month.buckets[totalMonths-1].per_day.buckets.length;
			updatePowerElements(totalMonths, totalDays);
		}
		});
    }
	
	function getLatestTemperature() {
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
		{"size":0,"aggs":{"latest":{"terms":{"field":"temperature","size":1,"order":{"date":"desc"}},"aggs":{"date":{"max":{"field":"timestamp"}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/login')
			}
		},
		success: function(data) {
			temperatureBadgeJson = data;
			console.log(temperatureBadgeJson);
			updateTemperatureBadge();
		}
		});
    }
	
	function getLatestHumidity() {
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
		{"size":0,"aggs":{"latest":{"terms":{"field":"humidity","size":1,"order":{"date":"desc"}},"aggs":{"date":{"max":{"field":"timestamp"}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/login')
			}
		},
		success: function(data) {
			humidityBadgeJson = data;
			console.log(humidityBadgeJson);
			updateHumidityBadge();
		}
		});
    }
	
	function updatePowerElements(totalMonths, totalDays) {
		var currentEnergyValue = 		hourlyPowerJson.aggregations.per_month.buckets[totalMonths-1].per_day.buckets[totalDays-1].daily_total.value;
		var previousDayEnergyValue = 	hourlyPowerJson.aggregations.per_month.buckets[totalMonths-1].per_day.buckets[totalDays-2].daily_total.value;
		
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
		
	}
	
	function updateTemperatureBadge() {
		var temperatureValue = temperatureBadgeJson.aggregations.latest.buckets[0].key;
		
		if (temperatureValue === null) {
			$("#temperatureBadge").text("N/A");
		} else {
			$("#temperatureBadge").text(Math.round(temperatureValue) + "°C");
		}
	}
	
	function updateHumidityBadge() {
		var humidityValue = humidityBadgeJson.aggregations.latest.buckets[0].key;
		
		if (humidityValue === null) {
			$("#humidityBadge").text("N/A");
		} else {
			$("#humidityBadge").text(Math.round(humidityValue) + "%");
		}
	}
	
	//Get data on page load
	getPowerHourly();
	getLatestTemperature();
	getLatestHumidity();
	
	//Auto-refresh every 60 minutes
	setInterval(function(){ getPowerHourly(); }, 3600000);
	
	//Auto-refresh every 60 seconds
	setInterval(function(){ getLatestTemperature(); }, 60000);
	setInterval(function(){ getLatestHumidity(); }, 60000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();