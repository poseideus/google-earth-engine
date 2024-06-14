// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    /* color: #d63000 */
    /* displayProperties: [
      {
        "type": "rectangle"
      }
    ] */
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.1019365, -28.8308994], // top left
          [31.6635021, -28.7750977], // top right
          [31.6608449, -30.4943228]]], // bottom right
          null, false); 

// import batch export tool for ImageCollection by fitoprincipe
var batch = require('users/fitoprincipe/geetools:batch');

// Import the dataset and filter the time period as well AOI
var dataset = ee.ImageCollection('LANDSAT/LC09/C02/T1')
.filterDate('2022-01-01', '2023-02-01')
.filterBounds(geometry);

// Select the colour bands
var trueColor432 = dataset.select(['B4', 'B3', 'B2']);

// Set true colour visualization properties
var trueColor432Vis = {
    min: 0.0,
    max: 30000.0,
};

Map.centerObject(geometry);
Map.addLayer(trueColor432, trueColor432Vis, 'True Color (432)');

// Batch download an image collection
batch.Download.ImageCollection.toDrive(dataset, "DUFL", {scale:30});