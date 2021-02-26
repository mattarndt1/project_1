var map = L.map('map').setView([40.55,-94.18], 12);

  // load Google Satellite
var sat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
}).addTo(map);
/*
  // load Google Roads
var roads = L.tileLayer('https://mt1.google.com/vt/lyrs=h&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
}).addTo(map);

*/
function onEachFeature(feature, layer) {
	//console.log("Stand "+feature.properties.Name+"<br/>"+feature.properties.ACRES+" acres");
    layer.bindPopup("Stand "+feature.properties.Name+"<br/>"+feature.properties.ACRES+" acres");
}



//contour lines
var contour_layer;
var contours;
$.getJSON("contour_lines_10ft_simplified_WGS84.geojson",function(data){
	  /*
    // add GeoJSON layer to the map once the file is loaded
	contour_layer = L.geoJson();
	contour_layer.setStyle({	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      });
	*/
	/*contour_layer = L.geoJson(,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      }).addTo(map);
	      */
	contours = L.geoJson(data,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      });    //.addTo(map);
//	console.log(contours);
	//contour = data;
  });

//	console.log(contours);
//contours.addTo(map);

//forest stands
$.getJSON("stands_WGS84.geojson",function(data){
	  
    // add GeoJSON layer to the map once the file is loaded
	var stands = L.geoJson(data,{	     
	    "color": "#ffff00",
	    "weight": 1.5,
	    "opacity": 1,
	    "fillOpacity": .2,
   		onEachFeature: onEachFeature
	 }).addTo(map);
	  
  });



//property boundary
$.getJSON("LCF_boundary_WGS84.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
	var boundary =  L.geoJson(data,{	     
	    "color": "#0000ff",
	    "weight": 3,
	    "opacity": 1,
	    "fillOpacity": 0
	 }).addTo(map);
	  
  });

var contour_layer = {
  "contour_lines": contours
};

map.on('zoomend', function() {
	var zoomlevel = map.getZoom();
	if (zoomlevel  >=14  && ( ! map.hasLayer(contour_layer))){
		L.control.layers(contour_layer).addTo(map);
		//contour_layer.addData(contour);
		contour_layer.setStyle({	     
		    "color": "#cccccc",
		    "weight": .25,
		    "opacity": 1
		      });
		console.log(contour_layer.options);
		console.log("add");
	}
	else if (zoomlevel  <14 && map.hasLayer(contour_layer)){
		//contour_layer.clearLayers();
		
		L.control.layers(contour_layer).removeFrom(map);
	}
});
