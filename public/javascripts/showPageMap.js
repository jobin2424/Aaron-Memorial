mapboxgl.accessToken = mapToken;       
const map = new mapboxgl.Map({
    container: 'map', 
    style: 'mapbox://styles/mapbox/streets-v12', 
    center: [-79.0203839826569, 43.85868106337982], 
    zoom: 14, 
});

const marker1 = new mapboxgl.Marker()
.setLngLat( [-79.0203839826569, 43.85868106337982])
    .addTo(map);

const popup = new mapboxgl.Popup({ closeOnClick: false })
.setLngLat([-79.0203839826569, 43.85868106337982])
.setHTML("<h3>Archbishop Denis O' Connor</h3>")
.addTo(map);