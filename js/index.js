i18n.init({fallbackLng: 'de', useCookie: false}, function(t) {
    $("#buttons").i18n();
    window.i18n = t;
});

var map = L.map('map').setView([47.367347, 8.5500025], 13);
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(map);

//Some functions

function loadPanoramicViews(pos, layers) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var panoramas = JSON.parse(this.responseText).result;
    var icon = L.icon({iconUrl: "img/panoramicview.png", iconAnchor: [16, 37]});
    var markers = [];
    for(var i=0;i<panoramas.length;i++) {
      var marker = L.marker([panoramas[i]["a.lat"], panoramas[i]["a.lon"]], {icon: icon});
      marker.bindPopup("<h2>" + panoramas[i]["a.Name"] + "</h2>");
      markers.push(marker);
    }
    if(layers.panoramicViews) map.removeLayer(layers.panoramicViews);
    layers.panoramicViews = L.layerGroup(markers);
    layers.panoramicViews.addTo(map);
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ {a.Name, a.lat, a.lon} | a <~ ch_zh_aussichtspunkt, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 ]'}));
}

function loadPlaygrounds(pos, layers) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var playgrounds = JSON.parse(this.responseText).result;
    var icon = L.icon({iconUrl: "img/playground.png", iconAnchor: [16, 37]});
    var markers = [];
    for(var i=0;i<playgrounds.length;i++) {
      var playground = playgrounds[i];
      var marker = L.marker([playground["lat"], playground["lon"]], {icon: icon});
      marker.bindPopup(
          "<h2>" + playground.Objektbezeichung + "</h2>" +
          "<p><strong>" + i18n("popups.ages") + ":</strong> " + playground.Alterskategorie + "</p>" +
          "<p><strong>" + i18n("popups.remarks") + ":</strong> " + playground.Besonderheiten + "</p>" +
          "<p><strong>" + i18n("popups.facilities") + ":</strong> " + playground.Infrastruktur +  ", " + playground.Spielgeraete + "<p>");
      marker.addTo(map);
      markers.push(marker);
    }
    if(layers.playgrounds) map.removeLayer(layers.playgrounds);
    layers.playgrounds = L.layerGroup(markers);
    layers.playgrounds.addTo(map);
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ a | a <~ ch_zh_spielplaetze, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 ]'}));
}

function loadToilets(pos, layers) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var toilets = JSON.parse(this.responseText).result;
    var icon = L.icon({iconUrl: "img/toilets.png", iconAnchor: [16, 37]});
    var markers = [];
    for(var i=0;i<toilets.length;i++) {
      var toilet = toilets[i];
      var marker = L.marker([toilet["lat"], toilet["lon"]], {icon: icon});
      marker.bindPopup(
          "<h2>" + toilet.name + "</h2>" +
          "<p><strong>" + i18n("popups.fee") + ":</strong> " + toilet.fee + "</p>");
      markers.push(marker);
    }
    if(layers.toilets) map.removeLayer(layers.toilets);
    layers.toilets = L.layerGroup(markers);
    layers.toilets.addTo(map);
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ a | a <~ osmpois, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 && a.type =~ "AMENITY_TOILETS"]'}));
}

function loadRestaurants(pos, layers) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var restaurants = JSON.parse(this.responseText).result;
    var icons = {
        "cafe":       L.icon({iconUrl: "img/cafe.png", iconAnchor: [16, 37]}),
        "fast_food":  L.icon({iconUrl: "img/fastfood.png", iconAnchor: [16, 37]}),
        "restaurant": L.icon({iconUrl: "img/restaurant.png", iconAnchor: [16, 37]})
    };
    var markers = {
        "cafe": [],
        "fast_food": [],
        "restaurant": []
    };
    for(var i=0;i<restaurants.length;i++) {
      var restaurant = restaurants[i];
      if(!document.getElementById("toggle_" + restaurant.amenity).classList.contains("on")) continue;
      var marker = L.marker([restaurant["lat"], restaurant["lon"]], {icon: icons[restaurant.amenity]});
      marker.bindPopup(
          "<h2>" + restaurant.name + "</h2>" +
          "<p><strong>" + i18n("popups.food_type") + ":</strong> " + restaurant.cuisine || '?' + "</p>");
      marker.addTo(map);
      markers[restaurant.amenity].push(marker);
    }
    for(property in markers) {
      if(!markers.hasOwnProperty(property)) continue;
      if(layers.restaurants[property]) map.removeLayer(layers.restaurants[property]);

      layers.restaurants[property] = L.layerGroup(markers[property]);
      layers.restaurants[property].addTo(map);
    }
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ a | a <~ osmpois, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 && a.type =~ "FOOD_RESTAURANT|FOOD_CAFE|FOOD_FASTFOOD"]'}));
}


//Get rolling!
function initApp() {
  var layers = {
    panoramicViews: null,
    playgrounds:    null,
    toilets:        null,
    restaurants:    {}
  };

  window.layers = layers;
  var initialLocation = true;
  navigator.geolocation.watchPosition(function success(pos) {
    if(initialLocation) map.setView([pos.coords.latitude, pos.coords.longitude], 16);
    L.circle([pos.coords.latitude, pos.coords.longitude], 20, { color: "#f88", fillColor: "#f88", fillOpacity: 1.0 }).addTo(map);
    if(document.getElementById("togglePanoramicviews").classList.contains("on")) loadPanoramicViews (pos, layers);
    if(document.getElementById("togglePlaygrounds"   ).classList.contains("on")) loadPlaygrounds    (pos, layers);
    if(document.getElementById("toggleToilets"       ).classList.contains("on")) loadToilets        (pos, layers);
    if(document.getElementById("toggle_restaurant"   ).classList.contains("on") ||
       document.getElementById("toggle_cafe"         ).classList.contains("on") ||
       document.getElementById("toggle_fast_food"    ).classList.contains("on")) loadRestaurants    (pos, layers);

    initialLocation = false;
  }, function error(err) { console.log("Dang, no geolocation!", err); });

  document.getElementById("togglePanoramicviews").addEventListener("click", function() {
    this.classList.toggle("on");
    (map.hasLayer(layers.panoramicViews) ? map.removeLayer(layers.panoramicViews) : map.addLayer(layers.panoramicViews));
  });


  document.getElementById("togglePlaygrounds").addEventListener("click", function(e) {
    this.classList.toggle("on");
    (map.hasLayer(layers.playgrounds) ? map.removeLayer(layers.playgrounds) : map.addLayer(layers.playgrounds));
  });

  document.getElementById("toggleToilets").addEventListener("click", function() {
    this.classList.toggle("on");
    (map.hasLayer(layers.toilets) ? map.removeLayer(layers.toilets) : map.addLayer(layers.toilets));
  });

  document.getElementById("toggle_restaurant").addEventListener("click", function() {
    this.classList.toggle("on");
    (map.hasLayer(layers.restaurants.restaurant) ? map.removeLayer(layers.restaurants.restaurant) : map.addLayer(layers.restaurants.restaurant));
  });

  document.getElementById("toggle_cafe").addEventListener("click", function() {
    this.classList.toggle("on");
    (map.hasLayer(layers.restaurants.cafe) ? map.removeLayer(layers.restaurants.cafe) : map.addLayer(layers.restaurants.cafe));
  });

  document.getElementById("toggle_fast_food").addEventListener("click", function() {
    this.classList.toggle("on");
    (map.hasLayer(layers.restaurants.fast_food) ? map.removeLayer(layers.restaurants.fast_food) : map.addLayer(layers.restaurants.fast_food));
  });
}

if("ondevicready" in document) {
  //We're in PhoneGap
  document.addEventListener("deviceready", initApp);
} else {
  initApp();
}






