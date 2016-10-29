(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var powerJsonObject1 = null;
	var powerJsonObject2 = null;
	var weatherJsonObject1 = null;
	var weatherJsonObject2 = null;
	var chartSelection = null;
	var plot = null;
        
	function getPowerHourly() {
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
			powerJsonObject1 = data;
			console.log(powerJsonObject1);
			var totalDays = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets.length;
			updatePowerElements(totalDays);
			plotChart("Energy");
		}
		});
    }
	
	function getWeatherHourly() {
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
		{"size":"0","query":{"bool":{"must":[{"range":{"timestamp":{"gte":"now-14d","to":"now"}}}],"must_not":[{"range":{"timestamp":{"gte":"2016-09-26","lte":"2016-10-11"}}}]}},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"temperature":{"avg":{"field":"temperature"}},"humidity":{"avg":{"field":"humidity"}}}}}}}}
		),
		success: function(data) {
			weatherJsonObject1 = data;
			console.log(weatherJsonObject1);
		}
		});
    }
	
	function getWeatherPerMinute() {
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
		{"query":{"bool":{"must":[{"range":{"timestamp":{"gte":"now-3h","to":"now"}}}],"must_not":[{"range":{"timestamp":{"gte":"2016-09-26","lte":"2016-10-11"}}}]}},"aggs":{"per_minute":{"date_histogram":{"field":"timestamp","interval":"minute"},"aggs":{"temperature":{"avg":{"field":"temperature"}},"humidity":{"avg":{"field":"humidity"}}}}}}
		),
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
		var monthlyCostValue = powerJsonObject1.aggregations.per_month.buckets[0].monthly_total_cost.value;
		
		if (currentEnergyValue === null) {
			$("#currentEnergyUsage").text("Sensor Error");
			$("#currentEnergyUsageBadge").text("N/A");
		} else {
			$("#currentEnergyUsage").text(Math.round10(currentEnergyValue, -2) + " kWh");
			$("#currentEnergyUsageBadge").text(Math.round10(currentEnergyValue, -1) + "kWh");
		}
		
		if (previousDayEnergyValue === null) {
			$("#previousDayEnergyUsage").text("Sensor Error");
			$("#previousDayEnergyUsageBadge").text("N/A");
		} else {
			$("#previousDayEnergyUsage").text(Math.round10(previousDayEnergyValue, -2) + " kWh");
			$("#previousDayEnergyUsageBadge").text(Math.round10(previousDayEnergyValue, -1) + "kWh");
		}
		
		if (currentCostValue === null) {
			$("#dailyRunningTotal").text("Sensor Error");
		} else {
			$("#dailyRunningTotal").text("$ " + Math.round10(currentCostValue, -2).toFixed(2));
		}
		
		if (monthlyCostValue === null) {
			$("#monthlyRunningTotal").text("Sensor Error");
		} else {
			$("#monthlyRunningTotal").text("$ " + Math.round10(monthlyCostValue, -2).toFixed(2));
		}
	}
	
	function updateWeatherElements(totalMinutes) {
		var temperatureValue = weatherJsonObject2.aggregations.per_minute.buckets[totalMinutes-1].temperature.value;
		var humidityValue = weatherJsonObject2.aggregations.per_minute.buckets[totalMinutes-1].humidity.value;
		
		if (temperatureValue === null) {
			$("#temperature").text("Sensor Error");
			$("#temperatureBadge").text("N/A");
		} else {
			$("#temperature").text(Math.round(temperatureValue) + " °C");
			$("#temperatureBadge").text(Math.round(temperatureValue) + "°C");
		}
		
		if (humidityValue === null) {
			$("#humidity").text("Sensor Error");
			$("#humidityBadge").text("N/A");
		} else {
			$("#humidity").text(Math.round(humidityValue) + " %");
			$("#humidityBadge").text(Math.round(humidityValue) + "%");
		}
	}
	
	function updateHardcodeElements() {
		$("#changeMonthlyConsumption").text("50 %");
		$("#largestConsumption").text("Television");
	}
        
	function getChartData(category) {
		switch(category) {
			case "energy":
				var perDayBuckets = powerJsonObject1.aggregations.per_month.buckets[0].per_day.buckets;
				var chartFormatted = new Array();
				
				$.each(perDayBuckets, function(index, value){
					$.each(value.per_hour.buckets, function(index, value){
						var perHourData = new Array();
						perHourData.push(value.key);
						perHourData.push(value.hourly_avg.value);
						chartFormatted.push(perHourData);
					});
				});
				return chartFormatted;
			case "temperature":
				var perDayTempBuckets = weatherJsonObject1.aggregations.per_day.buckets;
				var temperatureChartData = new Array();
				
				$.each(perDayTempBuckets, function(index, value){
				   $.each(value.per_hour.buckets, function(index, value){
					   var temperaturePerHour = new Array();
					   temperaturePerHour.push(value.key);
					   temperaturePerHour.push(value.temperature.value);
					   temperatureChartData.push(temperaturePerHour);
				   });
				});
				return temperatureChartData;
			case "humidity":
				var perDayHumidityBuckets = weatherJsonObject1.aggregations.per_day.buckets;
				var humidityChartData = new Array();
				
				$.each(perDayHumidityBuckets, function(index, value){
				   $.each(value.per_hour.buckets, function(index, value){
					   var humidityPerHour = new Array();
					   humidityPerHour.push(value.key);
					   humidityPerHour.push(value.humidity.value);
					   humidityChartData.push(humidityPerHour);
				   });
				});
				return humidityChartData;
		}
	}
	
	function plotChart(category) {
		if (chartSelection === null){
			var placeholder = $("#chart_poc");
			var data = getChartData(category.toLowerCase());
			var dataset = [ { label: category + " Usage", data: data }];
			var options = getChartOption(category.toLowerCase());
                        changeTicksSizeOnMobile(options);
			plot = $.plot(placeholder, dataset, options);
		} else {
			var placeholder = $("#chart_poc");
			var data = getChartData(chartSelection.toLowerCase());
			var dataset = [ { label: chartSelection + " Usage", data: data }];
			var options = getChartOption(chartSelection.toLowerCase());
                        changeTicksSizeOnMobile(options);
			plot = $.plot(placeholder, dataset, options);
		}
	}
	
	function getChartOption(category) {
		switch (category) {
			case "energy": return options={series:{lines:{show:true,fill:true},points:{show:false, radius: 2}},xaxis:{mode:"time",timeformat:"%d/%m/%y %H:%M",minTickSize:[1,"hour"],labelWidth: 50},axisLabels:{show:true},xaxes:[{axisLabel:'Date & Time (UTC)'}],yaxes:[{position:'left',axisLabel:'Energy (kWh)'}]};
			case "temperature": return options={series:{lines:{show:true,fill:true},points:{show:false, radius: 2}},xaxis:{mode:"time",timeformat:"%d/%m/%y %H:%M",minTickSize:[1,"hour"],labelWidth: 50},axisLabels:{show:true},xaxes:[{axisLabel:'Date & Time (UTC)'}],yaxes:[{position:'left',axisLabel:'Temperature (°C)'}]};
			case "humidity": return options={series:{lines:{show:true,fill:true},points:{show:false, radius: 2}},xaxis:{mode:"time",timeformat:"%d/%m/%y %H:%M",minTickSize:[1,"hour"],labelWidth: 50},axisLabels:{show:true},xaxes:[{axisLabel:'Date & Time (UTC)'}],yaxes:[{position:'left',axisLabel:'Humidity (%)'}]};
  		}
	}
        
        // to prevent overlapping of x-axis labels.
        // 415 is to handle iphone 6 plus or nexus 5X
        function changeTicksSizeOnMobile(options){
            if ($(window).width() < 415){
                options.xaxis.ticks = 3;
            }
        }
        
	$("#energybutton").click(function() {
		chartSelection = "Energy";
		plotChart("Energy");
	});
	
	$("#temperaturebutton").click(function() {
		chartSelection = "Temperature";
		plotChart("Temperature");
	});

	$("#humiditybutton").click(function() {
		chartSelection = "Humidity";
		plotChart("Humidity");
	});
        
	//Get data on page load
	getPowerHourly();
	getWeatherHourly();
	getWeatherPerMinute();
	updateHardcodeElements();
	
	//Auto-refresh every 60 minutes
	setInterval(function(){ getPowerHourly(); }, 3600000); 
	setInterval(function(){ getWeatherHourly(); }, 3600000);
	
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
