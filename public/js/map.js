
  let mapToken=maptoken;
  console.log(mapToken);
maptilersdk.config.apiKey = mapToken;
const map = new maptilersdk.Map({
  container: 'map', // container's id or the HTML element in which the SDK will render the map
  style: maptilersdk.MapStyle.STREETS,
  center:coordinates, // starting position [lng, lat]
  zoom: 13 // starting zoom
});
maptilersdk.config.apiKey = mapToken;


new maptilersdk.Marker({color:"red"})
  .setLngLat(coordinates)
  .setPopup(new maptilersdk.Popup({offset:25}).setHTML(`<h4>${title}</h4><p> Exact location will be updated after booking</p>`))
  .addTo(map);
