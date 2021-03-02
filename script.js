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

//forest stands
var l_stands;

//property boundary
var l_boundary;

var l_baseMaps;
var l_overlays;


fetch(
 "contour_lines_10ft_simplified_WGS84.geojson"
).then(
  res => res.json()
).then(function(data){
  	l_contours = L.geoJson(data,{	     
	    "color": "#cccccc",
	    "weight": .25,
	    "opacity": 1
	      }).addTo(l_map);
	}
).then(function(){
		fetch(
		 "stands_WGS84.geojson"
		).then(
		  res => res.json()
		).then(function(data){
			l_stands = L.geoJson(data,{	     
			    "color": "#ffff00",
			    "weight": 1.5,
			    "opacity": 1,
			    "fillOpacity": .2,
				onEachFeature: onEachFeature
			 }).addTo(l_map);
			}
		).then(function(){

				fetch(
				 "LCF_boundary_WGS84.geojson"
				).then(
				  res => res.json()
				).then(function(data){
					l_boundary = L.geoJson(data,{	     
					    "color": "#0000ff",
					    "weight": 3,
					    "opacity": 1,
					    "fillOpacity": 0
					 }).addTo(l_map);
					}
				).then(function(){
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
					}

				)
			}
		)
	}
)
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
 
	 var arc_2d_toggle = new BasemapToggle({
          view: arc_2d_view, 
          nextBasemap: "topo-vector" 
        });

        arc_2d_view.ui.add(arc_2d_toggle, "top-right");
	 
	 var arc_2d_layerList = new LayerList({
		  view: arc_2d_view,
		 container: "2d_map_window_inner"
		});
	arc_2d_view.ui.add(arc_2d_layerList, { position: "bottom-right"});
	 
	/* 
	 var arc_2d_layerListExpand = new Expand({
		  view: arc_2d_view,
		 content: "2d_map_window_inner"
		});
	arc_2d_view.ui.add(arc_2d_layerListExpand, "bottom-right");
	*/ 
	/*
	 var arc_2d_basemapLayerList = new BasemapLayerList({
		  view: arc_2d_view,
		 container: document.createElement("div")
		});
	 
	 var arc_2d_layerListExpand = new Expand({
		  expandIconClass: "esri-icon-layers",  
		  view: arc_2d_view,
		 //content: arc_2d_basemapLayerList,
		 content: arc_2d_basemapLayerList.container,
		 container: "2d_map_inner",
		 style:{
			 
    position: fixed;
    top: 0;
    bottom: 0;
    margin: 0;
    height: 100%;
    background: #fff;
    z-index: 1;
    overflow: auto;
		}
	arc_2d_view.ui.add(arc_2d_layerListExpand, "top-right");
		
		/*
	 var layerList = new LayerList({
	  container: document.createElement("div"),
	  view: arc_2d_view
	});
	var layerListExpand = new Expand({
	  expandIconClass: "esri-icon-layer-list",  // see https://developers.arcgis.com/javascript/latest/guide/esri-icon-font/
	  // expandTooltip: "Expand LayerList", // optional, defaults to "Expand" for English locale
	  view: arc_2d_view,
	  container: "2d_map_inner",
	  content: layerList
	});
	arc_2d_view.ui.add(layerListExpand, "top-right");
	     */
});




/***************************
**
**	ArcGIS 3D API
**
***************************/


require([
      "esri/Map",
      "esri/WebScene",
      "esri/views/SceneView",
      "esri/Camera",
      "esri/widgets/Home",
      "esri/layers/GeoJSONLayer",
	 "esri/widgets/BasemapToggle",
	 "esri/widgets/BasemapLayerList",
	 "esri/widgets/LayerList",
	 "esri/widgets/Expand",
      "dojo/domReady!"
    ], function(Map,WebScene, SceneView, Camera, Home, GeoJSONLayer,BasemapToggle,BasemapLayerList,LayerList,Expand) {

    
          var arc_3d_map = new Map({
	    basemap: "satellite",
	    ground: "world-elevation",
		  center: [-94.18,40.55],  // Sets the center point of the view at a specified lon/lat
		  zoom: 12  // Sets the zoom LOD to 13
	  });
	
	
	      var LC_cam = new Camera({
		position: [
			-94.18,
			40.55,
			9000// elevation in meters
		],
		tilt: 0,
		heading: 0,
		fov: 90
	      });
	
	  var arc_3d_view = new SceneView({
	    container: "3d_map", // Reference to the DOM node that will contain the view
	    camera: LC_cam // References the map object created in step 3
	  });

        /********************
         * Add feature layer
         ********************/
	 
        var arc_3d_contour_geojsonLayer = new GeoJSONLayer({
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
	 
        arc_3d_map.add(arc_3d_contour_geojsonLayer);
	 
	 var arc_3d_pop_template = {
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
	 
        var arc_3d_stands_geojsonLayer = new GeoJSONLayer({
	  	url: "stands_WGS84.geojson",
		id: "Forest Stands",
		title: "Forest Stands",
		visible: false,
		popupTemplate: arc_3d_pop_template,
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
	 
        arc_3d_map.add(arc_3d_stands_geojsonLayer);
	 
        var arc_3d_bdry_geojsonLayer = new GeoJSONLayer({
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
	 
        arc_3d_map.add(arc_3d_bdry_geojsonLayer);
 
	 var arc_3d_toggle = new BasemapToggle({
          view: arc_3d_view, 
          nextBasemap: "topo-vector" 
        });

        arc_3d_view.ui.add(arc_3d_toggle, "top-right");
	 
	 var arc_3d_layerList = new LayerList({
		  view: arc_3d_view,
		 container: "3d_map_window_inner"
		});
	arc_3d_view.ui.add(arc_3d_layerList, { position: "bottom-right"});

	
	
	
	      var boston_camera = new Camera({
		position: [
		  -71.061434,
		  42.360693,
		  9000// elevation in meters
		],
		tilt: 0,
		heading: 0,
		fov: 90
	      });

	      var camera = new Camera({
		position: [
		  -71.09777751,
		  42.34625234,
		  2// elevation in meters
		],
		tilt: 90,
		heading: 45
	      });

	      var camera2 = new Camera({
		position: {
		  x: -71.061179,
		  y: 42.377092,
		  z: 2
		},
		tilt: 90,
		heading: 155
	      });

	      var camera3 = new Camera({
		position: {
		  x: -71.025577,
		  y: 42.355583,
		  z: 1000
		},
		tilt: 65,
		heading: 277
	      });

	      var view =  new SceneView({
		container: "viewDiv",
		map: arc_3d_map,
		viewingMode:"global",
		camera: boston_camera,
		environment: {
		    lighting: {
		      date: new Date(),
		      directShadowsEnabled: true,
		      // don't update the view time when user pans.
		      // The clock widget drives the time
		      cameraTrackingEnabled: false
		    }
		},
	    });

	    var homeBtn = new Home({
		  view: view
		});


		view.ui.add(homeBtn, "top-left");
/*
		[fen, bh, dwntn].forEach(function(button) {
		  button.style.display = 'flex';
		  view.ui.add(button, 'top-right');
		});



	    // bunker hill
	    bh.addEventListener('click', function() {
	    view.goTo({
		target:camera2
	      });
	    });

	    //fenway park
	    fen.addEventListener('click', function() {
	     view.goTo({
		target:camera
	      });
	    });

	      //downtown from SE
	    dwntn.addEventListener('click', function() {
	      view.goTo({
		target:camera3
	      });
	    });

*/
    });
