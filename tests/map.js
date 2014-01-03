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
casper.options.waitTimeout = 10000;
casper.test.begin("Testing markers and popups", 17, function(test) {
  casper.start("https://preview.c9.io/avgp/zueri2go/Zueri2Go/www/index.html?setLng=de");

  // Loading the markers manually (as we don't have geolocation available)
  // casper.then(function() {
  //   this.evaluate(function() {
  //     var pos = {coords: { latitude: 47.376786, longitude: 8.494556 }};
  //     loadPanoramicViews(pos, {}, 2);
  //     loadPlaygrounds   (pos, {}, 2);
  //     loadToilets       (pos, {}, 2);
  //     loadRestaurants   (pos, {}, 2);
  //   });
  // });

  testMarkerType(test, "panoramicview.png", 13);

  testMarkerType(test, "playground.png", 28);
  casper.then(function() {
    test.assertTextExists("Altersgruppe:");
    test.assertTextExists("Besonderheiten:");
  });

  testMarkerType(test, "toilets.png", 40);
  casper.then(function() {
    test.assertTextExists("Gebühr:");
  });

  testMarkerType(test, "restaurant.png", 355);
  casper.then(function() {
    test.assertTextExists("Küche:");
  });

  testMarkerType(test, "cafe.png", 86);
  testMarkerType(test, "fastfood.png", 51);
  casper.then(function() {
    test.assertTextExists("Küche:");
  });

  // And run it!
  casper.run(function() {
    test.done();
  });

});