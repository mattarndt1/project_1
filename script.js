var map = L.map('map').setView([40.3,-94.1], 15);

  // load a tile layer
L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
}).addTo(map);

  // load GeoJSON from an external file
  $.getJSON("https://raw.githubusercontent.com/gbrunner/adv-python-for-gis-and-rs/master/Week%201/sf_crime.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data).addTo(map);
	  

	var ratIcon = L.icon({
	    iconUrl: 'rat.gif',
	    iconSize: [25,15]
	  }); 
	  L.geoJson(data  ,{
	    pointToLayer: function(feature,latlng){
		  return L.marker(latlng,{icon: ratIcon});
	    }
	  } );
  });
