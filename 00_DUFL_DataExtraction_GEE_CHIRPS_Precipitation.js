// Define bounding box
// Durban Catchment - 29.0487919°E 30.4996372°S, 29.1019365°E 28.8308994°S, 31.6635021°E 28.7750977°S, 31.6608449°E 30.4943228°S
var geometry = 
    ee.Geometry.Polygon( // long, lat
        [[[29.0487919, -30.4996372], // bottom left
          [29.0487919, -28.7750977], // top left
          [31.6635021, -28.7750977], // top right
          [31.6635021, -30.4996372]]], // bottom right
          null, false); 

function flood(year, dataset, feature, name) {
    var startDate = year
    var endDate = year+1
    
    // Daily total precipitation sums
    var era5_tp = ee.ImageCollection(dataset)
                      .select(feature) 
                      .filter(ee.Filter.date(
                        startDate.toString()+'-01-01',
                        endDate.toString()+'-01-01'))
                      .map(function(image){return image.clip(geometry)});
   
    // Obtain max value for the whole year
    var max = era5_tp.max();
  
  //Export a cloud-optimized GeoTIFF.
  Export.image.toDrive({
    image: max,
    description: name+'_max_precip_'+startDate.toString(),
    folder:'DUFL',
    region: geometry,
    fileFormat: 'GeoTIFF',
    scale: 5566,
    formatOptions: {
      cloudOptimized: true
    }
  }); 
  return max
}

//EXPORT MONTHLY MAXIMA
for (var year = 2000; year <= 2023; year++)
  // flood(year,'ECMWF/ERA5/DAILY','total_precipitation','ECMWF')
  flood(year,'UCSB-CHG/CHIRPS/DAILY','precipitation','CHIRPS')