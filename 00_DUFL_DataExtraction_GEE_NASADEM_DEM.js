// Import the dataset and select the elevation band
var dataset = ee.Image('NASA/NASADEM_HGT/001');
var elevation = dataset.select('elevation');

// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.0487919, -28.7750977], // top left
          [31.6635021, -28.7750977], // top right
          [31.6635021, -30.4996372]]], // bottom right
          null, false); 

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = elevation.clip(geometry);

// Set elevation visualization properties
var elevationVis = {
  min: 0,
  max: 3000,
};

// Set elevation <= 0 as transparent and add to the map
Map.centerObject(bound);
Map.addLayer(bound, elevationVis, "elevation");

// you need to have a google drive account
Export.image.toDrive({
    image: bound.toDouble(),
    description: 'NASADEM_30m_2000',
    folder: 'DUFL',
    fileNamePrefix: 'NASADEM_30m_2000',
    // use original data resolution (in meters), since we don't know which method google uses for resampling
    scale: 30, // without this parameter, it gives 1000m resolution
    crs: 'EPSG:3857', // otherwise exportes as 4326 by default
    fileFormat: 'GeoTIFF'
})