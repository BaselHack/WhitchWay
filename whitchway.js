// TODO request mitschneiden
/*

- find trip von a nach b mit station id und zeit (now) als param
- stationTable mit param station id, richtung, zeit, wie weit in die zukunft?



 */



function findStation(query, callback) {
	function mapStations(p){
		var ret = [];
		$.each(p, function( index, value ) {
			ret.push({id : value.r.id, name : value.n});
		});
		return ret;
	}
	var template = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20%27http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2FXML_STOPFINDER_REQUEST%3Flanguage%3Den%26coordOutputFormat%3DNBWT%26locationServerActive%3D1%26stateless%3D1%26type_sf%3Dany%26useHouseNumberList%3Dtrue%26doNotSearchForStops%3D1%26reducedAnyWithoutAddressObjFilter_sf%3D103%26reducedAnyPostcodeObjFilter_sf%3D64%26reducedAnyTooManyObjFilter_sf%3D2%26anyObjFilter_sf%3D126%26w_regPrefAl%3D2%26prMinQu%3D1%26anyMaxSizeHitList%3D10%26name_sf%3D<QUERY>%27%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	$.ajax({
		url: template.replace('<QUERY>',query),
		type: 'get',
		dataType : 'json',
		success: function (data) {
			var stations = mapStations(data.query.results.efa.sf.p)
			if(callback) callback(stations);
		}
	});
}



function getArrivalTime(fromId, toId) {
	return new Date(new Date().getTime()+(1000*60*(parseInt(fromId) + parseInt(toId))))
}





var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%27http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2FXML_COORD_REQUEST%3Flanguage%3Den%26coord%3D3394151.17870016%253A893628.1039322363%253ANBWT%253A%26coordListOutputFormat%3DSTRING%26max%3D5%26inclFilter%3D1%26coordOutputFormat%3DNBWT%26type_1%3DSTOP%26radius_1%3D1000%27&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";




