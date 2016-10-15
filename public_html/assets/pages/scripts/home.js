 
(function($) {
	var jsonObject = null;
    
    
    
    
    function getJsonObject() {
        
        
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
			updateValues();
		}
	});
        
        
        
    }
	
	function checkResponse() {
		console.log(jsonObject);
	}
	
	function updateValues() {
		// Tier 1 (Stats above chart)
		$("#currentEnergyUsage").text(Math.round(jsonObject.aggregations["1"].value));
		$("#totalDailyEnergyUsage").text(Math.round(jsonObject.aggregations["2"].value));
		$("#temperature").text(Math.round(jsonObject.aggregations["3"].value));
		$("#humidity").text(Math.round(jsonObject.aggregations["4"].value));

		// Tier 2 (FlotChart)
		// TODO

		// Tier 3 (General Stats)
		$("#numberTransactions").text((Math.round(jsonObject.aggregations["5"].value) / Math.round(jsonObject.aggregations["6"].value) * 100) + " %");
		$("#dailyRunningTotal").text("$ " + (Math.round(jsonObject.aggregations["7"].value)).toFixed(2));
		$("#largestConsumption").text("Television");
		$("#monthlyRunningTotal").text("$ " + (Math.round(jsonObject.aggregations["9"].value)).toFixed(2));
	}
    
    
    setInterval(getJsonObject(), 5000);
    
})(jQuery);


