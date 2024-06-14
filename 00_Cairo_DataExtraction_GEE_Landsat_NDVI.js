 // Cairo_Geom is imported as an asset in GEE (Geometry of Cairo)
  // Cairo_Dem is imported as an asset in GEE (Elevation of Cairo)

var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')  
.filterDate('2013-01-01', '2022-12-31') 
var ndvi = dataset.select('NDVI');
print(dataset)

Map.setCenter(31.4402, 30.0129, 9);
Map.addLayer(Cairo_Geom)

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = ee.ImageCollection(ndvi.map(function(image){return image.clip(Cairo_Geom)}));
print(bound);
// all the elements in bound(BBox clipped) are averaged out - function of mean, mediam , max, min etc
var avg_bound = bound.mean();
print('Mean', avg_bound);

var MAX_bound = bound.max();
print('Max', avg_bound);

var MIN_bound = bound.min();
print('Min', avg_bound);

//var mosaic = avg_bound.mosaic();
//print(mosaic);

// scale from DEM 
var scale = Cairo_Dem.projection().nominalScale(); 
print('Scale', scale);
// projection from DEM
var projection = Cairo_Dem.projection(); 
print('Proj' , projection);

var colorizedVis = {
min: 0.0,
max: 1.0,
palette: [
'FFFFFF', 'CE7E45', 'DF923D', 'F1B555', 'FCD163', '99B718', '74A901',
'66A000', '529400', '3E8601', '207401', '056201', '004C00', '023B01',
'012E01', '011D01', '011301'
],
};

// Set elevation <= 0 as transparent and add to the map
Map.centerObject(avg_bound); 
Map.addLayer(avg_bound, colorizedVis, "NDVI");

projection.evaluate(function(proj_obj) { 
Export.image.toDrive({ image: MIN_bound, 
description: 'Cairo_ndvi_1905', 
folder: 'DUFL', 
fileNamePrefix: 'Cairo_ndvi_Min_1905', 
scale: scale, 
crs: proj_obj.crs, 
crsTransform: proj_obj.transform, 
region: Cairo_Geom }); 

});

