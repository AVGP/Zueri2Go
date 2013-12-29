casper.test.begin("Buttons are present and visible", 12, function(test) {
  casper.start("https://preview.c9.io/avgp/zueri2go/Zueri2Go/www/index.html", function() {
    test.assertExists("#togglePanoramicviews", "Toggle button for panoramic views exists");
    test.assertVisible("#togglePanoramicviews", "Toggle for panoramic views is visible");

    test.assertExists("#toggle_restaurant", "Toggle button for restaurants exists");
    test.assertVisible("#toggle_restaurant", "Toggle for restaurants is visible");

    test.assertExists("#togglePlaygrounds", "Toggle button for playgrounds exists");
    test.assertVisible("#togglePlaygrounds", "Toggle for playgrounds is visible");

    test.assertExists("#toggle_cafe", "Toggle button for cafes exists");
    test.assertVisible("#toggle_cafe", "Toggle for cafes is visible");

    test.assertExists("#toggleToilets", "Toggle button for toilet exists");
    test.assertVisible("#toggleToilets", "Toggle for toilets is visible");

    test.assertExists("#toggle_fast_food", "Toggle button for fast food exists");
    test.assertVisible("#toggle_fast_food", "Toggle for fast food is visible");

  });

  casper.run(function() {
    test.done();
  });
});