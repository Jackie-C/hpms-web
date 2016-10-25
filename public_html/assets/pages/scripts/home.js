(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var jsonObject1 = null;
	var jsonObject2 = null;

    function getWeather() {

        $.ajax({
		url: apiURL + "/hms-homeuser1-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1",
			"accept": "*/*"
		},
		data: JSON.stringify(
		{"query":{"bool":{"must":[{"query_string":{"query":"*","analyze_wildcard":true}},{"range":{"timestamp":{"gte":1451566800000,"lte":1483189199999,"format":"epoch_millis"}}}],"must_not":[]}},"size":0,"aggs":{"1":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"2":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"3":{"avg":{"field":"temperature"}},"4":{"avg":{"field":"humidity"}},"5":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"6":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"7":{"avg":{"script":{"inline":"(doc['voltage'].value * doc['current'].value / 1000 * 0.28)","lang":"expression"}}},"8":{"cardinality":{"field":"sensorName.keyword"}},"9":{"sum":{"script":{"inline":"(doc['voltage'].value * doc['current'].value /1000 * 0.28)","lang":"expression"}}}}}
		),
		success: function(data) {
			jsonObject1 = data;
			console.log(jsonObject1);
			updateWeatherElements();
		}
		});
    }
	
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
		{"size":"0","query":{"range":{"timestamp":{"gte":"2016-09-20"}}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000 * 0.28","lang":"expression"}}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		success: function(data) {
			jsonObject2 = data;
			console.log(jsonObject2);
			var arrayElement = jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets.length;
			updatePowerElements(arrayElement);
			plotChart("Energy");
		}
		});
    }
	
	function updateWeatherElements(arrayElement) {
		$("#temperature").text(Math.round(jsonObject1.aggregations["3"].value));
		$("#humidity").text(Math.round(jsonObject1.aggregations["4"].value));
		$("#changeMonthlyConsumption").text((Math.round(jsonObject1.aggregations["5"].value) / Math.round(jsonObject1.aggregations["6"].value) * 100) + " %");
		$("#largestConsumption").text("Television");
	}
	
	function updatePowerElements(arrayElement) {
		$("#currentEnergyUsage").text(Math.round10(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[arrayElement-1].daily_total.value, -2));
		$("#previousDayEnergyUsage").text(Math.round10(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[arrayElement-2].daily_total.value, -2));
		$("#dailyRunningTotal").text("$ " + Math.round10(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[arrayElement-1].daily_total_cost.value, -2).toFixed(2));
		$("#monthlyRunningTotal").text("$ " + Math.round10(jsonObject2.aggregations["per_month"].buckets[0].monthly_total_cost.value, -2).toFixed(2));
	}
        
        function getChartData(category){
            switch(category){
                case "energy":
                    var perDayBuckets = jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets;
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
                    // TODO: awaiting api call for temperature
                    // SEE ENERGY FOR IMPLEMENTATIONS
                case "humidity":
                    // TODO: awaiting api call for temperature
                    // SEE ENERGY FOR IMPLEMENTATIONS
            }
        }
        
        function plotChart(category){
            var placeholder = $("#chart_poc");
            
            var data = getChartData(category.toLowerCase());
            
            var dataset = [ { label: category + " Usage", data: data }];
            
            var options = getChartOption(category);
            
            $.plot(placeholder, dataset, options);
        }
        
        function getChartOption(category){
            return options = {
            series: {
                lines: { show: true, fill: true},
                points: { show: true }
            },
            xaxis: {
                mode: "time",
                timeformat: "%d/%m/%y %H:%M",
                minTickSize: [1, "hour"],
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
                    axisLabel: category
                }]
            };
        }
        
        $("#temperaturebutton").click(function(){
            plotChart("Temperature");
        });
        
        $("#energybutton").click(function(){
            plotChart("Energy");
        });

        $("#humiditybutton").click(function(){
            plotChart("Humidity");
        });
	
	getWeather();
	getPower();
	setInterval(function(){ getWeather(); }, 60000);
	setInterval(function(){ getPower(); }, 60000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();