(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var jsonObject2 = null;

	function kibanaQuery2() {
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
		{"size":"0","query":{"bool":{"must":[{"query_string":{"query":"sensorName: \"Kitchen Ambient\"","analyze_wildcard":true}},{"range":{"timestamp":{"gte":"now-30d","to":"now"}}}],"must_not":[]}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"cumulative_day":{"cumulative_sum":{"buckets_path":"hourly_avg"}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000 * 0.28","lang":"expression"}}},"cumulative_day_cost":{"cumulative_sum":{"buckets_path":"hourly_avg_cost"}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"cumulative_monthly_total":{"cumulative_sum":{"buckets_path":"daily_total"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}},"cumulative_monthly_total_cost":{"cumulative_sum":{"buckets_path":"daily_total_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		success: function(data) {
			jsonObject2 = data;
			console.log(jsonObject2);
			updateValues2();
			plotChart("Energy");
		}
		});
    }
	
	function updateValues2() {
		$("#previousDayCost").text("$ " + Math.round10(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[0].daily_total_cost.value, -2));
	}
        
        function getChartData(){
            var currentDayBuckets = jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[0];
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
        
        function plotChart(category){
            var placeholder = $("#chart_4");
            
            var data = getChartData();
            
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
                    fillColor: 'rgba(237, 59, 71, 0.4)'
                },
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
        
	kibanaQuery2();
	setInterval(function(){ kibanaQuery2(); }, 60000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();