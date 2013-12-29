function testMarkerType(test, imgFileName, expectedNumber, expectedName) {
  casper.then(function() {
    this.waitUntilVisible("img[src=\"img/" + imgFileName + "\"]", function() {
      this.click("img[src=\"img/" + imgFileName + "\"]")
    });
  });

  casper.then(function() {
    console.log(this.fetchText(".leaflet-popup-content"));
    test.assertElementCount("img[src=\"img/" + imgFileName + "\"]", expectedNumber);
    test.assertVisible(".leaflet-popup-content");
  });
}


//And the tests begin!

casper.test.begin("Testing markers and popups", 17, function(test) {
  casper.start("https://preview.c9.io/avgp/zueri2go/Zueri2Go/www/index.html");

  // Loading the markers manually (as we don't have geolocation available)
  casper.then(function() {
    this.evaluate(function() {
      var pos = {coords: { latitude: 47.376786, longitude: 8.494556 }};
      loadPanoramicViews(pos, {});
      loadPlaygrounds(pos, {});
      loadToilets(pos, {});
      loadRestaurants(pos, {});
    });
  });

  testMarkerType(test, "panoramicview.png", 2);

  testMarkerType(test, "playground.png", 27);
  casper.then(function() {
    test.assertTextExists("Altersgruppe:");
    test.assertTextExists("Besonderheiten:");
  });

  testMarkerType(test, "toilets.png", 18);
  casper.then(function() {
    test.assertTextExists("Gebühr:");
  });

  testMarkerType(test, "restaurant.png", 73);
  casper.then(function() {
    test.assertTextExists("Küche:");
  });

  testMarkerType(test, "cafe.png", 17);
  testMarkerType(test, "fastfood.png", 11);
  casper.then(function() {
    test.assertTextExists("Küche:");
  });

  // And run it!
  casper.run(function() {
    test.done();
  });

});