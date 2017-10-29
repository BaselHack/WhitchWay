// TODO request mitschneiden
/*

- find trip von a nach b mit station id und zeit (now) als param
- stationTable mit param station id, richtung, zeit, wie weit in die zukunft?

 */
function getStationName(id) {
	return "Station" + id;
}


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


function formatWithTrailingZeros(i, width) {
	var ret = ""+i;
	while(ret.length < width) {
		ret = "0"+ret;
	}
	return ret;
}

function getArrivalTime(fromId, toId, callback, atTime) {
	atTime = atTime || new Date();
	console.log(atTime)
	// &itdTime=0800&itdDate=20171031
	//&itdTripDateTimeDepArr=arr&name_origin=51000007
	//&name_destination=53006670
	
	var template = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2FXML_TRIP_REQUEST2%3Flanguage%3Den%26calcNumberOfTrips%3D2%26coordListOutputFormat%3DSTRING%26coordOutputFormat%3DNBWT%26coordOutputFormatTail%3D0%26locationServerActive%3D1%26itdTime%3D<TIME>%26itdDate%3D20171031%26itdTripDateTimeDepArr%3Darr%26name_origin%3D51000007%26type_origin%3Dany%26name_destination%3D53006670%26type_destination%3Dany%26useRealtime%3D1%26imparedOptionsActive%3D1%26excludedMeans%3Dcheckbox%26itOptionsActive%3D1%26useProxFootSearch%3Dtrue%26trITMOTvalue100%3D10%26lineRestriction%3D400%26changeSpeed%3Dfast%26routeType%3DLEASTTIME%26ptOptionsActive%3D1\'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	$.ajax({
		url: template.replace('<TIME>',formatWithTrailingZeros(atTime.getHours(),2)+formatWithTrailingZeros(atTime.getMinutes(),2)),
		type: 'get',
		dataType : 'json',
		success: function (data) {
//			var stations = mapStations(data.query.results.efa.sf.p)
			if(callback) callback(data.query.results.efa.ts.tp[0].ls.l.pss);
		}
	});
}


