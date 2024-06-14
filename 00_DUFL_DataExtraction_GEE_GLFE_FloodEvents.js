// Import the FeatureCollection
var flood_events = ee.FeatureCollection("projects/sat-io/open-datasets/events/large_flood_events_1985-2016");

// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.1019365, -28.8308994], // top left
          [31.6635021, -28.7750977], // top right
          [31.6608449, -30.4943228]]], // bottom right
          null, false); 
          
// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var durban_bound = flood_events.filterBounds(geometry);

// add layer to the map within the defined bbox
print('Total events 1985-2016',durban_bound.size())
Map.addLayer(durban_bound,{},'Flood Events 1985-2016');

// Export the FeatureCollection as a CSV to drive
Export.table.toDrive({
  collection: durban_bound,
  description: 'GLFE_1985-2016_Durban',
  folder: 'DUFL',
  fileNamePrefix: 'GLFE_1985_2016_Durban',
  fileFormat: 'CSV'
});