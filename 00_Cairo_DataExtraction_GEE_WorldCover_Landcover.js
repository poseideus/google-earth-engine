// Import the dataset and select the elevation band
var dataset = ee.Image('ESA/WorldCover/v100/2020');
var landcover = dataset.select('Map');

// Define bounding box
// Cairo Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[31.161492363, 29.80747406], // bottom left
          [31.161492363, 30.202025678], // top left
          [31.687561187, 30.202025678], // top right
          [31.687561187, 29.80747406]]], // bottom right
          null, false); 

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = landcover.clip(geometry);

// Set elevation visualization properties
var landVis = {
  bands: ['Map'],
};

// Set elevation <= 0 as transparent and add to the map
Map.centerObject(bound);
Map.addLayer(bound, landVis, "Landcover");

// you need to have a google drive account
Export.image.toDrive({
    image: bound.toDouble(),
    description: 'WorldCover_10m_2020',
    folder: 'DUFL',
    fileNamePrefix: 'WorldCover_10m_2020',
    // use original data resolution (in meters), since we don't know which method google uses for resampling
    scale: 10, // without this parameter, it gives 1000m resolution
    // crs: 'EPSG:3857', // otherwise exports as 4326 by default
    fileFormat: 'GeoTIFF',
    maxPixels: 558844492 // avoiding export too large error
});