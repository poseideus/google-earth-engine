// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[30.5594444444444449, -30.2687500000000114], // bottom left
          [30.5594444444444449, -29.5006944444444557], // top left
          [31.1866666666666674, -29.5006944444444557], // top right
          [31.1866666666666674, -30.2687500000000114]]], // bottom right
          null, false); 

// New AOI - 30.5594444444444449,-30.2687500000000114 : 31.1866666666666674,-29.5006944444444557

// Import the dataset and select the elevation band
var dataset = ee.ImageCollection('COPERNICUS/DEM/GLO30');
var water_mask = dataset.select('WBM').filterBounds(geometry);

Map.addLayer(geometry);
Map.centerObject(geometry);

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = ee.ImageCollection(water_mask.map(function(image){return image.clip(geometry)})).mosaic();

// scale from DEM 
var scale = bound.projection().nominalScale(); 
print('Scale', scale);
// projection from DEM
var projection = bound.projection(); 
print('Proj' , projection);

// Set elevation visualization properties
var elevationVis = {
    min: 0,
    max: 3000,
  };
  
// Set elevation <= 0 as transparent and add to the map
Map.addLayer(bound, elevationVis, "elevation");

// Export
projection.evaluate(function(proj_obj) { 
Export.image.toDrive({ 
  image: bound, 
  description: 'Durban_WBM', 
  folder: 'DUFL', 
  fileNamePrefix: 'Durban_WBM', 
  scale: scale, 
  crs: proj_obj.crs, 
  crsTransform: proj_obj.transform, 
  region: geometry }); 
});