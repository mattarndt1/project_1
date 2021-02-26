
  // load Google Satellite
var sat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
});
//.addTo(map);

  // load Google Map
var g_map = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
});
//.addTo(map);

var map = L.map('map', {
    center: [40.55,-94.18],
    zoom: 12,
    layers: [sat, g_map]
});
//var map = L.map('map').setView([40.55,-94.18], zoom:12,layers: [sat, g_map]);

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
	      });


//	console.log(contours);
	//contour = data;
  });




//	console.log(contours);


//forest stands
var stands;
$.getJSON("stands_WGS84.geojson",function(data){
	  
    // add GeoJSON layer to the map once the file is loaded
	stands = L.geoJson(data,{	     
	    "color": "#ffff00",
	    "weight": 1.5,
	    "opacity": 1,
	    "fillOpacity": .2,
   		onEachFeature: onEachFeature
	 }).addTo(map);
	  
  });



//property boundary
var boundary;
$.getJSON("LCF_boundary_WGS84.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
	boundary =  L.geoJson(data,{	     
	    "color": "#0000ff",
	    "weight": 3,
	    "opacity": 1,
	    "fillOpacity": 0
	 }).addTo(map);
	  
  });


var baseMaps = {
    "Google Satellite": sat,
    "Google Map": g_map
};

var overlays = {
    "Property Boundary": boundary,
	"Forest Stands": stands,
	"Contour Lines": contours};

L.control.layers(baseMaps,overlays).addTo(map);

/*
map.on('zoomend', function() {
	var zoomlevel = map.getZoom();
	
	console.log("zoom");
	console.log(contours);
	
	if (zoomlevel  >=14  && ( ! map.hasLayer(contour_layer))){
		
	contour_layer = {"contour lines": contours};
	L.control.layers(contour_layer).addTo(map);
		console.log(contour_layer);
		console.log("add");
	}
	else if (zoomlevel  <14 && map.hasLayer(contour_layer)){
		//contour_layer.clearLayers();
		
		L.control.layers(contour_layer).removeFrom(map);
	}
});
*/
