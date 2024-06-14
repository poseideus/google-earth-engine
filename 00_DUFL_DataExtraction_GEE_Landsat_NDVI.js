  // DEM_Durban is imported as an asset in GEE (DEM of Durban)
 
Map.setCenter(30.9129, -29.8345, 9);
var dataset = ee.ImageCollection('LANDSAT/LC08/C01/T1_32DAY_NDVI')  
                                .filterDate('2019-04-01', '2022-5-31') 
                                //.filterDate('2013-01-01', '2022-12-31') 
var ndvi = dataset.select('NDVI');
print(dataset)

//geometry of the AOI - Durban
var geometry =
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.0487919, -28.7750977], // top left
          [31.6635021, -28.7750977], // top right
          [31.6635021, -30.4996372]]], // bottom right
          null, false);
          
Map.addLayer(geometry)

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = ee.ImageCollection(ndvi.map(function(image){return image.clip(geometry)}));
print(bound);
// all the elements in bound(BBox clipped) are averaged out - function of mean, mediam , max, min etc
var avg_bound = bound.mean();
print('Mean', avg_bound);

//var mosaic = avg_bound.mosaic();
//print(mosaic);

// scale from DEM 
var scale = DEM_Durban.projection().nominalScale(); 
print('Scale', scale);
// projection from DEM
var projection = DEM_Durban.projection(); 
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
  Export.image.toDrive({ 
    image: avg_bound, 
    description: 'Durban_ndvi_1905', 
    folder: 'DUFL', 
    fileNamePrefix: 'Durban_ndvi_1905_01', 
    scale: scale, 
    crs: proj_obj.crs, 
    crsTransform: proj_obj.transform, 
    region: geometry }); 
});

