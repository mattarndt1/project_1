/***************************
**
**	LEAFLET
**
***************************/

function onEachFeature(feature, layer) {
	//console.log("Stand "+feature.properties.Name+"<br/>"+feature.properties.ACRES+" acres");
    layer.bindPopup("Stand "+feature.properties.Name+"<br/>"+feature.properties.ACRES+" acres");
}


  // load Google Satellite
var l_sat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
});
//.addTo(map);

  // load Google Map
var l_g_map = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
	attribution: 'Imagery from Google XYZ service; (c) 2021 Maxar Technologies, USDA Farm Service Agency, Map Data (c) 2021',
	minZoom: 0,
	maxZoom: 20
});
//.addTo(map);

var l_map = L.map('l_map', {
	    center: [40.55,-94.18],
	    zoom: 12,
	    layers: [l_sat]
	});


//contour lines
var l_contour_layer;
var l_contours;
$.getJSON("contour_lines_10ft_simplified_WGS84.geojson",function(data){
	 
	l_contours = L.geoJson(data,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      });
  });

//forest stands
var l_stands;
$.getJSON("stands_WGS84.geojson",function(data){
	  
    // add GeoJSON layer to the map once the file is loaded
	l_stands = L.geoJson(data,{	     
	    "color": "#ffff00",
	    "weight": 1.5,
	    "opacity": 1,
	    "fillOpacity": .2,
   		onEachFeature: onEachFeature
	 });
	//.addTo(map);
	  
  });



//property boundary
var l_boundary;
$.getJSON("LCF_boundary_WGS84.geojson",function(data){
    // add GeoJSON layer to the map once the file is loaded
	l_boundary =  L.geoJson(data,{	     
	    "color": "#0000ff",
	    "weight": 3,
	    "opacity": 1,
	    "fillOpacity": 0
	 }).addTo(l_map);
	  
  });



var l_baseMaps;
var l_overlays;

setTimeout(function(){
	l_stands.bringToFront();
	l_boundary.bringToFront();
	
	l_baseMaps = {
	    "Google Map": l_g_map,
	    "Google Satellite": l_sat
	};

	l_overlays = {
	    "Property Boundary": l_boundary,
		"Forest Stands": l_stands,
		"Contour Lines": l_contours};

	L.control.layers(l_baseMaps,l_overlays).addTo(l_map);
}, 3500);


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
	 "esri/layers/GeoJSONLayer",
	 "esri/widgets/BasemapToggle",
	 "esri/widgets/BasemapLayerList",
	 "esri/widgets/LayerList",
	 "esri/widgets/Expand"
      ], function (Map, MapView, FeatureLayer,TileLayer,GeoJSONLayer,BasemapToggle,BasemapLayerList,LayerList,Expand) {
        var arc_2d_map = new Map({
          basemap: "satellite"
        });
	
	
	  

        var arc_2d_view = new MapView({
          container: "2d_map",
          map: arc_2d_map,
	  center: [-94.18,40.55],  // Sets the center point of the view at a specified lon/lat
	  zoom: 12  // Sets the zoom LOD to 13

        });

        /********************
         * Add feature layer
         ********************/
	 
        var arc_2d_contour_geojsonLayer = new GeoJSONLayer({
	  	url: "contour_lines_10ft_simplified_WGS84.geojson",
		id: "Contour Lines",
		title: "Contour Lines",
		visible: false,
		renderer: {
			type: "simple",
			symbol: {
			  color: "#cccccc",
			  type: "simple-line",
			  style: "solid",
				width: .25
			}
		}
	});
	 
        arc_2d_map.add(arc_2d_contour_geojsonLayer);
	 
	 var arc_2d_pop_template = {
          title: "Stand info",
		 content: [
            		{
              			type: "fields",
              			fieldInfos: [
                			{
					  fieldName: "Name",
					  label: "Stand #"
					},
					{
					  fieldName: "ACRES",
					  label: "Acres"
					}
              			]
            		}
          	]
        };
	 
        var arc_2d_stands_geojsonLayer = new GeoJSONLayer({
	  	url: "stands_WGS84.geojson",
		id: "Forest Stands",
		title: "Forest Stands",
		visible: false,
		popupTemplate: arc_2d_pop_template,
		renderer: {
			  type: "simple",  // autocasts as new SimpleRenderer()
			  symbol: {
			    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
			    color: [255,255,0,.2],
			    outline: {  // autocasts as new SimpleLineSymbol()
			      width: 1,
			      color: "#ffff00"
			    }
			  }
			}
		
	});
	 
        arc_2d_map.add(arc_2d_stands_geojsonLayer);
	 
        var arc_2d_bdry_geojsonLayer = new GeoJSONLayer({
	  url: "LCF_boundary_WGS84.geojson",
		id: "Property Boundary",
		title: "Property Boundary",
		renderer: {
			  type: "simple",  // autocasts as new SimpleRenderer()
			  symbol: {
			    type: "simple-fill",  // autocasts as new SimpleFillSymbol()
			    color: "#0000ff",
			    style: "none",
			    outline: {  // autocasts as new SimpleLineSymbol()
			      width: 1.5,
			      color: "#0000ff"
			    }
			  }
			}
	});
	 
        arc_2d_map.add(arc_2d_bdry_geojsonLayer);
	/* 
	 var arc_2d_toggle = new BasemapToggle({
          view: arc_2d_view, 
          nextBasemap: "topo-vector" 
        });

        arc_2d_view.ui.add(arc_2d_toggle, "top-right");
	 
	 var arc_2d_layerList = new LayerList({
		  view: arc_2d_view
		});
	arc_2d_view.ui.add(arc_2d_layerList, { position: "bottom-right"});
	*/ 
	 
	 var arc_2d_basemapLayerList = new BasemapLayerList({
		  view: arc_2d_view
		});
	 
	 var arc_2d_layerListExpand = new Expand({
		//  expandIconClass: "esri-icon-layer-list",  
		  view: arc_2d_view,
		  content: arc_2d_basemaplayerList
		});
	arc_2d_view.ui.add(arc_2d_layerListExpand, "top-right");
	 
	     
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


