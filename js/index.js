var map = L.map('map').setView([47.367347, 8.5500025], 13);
L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(map);

//Some functions

function loadPanoramicViews(pos) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var panoramas = JSON.parse(this.responseText).result;
    var icon = L.icon({iconUrl: "img/panoramicview.png", iconAnchor: [16, 37]});
    for(var i=0;i<panoramas.length;i++) {
      var marker = L.marker([panoramas[i]["a.lat"], panoramas[i]["a.lon"]], {icon: icon});
      marker.bindPopup("<h2>" + panoramas[i]["a.Name"] + "</h2>");
      marker.addTo(map);
    }
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ {a.Name, a.lat, a.lon} | a <~ ch_zh_aussichtspunkt, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 ]'}));
}

function loadPlaygrounds(pos) {
  var xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var playgrounds = JSON.parse(this.responseText).result;
    console.log(playgrounds, playgrounds[0]);
    var icon = L.icon({iconUrl: "img/playground.png", iconAnchor: [16, 37]});
    for(var i=0;i<playgrounds.length;i++) {
      var playground = playgrounds[i];
      var marker = L.marker([playground["lat"], playground["lon"]], {icon: icon});
      marker.bindPopup(
          "<h2>" + playground.Objektbezeichung + "</h2>" + 
          "<p><strong>Altersgruppe:</strong> " + playground.Alterskategorie + "</p>" +
          "<p><strong>Besonderheiten:</strong> " + playground.Besonderheiten + "</p>" +
          "<p><strong>Ausstattung</strong>: " + playground.Infrastruktur +  ", " + playground.Spielgeraete + "<p>");
      marker.addTo(map);
    }
  };
  xhr.open('post', 'https://data.mingle.io/');
  xhr.send(JSON.stringify({expr: '[ a | a <~ ch_zh_spielplaetze, dist(a.lat, a.lon, ' + pos.coords.latitude + ', ' + pos.coords.longitude + ') < 2.0 ]'}));
}

//Get rolling!

document.addEventListener("deviceready", function() {
  navigator.geolocation.getCurrentPosition(function success(pos) {
    map.setView([pos.coords.latitude, pos.coords.longitude], 15);
    L.circle([pos.coords.latitude, pos.coords.longitude], 20, { color: "#f88", fillColor: "#f88", fillOpacity: 1.0 }).addTo(map);
    loadPanoramicViews(pos);
    loadPlaygrounds(pos);
  });
});