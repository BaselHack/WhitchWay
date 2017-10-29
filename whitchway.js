
function getStationName(id, callback) {
	var template = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2FXML_DM_REQUEST%3Flanguage%3Den%26mode%3Ddirect%26coordOutputFormat%3DNBWT%26mergeDep%3D0%26maxTimeLoop%3D1%26canChangeMOT%3D0%26useAllStops%3D0%26locationServerActive%3D0%26depType%3DstopEvents%26includeCompleteStopSeq%3D1%26name_dm%3D<ID>%26type_dm%3Dstop%26useRealtime%3D0%26%26imparedOptionsActive%3D0%26doNotSearchForStops%3D1%26excludedMeans%3Dcheckbox%26useProxFootSearch%3D0%26itOptionsActive%3D1%26trITMOTvalue100%3D10%26lineRestriction%3D400%26deleteAssignedStops_dm%3D1%26changeSpeed%3Dnormal%26routeType%3DLEASTTIME%26ptOptionsActive%3D0%26limit%3D1\'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	$.ajax({
		url: template.replace('<ID>',id),
		type: 'get',
		dataType : 'json',
		success: function (data) {
			var name = data.query.results.efa.dps.dp.n
			if(callback) callback(name);
		}
	});
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
	// todo why is it going into the past?
	atTime = new Date(atTime.getTime()+1000*60*11);
	var template = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%20%3D%20\'http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2Fandroid_bvb%2FXML_TRIP_REQUEST2%3Flanguage%3Den%26calcNumberOfTrips%3D4%26coordListOutputFormat%3DSTRING%26coordOutputFormat%3DNBWT%26coordOutputFormatTail%3D0%26locationServerActive%3D1%26itdTime%3D<TIME>%26itdDate%3D<DATE>%26itdTripDateTimeDepArr%3Ddep%26name_origin%3D<FROM>%26type_origin%3Dany%26name_destination%3D<TO>%26type_destination%3Dany%26useRealtime%3D1%26imparedOptionsActive%3D1%26excludedMeans%3Dcheckbox%26itOptionsActive%3D1%26useProxFootSearch%3Dtrue%26trITMOTvalue100%3D10%26lineRestriction%3D400%26changeSpeed%3Dnormal%26routeType%3DLEASTTIME%26ptOptionsActive%3D1%26\'%20&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";
	
	$.ajax({
		url: template
		.replace('<TIME>',formatWithTrailingZeros(atTime.getHours(),2)+formatWithTrailingZeros(atTime.getMinutes(),2))
		.replace('<DATE>',atTime.getFullYear() + formatWithTrailingZeros(atTime.getMonth()+1,2)+formatWithTrailingZeros(atTime.getDate(),2))
		.replace('<FROM>',fromId)
		.replace('<TO>',toId),
		type: 'get',
		dataType : 'json',
		success: function (data) {
			var tp = data.query.results.efa.ts.tp;
			if(Array.isArray(tp)) tp = tp[0];
			if(callback) callback(mapTrip(tp));
		}
	});
}

function mapTrip(tp) {
	var trips = tp.ls.l;
	if(!Array.isArray(trips)) trips = [trips];
	var how = "";
	$.each(trips, function( index, trip ) {
		if(how.length > 0) how += " > ";
		how += trip.m.n;
	});
	var pd = trips[0].ps.p;
	var departure  = pd[0].st.rt;	
	var pa = trips[trips.length-1].ps.p;
	var arrival = pa[pa.length-1].st.rt;
	return {departure: departure, how : how, arrival:arrival}
}


function fakeIt() {
	getTrips(parseUrl(), $("#result"));
}

function getTrips(trips, node) {
	var runningCalls = 0;
	$.each(trips, function( index, trip ) {
		 getArrivalTime(trip.from.id, trip.to.id, function(currentTrip){
			 console.log(currentTrip)
			 node.append("<br/><span>From <b>"+trip.from.name+"</b> " +currentTrip.departure+" "+currentTrip.how+" to "+trip.to.name+" <b>" +currentTrip.arrival+"</b></span>")
		 });
	});
}

function parseUrl(url) {
	return [
	{
		from : {id : 51000001, name : "Aeschenplatz" },
		to : {id : 51000019, name : "Bruderholz" },
	},
	{
		from : {id : 51000007, name : "Bahnhof SBB" },
		to : {id : 51000010, name : "Bedrettostrasse" },
	}];
	
}


