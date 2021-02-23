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
function onEachFeature(feature, layer) {
    layer.bindPopup("Stand "+feature.properties.NAME+"<br/>"+feature.properties.ACRES+" acres");
}



//contour lines
$.getJSON("contour_lines_10ft_simplified_WGS84.geojson",function(data){
	  
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      }).addTo(map);
	  
  });

//forest stands
$.getJSON("stands_WGS84.geojson",function(data){
	  
   	onEachFeature: onEachFeature;
	
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{	     
	    "color": "#00ffff",
	    "weight": 2,
	    "opacity": 1,
	    "fillOpacity": .2
	      }).addTo(map);
	  
  });


  $.getJSON("LCF_boundary_WGS84.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
    L.geoJson(data,{	     
	    "color": "#0000ff",
	    "weight": 3,
	    "opacity": 1,
	    "fillOpacity": 0
	      }).addTo(map);
	  
  });

