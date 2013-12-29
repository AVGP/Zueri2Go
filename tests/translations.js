casper.test.begin("Button translations are working", 6, function(test) {
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

  casper.run(function() {
    test.done();
  });
});