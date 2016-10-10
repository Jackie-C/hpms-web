/*
var jsonObject = {"took":24,"timed_out":false,"_shards":{"total":35,"successful":35,"failed":0},"hits":{"total":17046,"max_score":0.0,"hits":[]},"aggregations":{"1":{"value":7209.464507283031},"2":{"value":7209.464507283031},"3":{"value":22.256084112057735},"4":{"value":49.953888806052724},"5":{"value":7209.464507283031},"6":{"value":7209.464507283031},"7":{"value":0.10573542923974878},"8":{"value":2},"9":{"value":1802.3661268207577}}};
*/
(function($) {
	var jsonObject = null;
	
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
			jsonObject = data;
			checkResponse();
			// Tier 1 (Stats above chart)
			$("#currentEnergyUsage").attr('data-value', Math.round(jsonObject.aggregations["1"].value));
			$("#totalDailyEnergyUsage").attr('data-value', Math.round(jsonObject.aggregations["2"].value));
			$("#temperature").attr('data-value', Math.round(jsonObject.aggregations["3"].value));
			$("#humidity").attr('data-value', Math.round(jsonObject.aggregations["4"].value));

			// Tier 2 (FlotChart)
			// TODO

			// Tier 3 (General Stats)
			$("#numberTransactions").text((Math.round(jsonObject.aggregations["5"].value) / Math.round(jsonObject.aggregations["6"].value) * 100) + " %");
			$("#dailyRunningTotal").text("$ " + (Math.round(jsonObject.aggregations["7"].value)).toFixed(2));
			$("#largestConsumption").text("Television");
			$("#monthlyRunningTotal").text("$ " + (Math.round(jsonObject.aggregations["9"].value)).toFixed(2));
		}
	});
		
	function checkResponse() {
		console.log(jsonObject);
	}

    
})(jQuery);
