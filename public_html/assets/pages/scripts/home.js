//var mockData = {'took':169,'timed_out':false,'_shards':{'total':80,'successful':80,'failed':0},'hits':{'total':4000,'max_score':0,'hits':[]},'aggregations':{'per_month':{'buckets':[{'key_as_string':'2016-09','key':1472688000000,'doc_count':4000,'per_day':{'buckets':[{'key_as_string':'2016-09-24','key':1474675200000,'doc_count':2880,'per_hour':{'buckets':[{'key_as_string':'2016-09-24T00:00:00.000Z','key':1474675200000,'doc_count':120,'hourly_avg':{'value':155.41616150925694},'hourly_avg_cost':{'value':38.854040377314234},'cumulative_day':{'value':155.41616150925694},'cumulative_day_cost':{'value':38.854040377314234}},{'key_as_string':'2016-09-24T01:00:00.000Z','key':1474678800000,'doc_count':120,'hourly_avg':{'value':155.67166431461203},'hourly_avg_cost':{'value':38.91791607865301},'cumulative_day':{'value':311.08782582386897},'cumulative_day_cost':{'value':77.77195645596724}},{'key_as_string':'2016-09-24T02:00:00.000Z','key':1474682400000,'doc_count':120,'hourly_avg':{'value':153.8067412281413},'hourly_avg_cost':{'value':38.451685307035326},'cumulative_day':{'value':464.8945670520103},'cumulative_day_cost':{'value':116.22364176300258}},{'key_as_string':'2016-09-24T03:00:00.000Z','key':1474686000000,'doc_count':120,'hourly_avg':{'value':139.84443570933445},'hourly_avg_cost':{'value':34.96110892733361},'cumulative_day':{'value':604.7390027613448},'cumulative_day_cost':{'value':151.1847506903362}},{'key_as_string':'2016-09-24T04:00:00.000Z','key':1474689600000,'doc_count':120,'hourly_avg':{'value':146.50597620161938},'hourly_avg_cost':{'value':36.626494050404844},'cumulative_day':{'value':751.2449789629641},'cumulative_day_cost':{'value':187.81124474074102}},{'key_as_string':'2016-09-24T05:00:00.000Z','key':1474693200000,'doc_count':120,'hourly_avg':{'value':147.2347098618716},'hourly_avg_cost':{'value':36.8086774654679},'cumulative_day':{'value':898.4796888248356},'cumulative_day_cost':{'value':224.6199222062089}},{'key_as_string':'2016-09-24T06:00:00.000Z','key':1474696800000,'doc_count':120,'hourly_avg':{'value':153.71117038150996},'hourly_avg_cost':{'value':38.42779259537749},'cumulative_day':{'value':1052.1908592063455},'cumulative_day_cost':{'value':263.0477148015864}},{'key_as_string':'2016-09-24T07:00:00.000Z','key':1474700400000,'doc_count':120,'hourly_avg':{'value':155.9086520585177},'hourly_avg_cost':{'value':38.977163014629426},'cumulative_day':{'value':1208.0995112648632},'cumulative_day_cost':{'value':302.0248778162158}},{'key_as_string':'2016-09-24T08:00:00.000Z','key':1474704000000,'doc_count':120,'hourly_avg':{'value':161.1416023021061},'hourly_avg_cost':{'value':40.28540057552652},'cumulative_day':{'value':1369.2411135669693},'cumulative_day_cost':{'value':342.3102783917423}},{'key_as_string':'2016-09-24T09:00:00.000Z','key':1474707600000,'doc_count':120,'hourly_avg':{'value':146.38171567567858},'hourly_avg_cost':{'value':36.595428918919644},'cumulative_day':{'value':1515.6228292426479},'cumulative_day_cost':{'value':378.90570731066197}},{'key_as_string':'2016-09-24T10:00:00.000Z','key':1474711200000,'doc_count':120,'hourly_avg':{'value':141.31419185137918},'hourly_avg_cost':{'value':35.328547962844794},'cumulative_day':{'value':1656.937021094027},'cumulative_day_cost':{'value':414.23425527350673}},{'key_as_string':'2016-09-24T11:00:00.000Z','key':1474714800000,'doc_count':120,'hourly_avg':{'value':136.55197242074766},'hourly_avg_cost':{'value':34.137993105186915},'cumulative_day':{'value':1793.4889935147746},'cumulative_day_cost':{'value':448.37224837869366}},{'key_as_string':'2016-09-24T12:00:00.000Z','key':1474718400000,'doc_count':120,'hourly_avg':{'value':163.79739433739584},'hourly_avg_cost':{'value':40.94934858434896},'cumulative_day':{'value':1957.2863878521705},'cumulative_day_cost':{'value':489.3215969630426}},{'key_as_string':'2016-09-24T13:00:00.000Z','key':1474722000000,'doc_count':120,'hourly_avg':{'value':132.5081195805133},'hourly_avg_cost':{'value':33.127029895128324},'cumulative_day':{'value':2089.794507432684},'cumulative_day_cost':{'value':522.448626858171}},{'key_as_string':'2016-09-24T14:00:00.000Z','key':1474725600000,'doc_count':120,'hourly_avg':{'value':152.59254948198443},'hourly_avg_cost':{'value':38.14813737049611},'cumulative_day':{'value':2242.3870569146684},'cumulative_day_cost':{'value':560.5967642286671}},{'key_as_string':'2016-09-24T15:00:00.000Z','key':1474729200000,'doc_count':120,'hourly_avg':{'value':112.52525946954042},'hourly_avg_cost':{'value':28.131314867385104},'cumulative_day':{'value':2354.9123163842087},'cumulative_day_cost':{'value':588.7280790960522}},{'key_as_string':'2016-09-24T16:00:00.000Z','key':1474732800000,'doc_count':120,'hourly_avg':{'value':152.65521200304522},'hourly_avg_cost':{'value':38.163803000761305},'cumulative_day':{'value':2507.567528387254},'cumulative_day_cost':{'value':626.8918820968134}},{'key_as_string':'2016-09-24T17:00:00.000Z','key':1474736400000,'doc_count':120,'hourly_avg':{'value':155.5872185022692},'hourly_avg_cost':{'value':38.8968046255673},'cumulative_day':{'value':2663.154746889523},'cumulative_day_cost':{'value':665.7886867223807}},{'key_as_string':'2016-09-24T18:00:00.000Z','key':1474740000000,'doc_count':120,'hourly_avg':{'value':127.14463716270954},'hourly_avg_cost':{'value':31.786159290677386},'cumulative_day':{'value':2790.299384052232},'cumulative_day_cost':{'value':697.574846013058}},{'key_as_string':'2016-09-24T19:00:00.000Z','key':1474743600000,'doc_count':120,'hourly_avg':{'value':146.6094259848189},'hourly_avg_cost':{'value':36.652356496204725},'cumulative_day':{'value':2936.908810037051},'cumulative_day_cost':{'value':734.2272025092627}},{'key_as_string':'2016-09-24T20:00:00.000Z','key':1474747200000,'doc_count':120,'hourly_avg':{'value':149.61168459979982},'hourly_avg_cost':{'value':37.402921149949954},'cumulative_day':{'value':3086.520494636851},'cumulative_day_cost':{'value':771.6301236592127}},{'key_as_string':'2016-09-24T21:00:00.000Z','key':1474750800000,'doc_count':120,'hourly_avg':{'value':164.52172833022863},'hourly_avg_cost':{'value':41.13043208255716},'cumulative_day':{'value':3251.0422229670794},'cumulative_day_cost':{'value':812.7605557417698}},{'key_as_string':'2016-09-24T22:00:00.000Z','key':1474754400000,'doc_count':120,'hourly_avg':{'value':156.8191374333099},'hourly_avg_cost':{'value':39.20478435832747},'cumulative_day':{'value':3407.8613604003895},'cumulative_day_cost':{'value':851.9653401000974}},{'key_as_string':'2016-09-24T23:00:00.000Z','key':1474758000000,'doc_count':120,'hourly_avg':{'value':150.95064314975383},'hourly_avg_cost':{'value':37.73766078743846},'cumulative_day':{'value':3558.8120035501433},'cumulative_day_cost':{'value':889.7030008875358}}]},'daily_total':{'value':3558.8120035501433},'cumulative_monthly_total':{'value':3558.8120035501433},'daily_total_cost':{'value':889.7030008875358},'cumulative_monthly_total_cost':{'value':889.7030008875358}},{'key_as_string':'2016-09-25','key':1474761600000,'doc_count':1120,'per_hour':{'buckets':[{'key_as_string':'2016-09-25T00:00:00.000Z','key':1474761600000,'doc_count':120,'hourly_avg':{'value':138.07539392430152},'hourly_avg_cost':{'value':34.51884848107538},'cumulative_day':{'value':138.07539392430152},'cumulative_day_cost':{'value':34.51884848107538}},{'key_as_string':'2016-09-25T01:00:00.000Z','key':1474765200000,'doc_count':120,'hourly_avg':{'value':174.14753491436952},'hourly_avg_cost':{'value':43.53688372859238},'cumulative_day':{'value':312.222928838671},'cumulative_day_cost':{'value':78.05573220966775}},{'key_as_string':'2016-09-25T02:00:00.000Z','key':1474768800000,'doc_count':120,'hourly_avg':{'value':152.5515267293107},'hourly_avg_cost':{'value':38.137881682327674},'cumulative_day':{'value':464.7744555679817},'cumulative_day_cost':{'value':116.19361389199543}},{'key_as_string':'2016-09-25T03:00:00.000Z','key':1474772400000,'doc_count':120,'hourly_avg':{'value':155.6332996884818},'hourly_avg_cost':{'value':38.90832492212045},'cumulative_day':{'value':620.4077552564635},'cumulative_day_cost':{'value':155.10193881411587}},{'key_as_string':'2016-09-25T04:00:00.000Z','key':1474776000000,'doc_count':120,'hourly_avg':{'value':160.2238553805892},'hourly_avg_cost':{'value':40.0559638451473},'cumulative_day':{'value':780.6316106370527},'cumulative_day_cost':{'value':195.1579026592632}},{'key_as_string':'2016-09-25T05:00:00.000Z','key':1474779600000,'doc_count':120,'hourly_avg':{'value':171.2801439449361},'hourly_avg_cost':{'value':42.820035986234025},'cumulative_day':{'value':951.9117545819888},'cumulative_day_cost':{'value':237.9779386454972}},{'key_as_string':'2016-09-25T06:00:00.000Z','key':1474783200000,'doc_count':120,'hourly_avg':{'value':146.61549447973746},'hourly_avg_cost':{'value':36.653873619934366},'cumulative_day':{'value':1098.5272490617263},'cumulative_day_cost':{'value':274.63181226543156}},{'key_as_string':'2016-09-25T07:00:00.000Z','key':1474786800000,'doc_count':120,'hourly_avg':{'value':151.75406848900778},'hourly_avg_cost':{'value':37.938517122251945},'cumulative_day':{'value':1250.281317550734},'cumulative_day_cost':{'value':312.5703293876835}},{'key_as_string':'2016-09-25T08:00:00.000Z','key':1474790400000,'doc_count':120,'hourly_avg':{'value':168.2470658099348},'hourly_avg_cost':{'value':42.0617664524837},'cumulative_day':{'value':1418.5283833606688},'cumulative_day_cost':{'value':354.6320958401672}},{'key_as_string':'2016-09-25T09:00:00.000Z','key':1474794000000,'doc_count':40,'hourly_avg':{'value':150.357320737728},'hourly_avg_cost':{'value':37.589330184432},'cumulative_day':{'value':1568.885704098397},'cumulative_day_cost':{'value':392.2214260245992}}]},'daily_total':{'value':1568.885704098397},'cumulative_monthly_total':{'value':5127.69770764854},'daily_total_cost':{'value':392.2214260245992},'cumulative_monthly_total_cost':{'value':1281.924426912135}}]},'monthly_total':{'value':5127.69770764854},'monthly_total_cost':{'value':1281.924426912135}}]}}};

(function($) {
	var apiURL = "https://hms-portal.net/kibana/elasticsearch";
	var jsonObject1 = null;
	var jsonObject2 = null;

    function kibanaQuery1() {

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
		{"size":"0","query":{"bool":{"must":[{"query_string":{"query":"sensorName: \"Kitchen Ambient\"","analyze_wildcard":true}},{"range":{"timestamp":{"gte":"now-30d","to":"now"}}}],"must_not":[]}},"aggs":{"per_month":{"date_histogram":{"field":"timestamp","interval":"month","format":"YYYY-MM"},"aggs":{"per_day":{"date_histogram":{"field":"timestamp","interval":"day","format":"YYYY-MM-dd"},"aggs":{"per_hour":{"date_histogram":{"field":"timestamp","interval":"hour"},"aggs":{"hourly_avg":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value","lang":"expression"}}},"cumulative_day":{"cumulative_sum":{"buckets_path":"hourly_avg"}},"hourly_avg_cost":{"avg":{"script":{"inline":"doc['voltage'].value * doc['current'].value * 0.25","lang":"expression"}}},"cumulative_day_cost":{"cumulative_sum":{"buckets_path":"hourly_avg_cost"}}}},"daily_total":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg"}},"cumulative_monthly_total":{"cumulative_sum":{"buckets_path":"daily_total"}},"daily_total_cost":{"sum_bucket":{"buckets_path":"per_hour>hourly_avg_cost"}},"cumulative_monthly_total_cost":{"cumulative_sum":{"buckets_path":"daily_total_cost"}}}},"monthly_total":{"sum_bucket":{"buckets_path":"per_day>daily_total"}},"monthly_total_cost":{"sum_bucket":{"buckets_path":"per_day>daily_total_cost"}}}}}}
		),
		success: function(data) {
			jsonObject2 = data;
			console.log(jsonObject2);
			updateValues2();
                        plotChart("Energy");
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
	
	kibanaQuery1();
	kibanaQuery2();
	setInterval(function(){ kibanaQuery1(); }, 60000);
	setInterval(function(){ kibanaQuery2(); }, 60000);
})(jQuery);
