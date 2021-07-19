var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";  

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data) {
  // Once we get a response, send the data.features object to the createFeatures function
  console.log('show me some data: ', data);
  createFeatures(data.features);
});

function createFeatures(earthquakeData) {

  var geoJsonLayer = L.geoJson(earthquakeData, {
    
    style: function(feature) {
      if (feature.properties.mag >= 2) {
        return{color: "red"};
      }
      else if (feature.properties.mag <= 2 && feature.properties.mag >= 1.5) {
        return{color: "orange"};
      }
      else if (feature.properties.mag <= 1.5 && feature.properties.mag >= 1) {
        return{color: "yellow"};
      }
      else {
        return{color: "green"};
      }
    },
    
    pointToLayer: function (feature, latlng) {
      return L.circleMarker(latlng, {
        radius: Math.round(feature.properties.mag) * 5,
        fillOpacity: 0.9  
      });
    },
    
    onEachFeature: function (feature, layer) {
      var popupText = "<b>Magnitude:</b> " + feature.properties.mag +
      "<br><b>Location:</b> " + feature.properties.place +
      "<br><a href='" + feature.properties.url + "'>More info</a>";

      layer.bindPopup(popupText, {
        closeButton: true,
        offset: L.point(0, -20)
      });
      layer.on('click', function() {
        layer.openPopup();
      });
    }
  });
   
createMap(geoJsonLayer);
}
    
function createMap(geoJsonLayer) {
  // Adding tile layer to the map
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });  

  var baseMaps = {
    "Street Map": streetmap 
  };
  var overlayMaps = {
    Earthquakes: geoJsonLayer 
  };

  // Creating our map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, geoJsonLayer]
  });

  // Create a control layer
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

}  