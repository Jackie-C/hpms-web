(function($) {
	var apiURL = "https://www.hms-portal.net/kibana/elasticsearch";
	var hourlyPowerJson = null;
	var temperatureBadgeJson = null;
	var humidityBadgeJson = null;
	var powerGraphJson = null;
	var chartSelection = "Total";
        var yLabel = chartSelection;
	
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
				window.location.replace('/login');
			}
		},
		success: function(data) {
			hourlyPowerJson = data;
			//console.log(hourlyPowerJson);
			var totalPowerMonths = hourlyPowerJson.aggregations.per_month.buckets.length;
			var totalPowerDays = hourlyPowerJson.aggregations.per_month.buckets[totalPowerMonths-1].per_day.buckets.length;
			updatePowerElements(totalPowerMonths, totalPowerDays);
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
				window.location.replace('/login');
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
				window.location.replace('/login');
			}
		},
		success: function(data) {
			humidityBadgeJson = data;
			console.log(humidityBadgeJson);
			updateHumidityBadge();
		}
		});
    }
	
	function getPowerGraph() {
        var deviceName = "deviceName: " + "\"" + chartSelection + "\"";
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
		{"size":"0","query":{"bool":{"must":[{"query_string":{"query":deviceName}},{"range":{"timestamp":{"gte":"now-1d","to":"now"}}}]}},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"power":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}}}}}}
		),
		statusCode: {
			401: function () {
				window.location.replace('/login');
			}
		},
		success: function(data) {
			powerGraphJson = data;
			console.log(powerGraphJson);
			var totalHours = powerGraphJson.aggregations.per_hour.buckets.length;
			plotChart(totalHours);
		}
		});
    }
    
    function getSensorsAndPopulateToDropDown() {
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
            {"size":0,"aggs":{"1":{"terms":{"field":"deviceName.keyword","order":{"_term":"desc"}}}}}
			),
            statusCode: {
                    401: function () {
                            window.location.replace('/login');
                    }
            },
            success: function(data) {
                $.each(data.aggregations[1].buckets, function(index, value){
                    $('#dropdown').append($('<option>', { 
                        value: value.key,
                        text : value.key 
                    }));
                });
            }
        });
    }
    
	function updatePowerElements(totalPowerMonths, totalPowerDays) {
		var currentEnergyValue = 		hourlyPowerJson.aggregations.per_month.buckets[totalPowerMonths-1].per_day.buckets[totalPowerDays-1].daily_total.value;
		var previousDayEnergyValue = 	hourlyPowerJson.aggregations.per_month.buckets[totalPowerMonths-1].per_day.buckets[totalPowerDays-2].daily_total.value;
		var currentCostValue = 			hourlyPowerJson.aggregations.per_month.buckets[totalPowerMonths-1].per_day.buckets[totalPowerDays-1].daily_total_cost.value;
		
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
	
	function updateTemperatureBadge() {
		var temperatureValue = temperatureBadgeJson.aggregations.latest.buckets[0].key;
		
		if (temperatureValue === null) {
			$("#temperature").text("Sensor Error");
			$("#temperatureBadge").text("N/A");
		} else {
			$("#temperature").text(Math.round(temperatureValue) + " °C");
			$("#temperatureBadge").text(Math.round(temperatureValue) + "°C");
		}
	}
	
	function updateHumidityBadge() {
		var humidityValue = humidityBadgeJson.aggregations.latest.buckets[0].key;
		
		if (humidityValue === null) {
			$("#humidity").text("Sensor Error");
			$("#humidityBadge").text("N/A");
		} else {
			$("#humidity").text(Math.round(humidityValue) + " %");
			$("#humidityBadge").text(Math.round(humidityValue) + "%");
		}
	}
        
	function getChartData(totalHours){
		var currentDayBuckets = powerGraphJson.aggregations;
		var chartFormatted = new Array();
		var highestUsageValue = 0;
		var highestUsageTime;

		$.each(currentDayBuckets.per_hour.buckets, function(index, value){
			var perHourData = new Array();
			perHourData.push(value.key);
			perHourData.push(value.power.value);
			chartFormatted.push(perHourData);
			
			if (highestUsageValue < value.power.value){
				highestUsageValue = value.power.value;
				highestUsageTime = value.key;
			}
		});
		
		var peakUsageDateTime = new Date(highestUsageTime);
		if (highestUsageValue === 0) {
			$("#peakUsageHour").text("Sensor Error");
		} else {
			$("#peakUsageHour").text(peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
		}
		return chartFormatted;
	}
	
        // TODO: need to implement which data to use when chartSelection is made.
	function plotChart(totalHours){
            var placeholder = $("#chart_4");
            var data = getChartData(totalHours);
            var dataset = [ { label: chartSelection + " Usage", data: data }];
            var options = getChartOption(yLabel);
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
            yLabel = value;
            switch(value){
                case "TV":
                    value = "Oven";
                    break;
                case "Toaster":
                    value = "Home Entertainment";
                    break;
                case "Kettle":
                    value = "Computer";
                    break;
            }
            chartSelection = value;
            getPowerGraph();
	});
        
	//Get data on page load
	getPowerHourly();
	getLatestTemperature();
	getLatestHumidity();
	getPowerGraph();
	getSensorsAndPopulateToDropDown();
        
	//Auto-refresh every 60 minutes
	setInterval(function(){ getPowerHourly(); }, 3600000);
	setInterval(function(){ getPowerGraph(); }, 3600000);
	
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