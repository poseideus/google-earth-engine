// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.0487919, -28.7750977], // top left
          [31.6635021, -28.7750977], // top right
          [31.6635021, -30.4996372]]], // bottom right
          null, false); 
          
// Import the dataset and select the elevation band
var dataset = ee.ImageCollection('COPERNICUS/DEM/GLO30');
var elevation = dataset.select('DEM');

// clip data on AOI (best is to define BBOX coordinates within the geometry variable)
var bound = elevation.filterBounds(geometry);
var imageList = bound.toList(bound.size());
print (imageList);
var size = bound.size().getInfo(); // to get maximum number of iterations
print (size);

// Set elevation visualization properties
var elevationVis = {
    min: 0,
    max: 3000,
  };
  
  // Set elevation <= 0 as transparent and add to the map
  Map.centerObject(bound);
  Map.addLayer(bound, elevationVis, "elevation");
  
  // // you need to GEE Asset for POC
  for (var i = 0; i < size; i++) {
    var image = ee.Image(imageList.get(i));
    // Retrieve the projection information from a band of the original image.
    // Call getInfo() on the projection to request a client-side object containing
    // the crs and transform information needed for the client-side Export function.
    var projection = image.projection();
    Export.image.toAsset({
      description: 'COP_30_DEM_Test_'+i,
      image: image,
      assetId: 'features/exported/COP_30_DEM',
      crs: projection.crs,
      crsTransform: projection.transform,
      // scale: 30,
      // fileNamePrefix: 'COP-30 DEM Test'+i,
      // folder: '/assets/features/exported/COP-30 DEM Test Durban'+i,
      // fileFormat: 'GeoTIFF'
      });
  }