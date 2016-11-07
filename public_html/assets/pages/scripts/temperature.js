(function($) {
	var apiURL = "https://www.hms-portal.net/kibana/elasticsearch";
	var weatherJsonObject1 = null;
	var chartSelection = "Total";
        var yLabel = chartSelection;

	function getWeatherHourly() {
            var roomName = "roomName: " + "\"" + chartSelection + "\"";
            var query = JSON.stringify(
			{"size":"0","query":{"bool":{"must":[{"query_string":{"query":roomName}},{"range":{"timestamp":{"gte":"now-1d","to":"now"}}}]}},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"temperature":{"avg":{"field":"temperature"}}}}}}
			);
            if (chartSelection === "Total"){
                query = JSON.stringify(
				{"size":"0","query":{"bool":{"must":[{"range":{"timestamp":{"gte":"now-1d","to":"now"}}}]}},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"temperature":{"avg":{"field":"temperature"}}}}}}
				);
            }
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
		data: query,
		statusCode: {
			401: function () {
				window.location.replace('/login')
			}
		},
		success: function(data) {
			weatherJsonObject1 = data;
			console.log(weatherJsonObject1);
			var totalHours = weatherJsonObject1.aggregations.per_hour.buckets.length;
			plotChart(totalHours);
		}
		});
    }

    function getRoomsAndPopulateToDropDown() {
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
            {"size":0,"aggs":{"1":{"terms":{"field":"roomName.keyword","order":{"_term":"desc"}}}}}
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

	function getChartData(totalHours){
		var currentDayBuckets = weatherJsonObject1.aggregations;
		var chartFormatted = new Array();
		var highestUsageValue = 0;
		var highestUsageTime;
		var lowestUsageValue = 0;
		var lowestUsageTime;

		$.each(currentDayBuckets.per_hour.buckets, function(index, value){
			var perHourData = new Array();
			perHourData.push(value.key);
			perHourData.push(value.temperature.value);
			chartFormatted.push(perHourData);

			// find highest temperature and time
			if (highestUsageValue < value.temperature.value){
				highestUsageValue = value.temperature.value;
				highestUsageTime = value.key;
			}

			// find lowest temperature and time
			if (lowestUsageValue === 0){
				lowestUsageValue = value.temperature.value;
				lowestUsageTime = value.key;
			} else if (lowestUsageValue > value.temperature.value){
				lowestUsageValue = value.temperature.value;
				lowestUsageTime = value.key;
			}
		});

		var peakUsageDateTime = new Date(highestUsageTime);
		var lowestUsageDateTime = new Date (lowestUsageTime);
		if (highestUsageValue === 0) {
			$("#minTemp").text("Sensor Error");
			$("#maxTemp").text("Sensor Error");
		} else if (lowestUsageValue === 0) {
			$("#minTemp").text("Sensor Error");
			$("#maxTemp").text("Sensor Error");
		} else {
			$("#minTemp").text(Math.round(lowestUsageValue)+ '°C' + " at " + lowestUsageDateTime.getUTCHours() + ":" + (lowestUsageDateTime.getUTCMinutes()<10?'0':'') + lowestUsageDateTime.getUTCMinutes());
			$("#maxTemp").text(Math.round(highestUsageValue)+ '°C' + " at " + peakUsageDateTime.getUTCHours() + ":" + (peakUsageDateTime.getUTCMinutes()<10?'0':'') + peakUsageDateTime.getUTCMinutes());
		}
		return chartFormatted;
	}

	function plotChart(totalHours){
		var placeholder = $("#chart_4");
		var data = getChartData(totalHours);
		var dataset = [ { label: yLabel + " Temperature", data: data }];
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
				fillColor: 'rgba(22, 192, 192, 0.4)'
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
				axisLabel: category + ' (°C)'
			}]
		};
	}

	$('#dropdown').on('change', function(){
            var value = this.value;
            yLabel = value;
            switch(value){
                case "Living Room":
                    value = "Kitchen";
                    break;
                case "Household":
                    value = "Bedroom";
                    break;
                case "Office":
                    value = "Bedroom";
                    break;
                case "Lounge":
                    value = "Kitchen";
                    break;
            }

            chartSelection = value;
            getWeatherHourly();
	});

	//Get data on page load
	getWeatherHourly();

        // Populate dynamic dropdown
	getRoomsAndPopulateToDropDown();

	//Auto-refresh every 60 minutes
	setInterval(function(){ getWeatherHourly(); }, 3600000);
})(jQuery);

//Decimal rounding functions
(function(){function decimalAdjust(type,value,exp){if(typeof exp==='undefined'||+exp===0){return Math[type](value);}
value=+value;exp=+exp;if(isNaN(value)||!(typeof exp==='number'&&exp%1===0)){return NaN;}
value=value.toString().split('e');value=Math[type](+(value[0]+'e'+(value[1]?(+value[1]-exp):-exp)));value=value.toString().split('e');return+(value[0]+'e'+(value[1]?(+value[1]+exp):exp));}
if(!Math.round10){Math.round10=function(value,exp){return decimalAdjust('round',value,exp);};}
if(!Math.floor10){Math.floor10=function(value,exp){return decimalAdjust('floor',value,exp);};}
if(!Math.ceil10){Math.ceil10=function(value,exp){return decimalAdjust('ceil',value,exp);};}})();
