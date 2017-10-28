function findStation(query) {
	return [ 
		{name : "Aeschenplatz",id :1},
		{name : "Barfüsserplatz",id :2}
		];
}
function getArrivalTime(fromId, toId) {
	return new Date(new Date().getTime()+(1000*60*(parseInt(fromId) + parseInt(toId))))
}
var url = "http://www.efa-bw.de/bvb/XML_TRIP_REQUEST2";
$.post( url, function( data ) {
	  console.log( data );
	});

//http://www.efa-bw.de/android_bvb/XML_TRIP_REQUEST2?type_origin=stopID&name_origin=51000010&type_destination=stopID&name_destination=53023490&execInst=verifyOnly
