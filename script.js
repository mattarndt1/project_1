/***************************
**
**	LEAFLET
**
***************************/

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

var map = L.map('l_map', {
    center: [40.55,-94.18],
    zoom: 12,
    layers: [g_map,sat]
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
	 
	contours = L.geoJson(data,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      });
  });

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

var baseMaps;
var overlays;

setTimeout(function(){
	stands.bringToFront();
	boundary.bringToFront();
	
	baseMaps = {
	    "Google Map": g_map,
	    "Google Satellite": sat
	};

	overlays = {
	    "Property Boundary": boundary,
		"Forest Stands": stands,
		"Contour Lines": contours};

	L.control.layers(baseMaps,overlays).addTo(map);
}, 2500);


/***************************
**
**	ArcGIS 2D API
**
***************************/


 require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer",
	"esri/layers/TileLayer",
	 "esri/layers/GeoJSONLayer"
      ], function (Map, MapView, FeatureLayer,TileLayer,GeoJSONLayer) {
        var map = new Map({
          basemap: "terrain"
        });
	
	
	  

        var view = new MapView({
          container: "2d_map",
          map: map,
	  center = [-94.18,40.55],  // Sets the center point of the view at a specified lon/lat
	  zoom = 12  // Sets the zoom LOD to 13
/*
          extent: {
            // autocasts as new Extent()
            xmin: -10366387,
            ymin: 4902434,
            xmax: -10356735,
            ymax: 4919960,
            spatialReference: 102100
          }
	  */
        });

        /********************
         * Add feature layer
         ********************/

        map.add(layer);
	 
        var geojsonLayer = new GeoJSONLayer({
	  	url: "contour_lines_10ft_simplified_WGS84.geojson",
		renderer: {
			type: "simple",
			symbol: {
			  color: "#cccccc",
			  type: "simple-line",
			  style: "solid"
			}
	});
	 
        map.add(geojsonLayer);
	 
        var geojsonLayer = new GeoJSONLayer({
	  url: "stands_WGS84.geojson"
	});
	 
        map.add(geojsonLayer);
	 
        var geojsonLayer = new GeoJSONLayer({
	  url: "LCF_boundary_WGS84.geojson"
	});
	 
        map.add(geojsonLayer);
	 
	       
});




/***************************
**
**	ArcGIS 3D API
**
***************************/


 require([
        "esri/Map",
        "esri/views/MapView",
        "esri/layers/FeatureLayer"
      ], function (Map, MapView, FeatureLayer) {
        var map = new Map({
          basemap: "hybrid"
        });

        var view = new MapView({
          container: "3d_map",
          map: map,

          extent: {
            // autocasts as new Extent()
            xmin: -10366387,
            ymin: 4902434,
            xmax: -10356735,
            ymax: 4919960,
            spatialReference: 102100
          }
        });

        /********************
         * Add feature layer
         ********************/

        var featureLayer1 = new FeatureLayer({     url:"https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Commission_prop_footprint/FeatureServer"});
   
        map.add(featureLayer1);
   
   var featureLayer2 = new FeatureLayer({     url:"https://services2.arcgis.com/bB9Y1bGKerz1PTl5/arcgis/rest/services/Normal_Pool/FeatureServer"});
   
        map.add(featureLayer2);
      });


