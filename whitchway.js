// TODO request mitschneiden
/*

- find trip von a nach b mit station id und zeit (now) als param
- stationTable mit param station id, richtung, zeit, wie weit in die zukunft?



 */



function findStation(query) {
	return [ 
		{name : "Aeschenplatz",id :1},
		{name : "Barfüsserplatz",id :2}
		];
}
function getArrivalTime(fromId, toId) {
	return new Date(new Date().getTime()+(1000*60*(parseInt(fromId) + parseInt(toId))))
}





var url = "https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20xml%20where%20url%3D%27http%3A%2F%2Fwww.efa-bw.de%2Fandroid_bvb%2FXML_COORD_REQUEST%3Flanguage%3Den%26coord%3D3394151.17870016%253A893628.1039322363%253ANBWT%253A%26coordListOutputFormat%3DSTRING%26max%3D5%26inclFilter%3D1%26coordOutputFormat%3DNBWT%26type_1%3DSTOP%26radius_1%3D1000%27&format=xml&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys";


$.ajax({
    url: url,
    type: 'get',
    success: function (data) {
        console.log(data);
    }
});


