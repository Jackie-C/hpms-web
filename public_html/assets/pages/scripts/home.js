(function($) {
	var jsonObject1 = ;
	var jsonObject2 = ;

    function kibanaQuery1() {

        $.ajax({
		url: "/kibana/elasticsearch/hms-homeuser1-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1",
			"accept": "application/json, text/plain, */*"
		},
		data: JSON.stringify(
		{"query":{"bool":{"must":[{"query_string":{"query":"*","analyze_wildcard":true}},{"range":{"timestamp":{"gte":1451566800000,"lte":1483189199999,"format":"epoch_millis"}}}],"must_not":[]}},"size":0,"aggs":{"1":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"2":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"3":{"avg":{"field":"temperature"}},"4":{"avg":{"field":"humidity"}},"5":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"6":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"7":{"avg":{"script":{"inline":"(doc['voltage'].value * doc['current'].value * 0.25) / 1000","lang":"expression"}}},"8":{"cardinality":{"field":"sensorName.keyword"}},"9":{"sum":{"script":{"inline":"(doc['voltage'].value * doc['current'].value * 0.25) / 1000","lang":"expression"}}}}}
		),
		success: function(data) {
			jsonObject1 = data;
			console.log(jsonObject1);
			updateValues1();
		}
		});
    }
	
	function kibanaQuery2() {

        $.ajax({
		url: "/kibana/elasticsearch/hms-*/_search",
		type: "POST",
		contentType: "application/json; charset=UTF-8",
		dataType: 'json',
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1",
			"accept": "application/json, text/plain, */*"
		},
		data: JSON.stringify(
		{"size":"0","query":{"bool":{"must":[{"query_string":{"query":"sensorName: \"Kitchen Ambient\"","analyze_wildcard":true}},{"range":{"timestamp":{"gte":"now-30d","to":"now"}}}],"must_not":[]}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value","lang":"expression"}}},"cumulative_day":{"cumulative_sum":{"buckets_path":"hourly_avg"}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value * 0.25","lang":"expression"}}},"cumulative_day_cost":{"cumulative_sum":{"buckets_path":"hourly_avg_cost"}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"cumulative_monthly_total":{"cumulative_sum":{"buckets_path":"daily_total"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}},"cumulative_monthly_total_cost":{"cumulative_sum":{"buckets_path":"daily_total_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		success: function(data) {
			jsonObject2 = data;
			console.log(jsonObject2);
			updateValues2();
		}
		});
    }
	
	function updateValues1() {
		// Tier 1 (Stats above chart)
		$("#temperature").text(Math.round(jsonObject1.aggregations["3"].value));
		$("#humidity").text(Math.round(jsonObject1.aggregations["4"].value));

		// Tier 3 (General Stats)
		$("#changeMonthlyConsumption").text((Math.round(jsonObject1.aggregations["5"].value) / Math.round(jsonObject1.aggregations["6"].value) * 100) + " %");
		$("#largestConsumption").text("Television");
	}
	
	function updateValues2() {
		// Tier 1 (Stats above chart)
		$("#currentEnergyUsage").text(Math.round(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[1].daily_total.value));
		$("#previousDayEnergyUsage").text(Math.round(jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[0].daily_total.value));

		// Tier 3 (General Stats)
		$("#dailyRunningTotal").text("$ " + (jsonObject2.aggregations["per_month"].buckets[0].per_day.buckets[1].daily_total_cost.value).toFixed(2));
		$("#monthlyRunningTotal").text("$ " + (jsonObject2.aggregations["per_month"].buckets[0].monthly_total_cost.value).toFixed(2));
	}
	
	kibanaQuery1();
	kibanaQuery2();
	setInterval(function(){ kibanaQuery1() }, 60000);
	setInterval(function(){ kibanaQuery2() }, 60000);

})(jQuery);
