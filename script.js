var map = L.map('map').setView([40.55,-94.18], 12);

  // load Google Satellite
L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
}).addTo(map);
/*
  // load Google Roads
L.tileLayer('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
}).addTo(map);

*/

  $.getJSON("LCF_boundary.geojson",function(data){
	  
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{	     
	    "color": "#0000ff",
	    "weight": 5
	      }).addTo(map);
	  
/*
	var ratIcon = L.icon({
	    iconUrl: 'rat.gif',
	    iconSize: [25,15]
	  }); 
	  L.geoJson(data  ,{
	    pointToLayer: function(feature,latlng){
		  return L.marker(latlng,{icon: ratIcon});
	    }
	  } );
	  */
  });
