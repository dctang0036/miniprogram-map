function getCenter(points = []) {
  let center = {
    latitude: 0,
    longitude: 0
  };
  let len = points.length;
  if (len) {
    let latitude = 0, longitude = 0;
      
    points.forEach(point => {
      latitude += parseFloat(point.latitude);
      longitude += parseFloat(point.longitude);
    });

    center.latitude = latitude / len;
    center.longitude = longitude / len;
  }
  return center;
}

module.exports = {
  getCenter: getCenter
}