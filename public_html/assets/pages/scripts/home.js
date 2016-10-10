/*
var jsonObject = {"responses":[{"took":5,"timed_out":false,"_shards":{"total":10,"successful":10,"failed":0},"hits":{"total":4001,"max_score":0,"hits":[]},"aggregations":{"1":{"value":101.03560990466235},"2":{"value":239.9712136},"3":{"value":75.03073842},"4":{"value":1.5055978916528368},"5":{"value":2.99869039},"6":{"value":25.002442595},"7":{"value":150.84587334636507},"8":{"value":708.9589119138891},"9":{"value":55.00440527815114},"10":{"value":603.5343392588068}},"status":200}]};
*/
   
(function($) {
	var jsonObject = null;
	
	$.ajax({
		url: "/elasticsearch/hms-homeuser1-*/_search",
		type: "POST",
		headers: {
			"Authorization": "Basic ZWxhc3RpYzpjaGFuZ2VtZQ==",
			"kbn-version": "5.0.0-beta1"
		},
		data: JSON.stringify(
		{"query":{"bool":{"must":[{"query_string":{"query":"*","analyze_wildcard":true}},{"range":{"timestamp":{"gte":1451566800000,"lte":1483189199999,"format":"epoch_millis"}}}],"must_not":[]}},"size":0,"aggs":{"1":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"2":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"3":{"avg":{"field":"temperature"}},"4":{"avg":{"field":"humidity"}},"5":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"6":{"sum":{"script":{"inline":"doc['voltage'].value * doc['current'].value / 1000","lang":"expression"}}},"7":{"avg":{"script":{"inline":"(doc['voltage'].value * doc['current'].value * 0.25) / 1000","lang":"expression"}}},"8":{"cardinality":{"field":"sensorName.keyword"}},"9":{"sum":{"script":{"inline":"(doc['voltage'].value * doc['current'].value * 0.25) / 1000","lang":"expression"}}}}}
		),
		success: function(data) {
			jsonObject = data;
			checkResponse();
		},
		contentType: "application/json; charset=UTF-8",
		dataType: 'json'
	});
		
	function checkResponse() {
		console.log(jsonObject);
	}

    // Tier 1 (Stats above chart)
    $("#currentEnergyUsage").attr('data-value', Math.round(jsonObject.responses[0].aggregations["1"].value));
    $("#totalDailyEnergyUsage").attr('data-value', Math.round(jsonObject.responses[0].aggregations["2"].value));
    $("#temperature").attr('data-value', Math.round(jsonObject.responses[0].aggregations["3"].value));
    $("#humidity").attr('data-value', Math.round(jsonObject.responses[0].aggregations["4"].value));

    // Tier 2 (FlotChart)
    // TODO

    // Tier 3 (General Stats)
    $("#numberTransactions").attr('data-percent', Math.round(jsonObject.responses[0].aggregations["5"].value));
    $("#numberTransactions").text(Math.round(jsonObject.responses[0].aggregations["5"].value) + "%");

    $("#dailyRunningTotal").text("$" + (Math.round(jsonObject.responses[0].aggregations["6"].value)).toFixed(2));
    $("#largestConsumption").text("Enter jsonString");
    $("#monthlyRunningTotal").text("$" + (Math.round(jsonObject.responses[0].aggregations["9"].value)).toFixed(2));
})(jQuery);
