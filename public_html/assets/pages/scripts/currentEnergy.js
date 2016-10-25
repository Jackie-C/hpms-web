(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var jsonObject2 = null;

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
			jsonObject2 = data;
			console.log(jsonObject2);
			var totalDays = jsonObject2.aggregations.per_month.buckets[0].per_day.buckets.length;
			updatePowerElements(totalDays);
			plotChart("Energy", totalDays);
		}
		});
    }
	
	function updatePowerElements(totalDays) {
		$("#dailyRunningTotal").text("$ " + Math.round10(jsonObject2.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1].daily_total_cost.value, -2).toFixed(2));
	}
        
        function getChartData(totalDays){
            var currentDayBuckets = jsonObject2.aggregations.per_month.buckets[0].per_day.buckets[totalDays-1];
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
            $("#peakUsageHour").text(peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
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
                    fillColor: 'rgba(34, 137, 211, 0.4)'
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
                    axisLabel: 'Date & Time (UTC)'
                }],
            yaxes: [{
                    position: 'left',
                    axisLabel: category + ' (kWh)'
                }]
            };
        }
        
	getPower(); //Get data on page load
	
	setInterval(function(){ getPower(); }, 60000); //Auto-refresh every 60 seconds
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();