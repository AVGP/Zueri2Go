function testMarkerType(test, imgFileName, expectedPopupContent) {
  casper.then(function() {
    this.waitUntilVisible("img[src=\"img/" + imgFileName + "\"]", function() {
      this.click("img[src=\"img/" + imgFileName + "\"]")
    });
  });

  casper.then(function() {
    test.assertTextExists(expectedPopupContent, "Popup contains " + expectedPopupContent);
    this.click("img[src=\"img/" + imgFileName + "\"]");
  });
}

casper.options.waitTimeout = 10000;
casper.test.begin("Translations are working", 11, function(test) {
  casper.start("https://preview.c9.io/avgp/zueri2go/Zueri2Go/www/index.html?setLng=it", function() {
    casper.waitForResource("translation.json", function() {
      test.assertTextExists("Punti di vista", "'Panoramic Views' is translated.");
      test.assertTextExists("Ristoranti", "'Restaurants' is translated.");

      test.assertTextExists("Campi da gioco", "'Playgrounds' is translated.");
      test.assertTextExists("Caffè", "'Cafes' is translated.");

      test.assertTextExists("Servizi igienici", "'Toilets' is translated.");
      test.assertTextExists("Snack", "'Fast food' is translated.");
    });
  });

    // Loading the markers manually (as we don't have geolocation available)
    casper.then(function() {
      this.evaluate(function() {
        var pos = {coords: { latitude: 47.376786, longitude: 8.494556 }};
        loadPlaygrounds(pos, {});
        loadToilets(pos, {});
        loadRestaurants(pos, {});
      });
    });

  testMarkerType(test, "playground.png", "Fascia di età:");
  testMarkerType(test, "playground.png", "Speciale:");
  testMarkerType(test, "playground.png", "Apparecchiatura:");
  testMarkerType(test, "toilets.png", "Tassa:");
  testMarkerType(test, "restaurant.png", "Cucina:");

  casper.run(function() {
    test.done();
  });
});